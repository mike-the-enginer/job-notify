import * as cheerio from 'cheerio';
import { ingestJobs } from '../services/jobs.js';
import { Job } from 'shared';

function parseProfesiaExperience(title: string, desc: string): 'entry' | 'junior' | 'mid' | 'senior' | 'unknown' {
    const text = (title + ' ' + desc).toLowerCase();
    if (text.includes('senior') || text.includes('expert') || text.includes('lead') || text.match(/[5-9]\+?\s*(years|rokov)/)) return 'senior';
    if (text.includes('mid') || text.includes('medior')) return 'mid';
    if (text.includes('junior') || text.includes('entry') || text.includes('trainee') || text.includes('absolvent') || text.includes('bez praxe')) return 'entry';
    return 'unknown';
}

function parseShift(desc: string): 'day' | 'night' | 'unknown' {
    const text = desc.toLowerCase();
    if (text.includes('nočná') || text.includes('nocna') || text.includes('night shift')) return 'night';
    if (text.includes('dvojzmenná') || text.includes('three shifts') || text.includes('trojzmenná')) return 'unknown'; // rejecting multi-shift
    if (text.includes('jednozmenná') || text.includes('denná') || text.includes('ranná')) return 'day';
    return 'unknown';
}

function parseWorkdays(desc: string): 'mon_fri' | 'weekend' | 'unknown' {
    const text = desc.toLowerCase();
    if (text.includes('víkend') || text.includes('weekend')) return 'weekend';
    if (text.includes('pondelok - piatok') || text.includes('mon-fri')) return 'mon_fri';
    return 'unknown';
}

export async function fetchProfesiaJobs() {
    try {
        const url = 'https://www.profesia.sk/praca/banska-bystrica/';
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const html = await res.text();
        const $ = cheerio.load(html);

        const parsedJobs: Omit<Job, 'id' | 'discoveredAt'>[] = [];

        $('.list-row').each((i, el) => {
            const titleEl = $(el).find('h2 a');
            const title = titleEl.text().trim();
            const jobUrl = titleEl.attr('href') || '';
            const company = $(el).find('.employer').text().trim();
            const desc = $(el).text().trim(); // Full text of the row for filtering

            if (title) {
                parsedJobs.push({
                    title,
                    company: company || 'Unknown Company',
                    locationCity: 'Banská Bystrica', // implicit from the URL
                    locationRegion: null,
                    employmentType: 'full-time',
                    scheduleText: desc.substring(0, 200),
                    shiftType: parseShift(desc),
                    workdays: parseWorkdays(desc),
                    experienceLevel: parseProfesiaExperience(title, desc),
                    salaryMin: null,
                    salaryMax: null,
                    salaryCurrency: 'EUR',
                    descriptionSnippet: desc.substring(0, 500).replace(/\s+/g, ' '),
                    url: 'https://profesia.sk' + jobUrl,
                    source: 'Profesia.sk',
                    externalId: jobUrl.split('?')[0], // Extract ID part of URL roughly
                    postedAt: null,
                    tags: [],
                    hashSignature: ''
                });
            }
        });

        // Apply filters directly based on user criteria
        const filtered = parsedJobs.filter(j =>
            (j.experienceLevel === 'entry' || j.experienceLevel === 'unknown') &&
            j.shiftType !== 'night' &&
            j.workdays !== 'weekend'
        );

        return await ingestJobs(filtered);
    } catch (error) {
        console.warn('Failed to fetch Profesia HTML logic:', (error as Error).message);
        return { inserted: 0, skipped: 0, durationMs: 0 };
    }
}
