import { useState, useEffect } from 'react';

const API_URL = '/api'; // Assuming proxy is set

export function usePushSubscription() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then(reg => {
                setRegistration(reg);
                reg.pushManager.getSubscription().then(sub => {
                    setIsSubscribed(!!sub);
                });
            });
        }
    }, []);

    const subscribe = async () => {
        const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
        if (!publicVapidKey || !registration) return;

        try {
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: publicVapidKey
            });

            await fetch(`${API_URL}/subscriptions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub)
            });
            setIsSubscribed(true);
        } catch (e) {
            console.error('Push subscribe error:', e);
        }
    };

    const unsubscribe = async () => {
        if (!registration) return;
        const sub = await registration.pushManager.getSubscription();
        if (sub) {
            await fetch(`${API_URL}/subscriptions/${encodeURIComponent(sub.endpoint)}`, {
                method: 'DELETE'
            });
            await sub.unsubscribe();
            setIsSubscribed(false);
        }
    };

    return { isSubscribed, subscribe, unsubscribe, isSupported: 'serviceWorker' in navigator && 'PushManager' in window };
}
