'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import GoogleAnalytics from '@/components/SEO/GoogleAnalytics';
import { Button } from '@/components/ui/button';
import {
    clearAnalyticsCookies,
    CookieConsentChoice,
    OPEN_COOKIE_SETTINGS_EVENT,
    readCookieConsent,
    saveCookieConsent,
} from '@/lib/cookieConsent';

interface CookieConsentProps {
    gaMeasurementId: string;
}

// Google Analytics only ever loads from here, after the visitor accepts
export default function CookieConsent({ gaMeasurementId }: CookieConsentProps) {
    const [consent, setConsent] = useState<CookieConsentChoice | null>(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const savedConsent = readCookieConsent();
        setConsent(savedConsent);
        setShowBanner(savedConsent === null);

        const openBanner = () => setShowBanner(true);
        window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openBanner);
        return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openBanner);
    }, []);

    const handleChoice = (choice: CookieConsentChoice) => {
        saveCookieConsent(choice);
        setShowBanner(false);

        if (choice === 'rejected') {
            clearAnalyticsCookies();

            // A running script can't be unloaded, so stop it and reload the page
            if (consent === 'accepted') {
                (window as unknown as Record<string, boolean>)[`ga-disable-${gaMeasurementId}`] = true;
                window.location.reload();
                return;
            }
        }

        setConsent(choice);
    };

    return (
        <>
            {consent === 'accepted' && <GoogleAnalytics GA_MEASUREMENT_ID={gaMeasurementId} />}

            {showBanner && (
                <section
                    aria-label="Setări cookie"
                    className="fixed inset-x-0 bottom-0 z-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]"
                >
                    <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-lg border bg-background p-4 shadow-lg sm:flex-row sm:items-center">
                        <p className="flex-1 text-sm text-muted-foreground">
                            Folosim cookie-uri de analiză (Google Analytics) doar dacă ești de acord, pentru a
                            înțelege cum este utilizat site-ul. Detalii găsești în{' '}
                            <Link href="/privacy#cookies" className="text-foreground underline underline-offset-4">
                                Politica de confidențialitate
                            </Link>
                            .
                        </p>
                        <div className="flex shrink-0 gap-2">
                            <Button className="flex-1" onClick={() => handleChoice('rejected')}>
                                Refuz
                            </Button>
                            <Button className="flex-1" onClick={() => handleChoice('accepted')}>
                                Accept
                            </Button>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
