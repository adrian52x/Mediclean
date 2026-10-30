export type CookieConsentChoice = 'accepted' | 'rejected';

const CONSENT_KEY = 'cookie-consent';

// Lets the footer reopen the banner without sharing state with it
export const OPEN_COOKIE_SETTINGS_EVENT = 'open-cookie-settings';

export function readCookieConsent(): CookieConsentChoice | null {
    try {
        const value = localStorage.getItem(CONSENT_KEY);
        return value === 'accepted' || value === 'rejected' ? value : null;
    } catch {
        return null;
    }
}

export function saveCookieConsent(choice: CookieConsentChoice): void {
    try {
        localStorage.setItem(CONSENT_KEY, choice);
    } catch {
        // Storage can be blocked, so the choice then lasts only for this page view
    }
}

/**
 * Remove Google Analytics cookies. They are set on the root domain, so every
 * parent domain of the current host has to be tried.
 */
export function clearAnalyticsCookies(): void {
    const names = document.cookie
        .split('; ')
        .map((cookie) => cookie.split('=')[0])
        .filter((name) => name === '_ga' || name.startsWith('_ga_'));

    const hostParts = window.location.hostname.split('.');
    const domains = hostParts.map((_, index) => hostParts.slice(index).join('.'));

    names.forEach((name) => {
        const expired = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;

        document.cookie = expired;
        domains.forEach((domain) => {
            document.cookie = `${expired}; domain=.${domain}`;
        });
    });
}
