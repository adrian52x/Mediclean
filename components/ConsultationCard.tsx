import {
  Card,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Users } from 'lucide-react';
import Link from 'next/link';


export function ConsultationCard() {
    return (
        <Card className="w-full">
            <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                    {/* Icon and Contact - 40% */}
                    <div className="lg:col-span-2 text-center">
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
                            <div className="p-3 bg-neutral-950 dark:bg-white rounded-full">
                                <Users className="w-10 h-10 text-white dark:text-neutral-950" />
                            </div>
                            
                            <div className="flex-1 space-y-3 w-full">
                                <Button
                                    variant={'default'} 
                                    asChild
                                    size="default" 
                                    className="w-full"
                                >
                                    <Link href="tel:+37322123456" className="flex items-center justify-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    +373 22 123 456
                                    </Link>
                                </Button>
                                
                                <Button 
                                    asChild
                                    variant="outline" 
                                    size="default" 
                                    className=" w-full"
                                >
                                    <Link href="https://wa.me/37369123456" target="_blank" className="flex items-center justify-center gap-2">
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp
                                    </Link>
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
