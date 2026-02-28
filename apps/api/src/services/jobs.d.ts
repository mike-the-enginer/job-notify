import { Job } from 'shared';
export declare function ingestJobs(sourceJobs: Omit<Job, 'id' | 'discoveredAt'>[]): Promise<{
    inserted: number;
    skipped: number;
    durationMs: number;
}>;
//# sourceMappingURL=jobs.d.ts.map