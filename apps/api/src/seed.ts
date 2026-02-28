import { fetchProfesiaJobs } from './workers/profesia.js';
console.log("Starting seed script...");
fetchProfesiaJobs().then(res => console.log("Seeding results:", res)).catch(console.error);
