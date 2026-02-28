import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { FilterConfig } from 'shared';
import { useJobs } from './hooks/useJobs';
import { usePushSubscription } from './hooks/usePush';
import { Briefcase, Settings, Bell, RefreshCw } from 'lucide-react';

function Header() {
    return (
        <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
                <Briefcase /> BB Job Radar
            </Link>
            <Link to="/settings" className="p-2 bg-blue-700 rounded-full hover:bg-blue-800 transition">
                <Settings size={20} />
            </Link>
        </header>
    );
}

function JobList({ filters }: { filters: FilterConfig }) {
    const { jobs, isLoading, isError } = useJobs(filters);

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading jobs...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Failed to load jobs</div>;

    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 font-medium">{jobs.length} jobs matched</span>
            </div>
            {jobs.length === 0 ? (
                <div className="p-8 bg-gray-50 rounded-xl text-center text-gray-500 border border-gray-100">
                    No jobs found mapping your criteria.
                </div>
            ) : (
                jobs.map(job => (
                    <a key={job.id} href={job.url} target="_blank" rel="noopener noreferrer"
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col gap-2 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <h3 className="text-lg font-bold text-gray-800 leading-tight">{job.title}</h3>
                        <p className="text-sm font-semibold text-blue-600">{job.company}</p>

                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100 font-medium">
                                {job.experienceLevel === 'entry' ? 'Entry Level / Junior' : job.experienceLevel}
                            </span>
                            <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-100 font-medium">
                                Mon-Fri Base
                            </span>
                            <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-100 font-medium">
                                Day Shift Only
                            </span>
                        </div>

                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{job.descriptionSnippet}</p>

                        <div className="text-xs text-gray-400 mt-2">
                            Discovered: {new Date(job.discoveredAt).toLocaleDateString()}
                        </div>
                    </a>
                ))
            )}
        </div>
    );
}

function SettingsPage({ filters, setFilters }: { filters: FilterConfig, setFilters: any }) {
    const { isSubscribed, subscribe, unsubscribe, isSupported } = usePushSubscription();

    return (
        <div className="p-4 flex flex-col gap-6">
            <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings size={20} /> Filters</h2>

                <div className="flex flex-col gap-4">
                    <label className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">City</span>
                        <input type="text" disabled value={filters.city} className="bg-gray-100 p-2 rounded text-gray-500 border border-gray-200" />
                    </label>

                    <label className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Monday to Friday only</span>
                        <input type="checkbox" checked={filters.monFriOnly} onChange={e => setFilters({ ...filters, monFriOnly: e.target.checked })} className="w-5 h-5 text-blue-600" />
                    </label>

                    <label className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Day (Single) Shift only</span>
                        <input type="checkbox" checked={filters.dayShiftOnly} onChange={e => setFilters({ ...filters, dayShiftOnly: e.target.checked })} className="w-5 h-5 text-blue-600" />
                    </label>

                    <label className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Entry/Junior Level only</span>
                        <input type="checkbox" checked={filters.entryLevelOnly} onChange={e => setFilters({ ...filters, entryLevelOnly: e.target.checked })} className="w-5 h-5 text-blue-600" />
                    </label>
                </div>
            </section>

            <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Bell size={20} /> Notifications</h2>
                {!isSupported ? (
                    <p className="text-red-500 text-sm">Push notifications are not supported on this device/browser.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-gray-600">Get a notification when a new job appears mapping your strict filters.</p>
                        {isSubscribed ? (
                            <button onClick={unsubscribe} className="bg-red-50 text-red-600 font-bold py-3 rounded-lg border border-red-200 flex items-center justify-center gap-2">
                                Disable Push Notifications
                            </button>
                        ) : (
                            <button onClick={subscribe} className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition">
                                Enable Push Notifications
                            </button>
                        )}
                        <button className="bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 mt-2">
                            Send Test Notification
                        </button>
                    </div>
                )}
            </section>

            <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><RefreshCw size={20} /> Admin Tools</h2>
                <button onClick={() => fetch('/api/sync', { method: 'POST' }).then(() => alert('Sync Triggered!'))} className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg w-full">
                    Trigger Manual Sync
                </button>
            </section>
        </div>
    );
}

export default function App() {
    const [filters, setFilters] = useState<FilterConfig>({
        city: 'Banská Bystrica',
        monFriOnly: true,
        dayShiftOnly: true,
        entryLevelOnly: true
    });

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans mb-16 max-w-2xl mx-auto shadow-xl ring-1 ring-gray-900/5">
                <Header />
                <main className="flex-1 overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<JobList filters={filters} />} />
                        <Route path="/settings" element={<SettingsPage filters={filters} setFilters={setFilters} />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}
