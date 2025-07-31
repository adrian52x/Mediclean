'use client';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Users } from 'lucide-react';
import Link from 'next/link';

// For copying to clipboard
import { useState } from 'react';


export function ConsultationCard() {
    const [copied, setCopied] = useState(false);
    const phoneNumber = '079410042';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(phoneNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            alert('Copy failed');
        }
    };

    return (
        <Card className="w-full">
            <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                    {/* Icon and Contact - 40% */}
                    <div className="lg:col-span-2 text-center">
                        <div className="flex flex-col lg:flex-row items-center gap-4">
                            <div className="p-3 bg-neutral-950 dark:bg-white rounded-full">
                                <Users className="w-10 h-10 text-white dark:text-neutral-950" />
                            </div>
                            <div className="w-full">
                                <Button
                                    variant={'default'}
                                    size="default"
                                    className="w-full h-14 text-lg"
                                    onClick={handleCopy}
                                >
                                    <span className="flex items-center justify-center gap-3 w-full h-full">
                                        <Phone className="w-5 h-5" />
                                        {copied ? 'Copiat!' : phoneNumber}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Text Content - 60% */}
                    <div className="lg:col-span-3 text-center lg:text-left">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-4">
                        Echipa noastră de experți în domeniul medical vă oferă consultanță specializată 
                        pentru alegerea celor mai potrivite soluții de dezinfecție și echipamente medicale. 
                        Beneficiați de sfaturi profesionale adaptate nevoilor dumneavoastră specifice.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
