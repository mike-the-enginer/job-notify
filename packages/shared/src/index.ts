import { z } from 'zod';

export const jobSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  company: z.string(),
  locationCity: z.string(),
  locationRegion: z.string().nullable(),
  employmentType: z.string().nullable(),
  scheduleText: z.string().nullable(),
  shiftType: z.enum(['day', 'night', 'unknown']),
  workdays: z.enum(['mon_fri', 'weekend', 'unknown']),
  experienceLevel: z.enum(['entry', 'junior', 'mid', 'senior', 'unknown']),
  salaryMin: z.number().nullable(),
  salaryMax: z.number().nullable(),
  salaryCurrency: z.string().nullable(),
  descriptionSnippet: z.string(),
  url: z.string().url(),
  source: z.string(),
  externalId: z.string().nullable(),
  postedAt: z.string().nullable(), // ISO string
  discoveredAt: z.string(), // ISO string
  tags: z.array(z.string()),
});

export type Job = z.infer<typeof jobSchema>;

export const filterConfigSchema = z.object({
  city: z.string().default('Banská Bystrica'),
  monFriOnly: z.boolean().default(true),
  dayShiftOnly: z.boolean().default(true),
  entryLevelOnly: z.boolean().default(true),
});

export type FilterConfig = z.infer<typeof filterConfigSchema>;

export const pushSubscriptionSchema = z.object({
  endpoint: z.string(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export type PushSubscription = z.infer<typeof pushSubscriptionSchema>;
