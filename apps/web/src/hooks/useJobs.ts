import useSWR from 'swr';
import { Job, FilterConfig } from 'shared';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useJobs(filters: FilterConfig) {
    const query = new URLSearchParams(filters as any).toString();
    const { data, error, isLoading } = useSWR<Job[]>(`/api/jobs?${query}`, fetcher, {
        refreshInterval: 60000 // refresh every minute
    });

    // Since we did filtering in ingestion and don't have server-side dynamic filtering implemented for the MVP REST API yet,
    // we do a simple client side filtering based on the toggles just in case.
    const filteredData = data?.filter(job => {
        if (filters.monFriOnly && job.workdays === 'weekend') return false;
        if (filters.dayShiftOnly && job.shiftType === 'night') return false;
        if (filters.entryLevelOnly && (job.experienceLevel !== 'entry' && job.experienceLevel !== 'unknown')) return false;
        return true;
    });

    return { jobs: filteredData || [], isLoading, isError: !!error };
}
