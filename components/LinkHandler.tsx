'use client';

import { useEffect } from 'react';
import NProgress from 'nprogress';

export default function LinkHandler() {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            
            if (link && link.href && link.href.startsWith(window.location.origin)) {
                NProgress.start();
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return null;
}
