import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    sk: {
        translation: {
            "app": {
                "title": "BB Job Radar"
            },
            "jobs": {
                "matched": "{{count}} pracovných ponúk",
                "loading": "Načítavam pracovné ponuky...",
                "error": "Zlyhalo načítavanie pracovných ponúk",
                "empty": "Nenašli sa žiadne pracovné ponuky zodpovedajúce vašim kritériám.",
                "discovered": "Objavené",
                "tags": {
                    "entry": "Entry Level / Junior",
                    "senior": "Senior",
                    "mid": "Mid",
                    "unknown": "Neznáme",
                    "monFri": "Len Po-Pia",
                    "dayShift": "Len denná zmena"
                }
            },
            "settings": {
                "title": "Nastavenia",
                "city": "Mesto",
                "monFri": "Len pondelok až piatok",
                "dayShift": "Len denná (jedna) zmena",
                "entryLevel": "Len Entry/Junior úroveň",
                "notifications": {
                    "title": "Upozornenia",
                    "unsupported": "Push upozornenia nie sú na tomto zariadení/prehliadači podporované.",
                    "desc": "Získajte upozornenia, keď sa objaví nová pracovná ponuka spĺňajúca vaše prísne kritériá.",
                    "disable": "Vypnúť upozornenia",
                    "enable": "Zapnúť upozornenia",
                    "test": "Poslať testovacie upozornenie"
                },
                "admin": {
                    "title": "Nástroje správcu",
                    "sync": "Spustiť manuálnu synchronizáciu"
                },
                "language": "Jazyk",
                "langSelection": {
                    "en": "Angličtina (EN)",
                    "sk": "Slovenčina (SK)"
                }
            }
        }
    },
    en: {
        translation: {
            "app": {
                "title": "BB Job Radar"
            },
            "jobs": {
                "matched": "{{count}} jobs matched",
                "loading": "Loading jobs...",
                "error": "Failed to load jobs",
                "empty": "No jobs found mapping your criteria.",
                "discovered": "Discovered",
                "tags": {
                    "entry": "Entry Level / Junior",
                    "senior": "Senior",
                    "mid": "Mid",
                    "unknown": "Unknown",
                    "monFri": "Mon-Fri Base",
                    "dayShift": "Day Shift Only"
                }
            },
            "settings": {
                "title": "Filters",
                "city": "City",
                "monFri": "Monday to Friday only",
                "dayShift": "Day (Single) Shift only",
                "entryLevel": "Entry/Junior Level only",
                "notifications": {
                    "title": "Notifications",
                    "unsupported": "Push notifications are not supported on this device/browser.",
                    "desc": "Get a notification when a new job appears mapping your strict filters.",
                    "disable": "Disable Push Notifications",
                    "enable": "Enable Push Notifications",
                    "test": "Send Test Notification"
                },
                "admin": {
                    "title": "Admin Tools",
                    "sync": "Trigger Manual Sync"
                },
                "language": "Language",
                "langSelection": {
                    "en": "English (EN)",
                    "sk": "Slovak (SK)"
                }
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'sk',
        lng: 'sk',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
