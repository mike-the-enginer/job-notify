import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import prisma from './services/db.js';
import { startCronJobs } from './workers/cron.js';
import { fetchProfesiaJobs } from './workers/profesia.js';
const fastify = Fastify({ logger: true });
async function build() {
    await fastify.register(cors, { origin: '*' });
    await fastify.register(swagger, {
        openapi: {
            info: { title: 'BB Job Radar API', version: '1.0.0' },
        }
    });
    await fastify.register(swaggerUi, {
        routePrefix: '/docs'
    });
    fastify.get('/health', async () => {
        return { status: 'ok' };
    });
    fastify.get('/jobs', async (request, reply) => {
        const jobs = await prisma.job.findMany({
            orderBy: { discoveredAt: 'desc' },
            take: 100
        });
        return jobs;
    });
    fastify.get('/jobs/:id', async (request, reply) => {
        const { id } = request.params;
        const job = await prisma.job.findUnique({ where: { id } });
        if (!job)
            return reply.status(404).send({ error: 'Not found' });
        return job;
    });
    fastify.post('/subscriptions', async (request, reply) => {
        const body = request.body;
        const sub = await prisma.pushSubscription.upsert({
            where: { endpoint: body.endpoint },
            update: { p256dh: body.keys.p256dh, auth: body.keys.auth },
            create: { endpoint: body.endpoint, p256dh: body.keys.p256dh, auth: body.keys.auth }
        });
        return sub;
    });
    fastify.delete('/subscriptions/:id', async (request, reply) => {
        const { id } = request.params;
        await prisma.pushSubscription.delete({ where: { id } });
        return { success: true };
    });
    fastify.post('/sync', async () => {
        const result = await fetchProfesiaJobs();
        return result;
    });
    return fastify;
}
build().then(app => {
    app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening on ${address}`);
        startCronJobs();
    });
});
//# sourceMappingURL=server.js.map