import webpush from 'web-push';
import prisma from './db.js';
// Setup VAPID details
const publicVapidKey = process.env.VAPID_PUBLIC_KEY || '';
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || '';
const mailto = process.env.VAPID_MAILTO || 'mailto:test@example.com';
if (publicVapidKey && privateVapidKey) {
    webpush.setVapidDetails(mailto, publicVapidKey, privateVapidKey);
}
export async function sendNotification(subscriptionId, payload) {
    const sub = await prisma.pushSubscription.findUnique({ where: { id: subscriptionId } });
    if (!sub)
        return;
    const pushSub = {
        endpoint: sub.endpoint,
        keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
        }
    };
    try {
        await webpush.sendNotification(pushSub, JSON.stringify(payload));
    }
    catch (error) {
        if (error.statusCode === 410 || error.statusCode === 404) {
            await prisma.pushSubscription.delete({ where: { id: subscriptionId } });
        }
    }
}
export async function notifyAllNewJobs(jobs) {
    if (jobs.length === 0)
        return;
    const subs = await prisma.pushSubscription.findMany();
    for (const sub of subs) {
        const payload = {
            title: 'New Jobs Found!',
            body: `Found ${jobs.length} new matching jobs.`,
            url: '/jobs'
        };
        await sendNotification(sub.id, payload);
    }
}
//# sourceMappingURL=notifications.js.map