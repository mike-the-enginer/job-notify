import cron from 'node-cron';
import { fetchProfesiaJobs } from './profesia.js';

export function startCronJobs() {
    // Run every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
        console.log('Running job ingestion cron...');
        const result = await fetchProfesiaJobs();
        console.log(`Ingestion completed in ${result.durationMs}ms: inserted ${result.inserted}, skipped ${result.skipped}`);
    });
    console.log('Cron jobs started.');
}
