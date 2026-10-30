'use client';

import { OPEN_COOKIE_SETTINGS_EVENT } from '@/lib/cookieConsent';

export default function CookieSettingsButton() {
    return (
        <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
            className="text-muted-foreground hover:text-foreground cursor-pointer text-sm transition duration-300"
        >
            Setări cookie
        </button>
    );
}
