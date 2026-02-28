import prisma from './db.js';
import { v4 as uuidv4 } from 'uuid';
import { Job } from 'shared';
import crypto from 'crypto';
import { notifyAllNewJobs } from './notifications.js';

export async function ingestJobs(sourceJobs: Omit<Job, 'id' | 'discoveredAt'>[]) {
    const newJobs: any[] = [];
    const start = Date.now();
    let inserted = 0;
    let skipped = 0;

    for (const raw of sourceJobs) {
        const hashSignature = crypto
            .createHash('sha256')
            .update(`${raw.title}-${raw.company}-${raw.locationCity}`)
            .digest('hex');

        try {
            const existing = await prisma.job.findUnique({ where: { hashSignature } });
            if (existing) {
                skipped++;
                continue;
            }

            const jobData = {
                ...raw,
                hashSignature
            };

            const newJob = await prisma.job.create({ data: jobData });
            newJobs.push(newJob);
            inserted++;
        } catch (e) {
            console.error(`Error processing job: ${e}`);
            skipped++;
        }
    }

    // notify subscribers
    await notifyAllNewJobs(newJobs);

    return { inserted, skipped, durationMs: Date.now() - start };
}
