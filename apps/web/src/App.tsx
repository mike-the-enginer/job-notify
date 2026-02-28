import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { FilterConfig } from 'shared';
import { useJobs } from './hooks/useJobs';
import { usePushSubscription } from './hooks/usePush';
import { Briefcase, Settings, Bell, RefreshCw, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function Header() {
    const { t } = useTranslation();
    return (
        <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
                <Briefcase /> {t('app.title')}
            </Link>
            <Link to="/settings" className="p-2 bg-blue-700 rounded-full hover:bg-blue-800 transition">
                <Settings size={20} />
            </Link>
        </header>
    );
}

function JobList({ filters }: { filters: FilterConfig }) {
    const { jobs, isLoading, isError } = useJobs(filters);
    const { t } = useTranslation();

    if (isLoading) return <div className="p-8 text-center text-gray-500">{t('jobs.loading')}</div>;
    if (isError) return <div className="p-8 text-center text-red-500">{t('jobs.error')}</div>;

    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 font-medium">{t('jobs.matched', { count: jobs.length })}</span>
            </div>
            {jobs.length === 0 ? (
                <div className="p-8 bg-gray-50 rounded-xl text-center text-gray-500 border border-gray-100">
                    {t('jobs.empty')}
                </div>
            ) : (
                jobs.map(job => (
                    <a key={job.id} href={job.url} target="_blank" rel="noopener noreferrer"
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col gap-2 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <div className="absolute top-0 right-0 bg-blue-50 text-blue-700 text-[10px] uppercase font-bold px-2 py-1 rounded-bl-lg border-b border-l border-blue-100 shadow-sm z-10">
                            {job.source}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 leading-tight pr-16">{job.title}</h3>
                        <p className="text-sm font-semibold text-blue-600">{job.company}</p>

                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100 font-medium">
                                {job.experienceLevel === 'entry' ? t('jobs.tags.entry') : t('jobs.tags.' + job.experienceLevel)}
                            </span>
                            <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-100 font-medium">
                                {t('jobs.tags.monFri')}
                            </span>
                            <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-100 font-medium">
                                {t('jobs.tags.dayShift')}
                            </span>
                        </div>

                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{job.descriptionSnippet}</p>

                        <div className="text-xs text-gray-400 mt-2">
                            {t('jobs.discovered')}: {new Date(job.discoveredAt).toLocaleDateString()}
                        </div>
                    </a>
                ))
            )}
        </div>
    );
}

function SettingsPage({ filters, setFilters }: { filters: FilterConfig, setFilters: any }) {
    const { isSubscribed, subscribe, unsubscribe, isSupported } = usePushSubscription();
    const { t, i18n } = useTranslation();

    const currentLanguage = i18n.language || 'sk';

    return (
        <div className="p-4 flex flex-col gap-6">
            <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2"><Globe size={20} /> {t('settings.language')}</div>
                </h2>
                <div className="flex gap-2">
                    <button onClick={() => i18n.changeLanguage('sk')} className={`px-4 py-2 rounded-lg font-medium transition ${currentLanguage === 'sk' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {t('settings.langSelection.sk')}
                    </button>
                    <button onClick={() => i18n.changeLanguage('en')} className={`px-4 py-2 rounded-lg font-medium transition ${currentLanguage === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {t('settings.langSelection.en')}
                    </button>
                </div>
            </section>

            <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings size={20} /> {t('settings.title')}</h2>

                <div className="flex flex-col gap-4">
                    <label className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{t('settings.city')}</span>
                        <input type="text" disabled value={filters.city} className="bg-gray-100 p-2 rounded text-gray-500 border border-gray-200" />
                    </label>

                    <label className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{t('settings.monFri')}</span>
                        <input type="checkbox" checked={filters.monFriOnly} onChange={e => setFilters({ ...filters, monFriOnly: e.target.checked })} className="w-5 h-5 text-blue-600" />
                    </label>

                    <label className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{t('settings.dayShift')}</span>
                        <input type="checkbox" checked={filters.dayShiftOnly} onChange={e => setFilters({ ...filters, dayShiftOnly: e.target.checked })} className="w-5 h-5 text-blue-600" />
                    </label>

                    <label className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{t('settings.entryLevel')}</span>
                        <input type="checkbox" checked={filters.entryLevelOnly} onChange={e => setFilters({ ...filters, entryLevelOnly: e.target.checked })} className="w-5 h-5 text-blue-600" />
                    </label>
                </div>
            </section>

            <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Bell size={20} /> {t('settings.notifications.title')}</h2>
                {!isSupported ? (
                    <p className="text-red-500 text-sm">{t('settings.notifications.unsupported')}</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-gray-600">{t('settings.notifications.desc')}</p>
                        {isSubscribed ? (
                            <button onClick={unsubscribe} className="bg-red-50 text-red-600 font-bold py-3 rounded-lg border border-red-200 flex items-center justify-center gap-2">
                                {t('settings.notifications.disable')}
                            </button>
                        ) : (
                            <button onClick={subscribe} className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition">
                                {t('settings.notifications.enable')}
                            </button>
                        )}
                        <button className="bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 mt-2">
                            {t('settings.notifications.test')}
                        </button>
                    </div>
                )}
            </section>

            <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><RefreshCw size={20} /> {t('settings.admin.title')}</h2>
                <button onClick={() => fetch(`${import.meta.env.VITE_API_URL || ''}/api/sync`, { method: 'POST' }).then(() => alert('Sync Triggered!'))} className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg w-full">
                    {t('settings.admin.sync')}
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
