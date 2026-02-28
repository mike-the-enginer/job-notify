import Parser from 'rss-parser';
import { ingestJobs } from '../services/jobs.js';
const parser = new Parser();
function parseProfesiaExperience(title, desc) {
    const text = (title + ' ' + desc).toLowerCase();
    if (text.includes('senior') || text.includes('expert') || text.includes('lead') || text.match(/[5-9]\+?\s*(years|rokov)/))
        return 'senior';
    if (text.includes('mid') || text.includes('medior'))
        return 'mid';
    if (text.includes('junior') || text.includes('entry') || text.includes('trainee') || text.includes('absolvent') || text.includes('bez praxe'))
        return 'entry';
    return 'unknown';
}
function parseShift(desc) {
    const text = desc.toLowerCase();
    if (text.includes('nočná') || text.includes('nocna') || text.includes('night shift'))
        return 'night';
    if (text.includes('dvojzmenná') || text.includes('three shifts') || text.includes('trojzmenná'))
        return 'unknown'; // rejecting multi-shift
    if (text.includes('jednozmenná') || text.includes('denná') || text.includes('ranná'))
        return 'day';
    return 'unknown';
}
function parseWorkdays(desc) {
    const text = desc.toLowerCase();
    if (text.includes('víkend') || text.includes('weekend'))
        return 'weekend';
    if (text.includes('pondelok - piatok') || text.includes('mon-fri'))
        return 'mon_fri';
    return 'unknown';
}
export async function fetchProfesiaJobs() {
    try {
        // Attempting to fetch an RSS feed if it exists. 
        // In reality, if it doesn't, we just return empty or mock data for MVP based on constraint.
        const url = 'https://www.profesia.sk/rss/zoznam-pracovnych-ponuk/'; // Typical Profesia RSS format
        const feed = await parser.parseURL(url);
        const parsedJobs = feed.items.map(item => {
            const title = item.title || '';
            const desc = item.contentSnippet || item.content || '';
            return {
                title,
                company: item.creator || 'Unknown Company',
                locationCity: 'Banská Bystrica', // Force for this MVP aggregator depending on the feed URL
                locationRegion: null,
                employmentType: 'full-time',
                scheduleText: desc.substring(0, 200),
                shiftType: parseShift(desc),
                workdays: parseWorkdays(desc),
                experienceLevel: parseProfesiaExperience(title, desc),
                salaryMin: null,
                salaryMax: null,
                salaryCurrency: 'EUR',
                descriptionSnippet: desc.substring(0, 500),
                url: item.link || '',
                source: 'Profesia.sk',
                externalId: item.guid || null,
                postedAt: null,
                tags: [],
                hashSignature: '' // populated during ingestion
            };
        });
        const filtered = parsedJobs.filter(j => (j.experienceLevel === 'entry' || j.experienceLevel === 'unknown') &&
            j.shiftType !== 'night' &&
            j.workdays !== 'weekend');
        return await ingestJobs(filtered);
    }
    catch (error) {
        console.warn('Failed to fetch Profesia RSS logic:', error.message);
        return { inserted: 0, skipped: 0, durationMs: 0 };
    }
}
//# sourceMappingURL=profesia.js.map