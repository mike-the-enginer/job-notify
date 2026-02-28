import * as cheerio from 'cheerio';

async function test() {
    try {
        const res = await fetch('https://www.profesia.sk/praca/banska-bystrica/');
        const html = await res.text();
        const $ = cheerio.load(html);

        const jobs: any[] = [];
        $('.list-row').each((i, el) => {
            const titleEl = $(el).find('h2 a');
            const title = titleEl.text().trim();
            const url = titleEl.attr('href') || '';
            const company = $(el).find('.employer').text().trim();
            const details = $(el).find('.job-location').text().trim();
            const desc = $(el).text().trim(); // Just get all text from the row

            if (title) {
                jobs.push({ title, url: 'https://profesia.sk' + url, company, details, desc });
            }
        });

        console.log(JSON.stringify(jobs.slice(0, 1), null, 2));
    } catch (e) {
        console.error("Scraping error:", e);
    }
}
test();
