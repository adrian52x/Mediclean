import Link from "next/link";
import Image from "next/image";
import { ImagesAPI } from "@/lib/api/ImagesAPI";
import { Button } from "./ui/button";
import { Stethoscope, Droplets, ShoppingCart, ArrowRight } from "lucide-react";

interface HeroSectionProps {
    images: { name: string; url: string }[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ images }) => {

    
    return (
        <section>
            <div className="w-full grid lg:grid-cols-2 lg:items-center gap-10">
                <div className="flex flex-col space-y-8 sm:space-y-14 md:space-y-18 text-center lg:text-left">
                    {/* Big title */}
                    {/* <h1 className=" font-semibold tracking-tight text-teal-950 dark:text-white text-3xl sm:text-4xl md:text-5xl">
                        Descoperă <span className="text-transparent bg-clip-text bg-gradient-to-tr from-cyan-600 to-slate-800">dezinfectanți profesionali</span> și echipamente medicale!
                    </h1> */}
                    <h1 className=" font-semibold tracking-tight text-teal-950 dark:text-white text-3xl sm:text-4xl md:text-5xl">
                        Soluții profesionale pentru <span className="text-transparent bg-clip-text bg-gradient-to-tr from-cyan-600 to-slate-800">dezinfecție și echipamente medicale</span> de înaltă calitate!
                    </h1>
                    {/* Description */}
                    {/* <p className="text-gray-600 dark:text-gray-300 text-lg max-w-xl mx-auto lg:max-w-none">
                        Soluții profesionale pentru dezinfecție și echipamente medicale de înaltă calitate pentru medicina generală și stomatologie.
                    </p> */}
                    
                    {/* Product Categories */}
                    <div className="flex flex-col space-y-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            Descoperă categoriile noastre:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Dezinfectanți */}
                            <Link href="/products?category=disinfectants" className="group">
                                <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:scale-105">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                                        <Droplets className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                            Dezinfectanți
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Profesioanli
                                        </p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-500 transition-colors" />
                                </div>
                            </Link>

                            {/* Echipamente Medicina Generală */}
                            <Link href="/products?category=equipment" className="group">
                                <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-lg hover:scale-105">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                                        <Stethoscope className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                            Echipamente
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Medicale
                                        </p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                                </div>
                            </Link>

                            {/* Toate Produsele - Main CTA */}
                            <Link href="/products" className="group sm:col-span-2 lg:col-span-1">
                                <div className="lg:h-[82px] flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-cyan-600 to-slate-400 hover:from-cyan-700 hover:to-slate-500 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105">
                                    <ShoppingCart className="w-6 h-6 text-white" />
                                    <span className="font-semibold text-white">
                                        Toate produsele
                                    </span>
                                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Livrare rapidă</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Calitate garantată</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Preturi competitive</span>
                        </div>
                    </div>
                    {/* Clients logos */}
                    {/* <div className="mt-5 flex items-center justify-center flex-wrap gap-4 lg:justify-start w-full">
                        <a href="#" target="_blank" rel='noreferer'>
                            <span className="sr-only">org name</span>
                            <Image width={600} height={120} src="/partners/deel-1.svg" alt="client name" className="h-7 w-auto dark:invert" />
                        </a>
                        <a href="#" target="_blank" rel='noreferer'>
                            <span className="sr-only">org name</span>
                            <Image width={600} height={120} src="/partners/vercel-logo.svg" alt="client name" className="h-7 w-auto dark:invert" />
                        </a>                        
                        <a href="#" target="_blank" rel='noreferer'>
                            <span className="sr-only">org name</span>
                            <Image width={600} height={120} src="/partners/lumistry.svg" alt="client name" className="h-7 w-auto dark:invert" />
                        </a>
                        <a href="#" target="_blank" rel='noreferer'>
                            <span className="sr-only">org name</span>
                            <Image width={600} height={120} src="/partners/supabase-logo.svg" alt="client name" className="h-7 w-auto dark:invert" />
                        </a>
                        <a href="#" target="_blank" rel='noreferer'>
                            <span className="sr-only">org name</span>
                            <Image width={600} height={120} src="/partners/mercury.svg" alt="client name" className="h-7 w-auto dark:invert" />
                        </a>
                    </div> */}
                </div>
                {/* <div className="flex aspect-square mx-auto h-[32rem] lg:aspect-auto relative w-full">
                    <div className="w-3/5 h-[80%] rounded-3xl overflow-clip border-8 border-gray-200 dark:border-gray-950 z-30">
                    <Image src={images[0].url} alt="buildind plan image" width={1300} height={1300} className="w-full h-full object-cover z-30" />
                    </div>
                    <div className="absolute right-0 bottom-0 h-[calc(100%-50px)] w-4/5 rounded-3xl overflow-clip border-4 border-gray-200 dark:border-gray-800 z-10">
                    <Image src={images[1].url} alt="working-on-housing-project" height={1300} width={1300} className="z-10 w-full h-full object-cover" />
                    </div>
                </div> */}
                <div className="relative hidden lg:block pt-5 flex h-[32rem] sm:w-full">
                    <div className="sm:absolute left-[30px] h-[50%] w-[50%] rounded-3xl drop-shadow-[0_4px_10px_rgba(10,50,100,0.7)] dark:drop-shadow-[0_4px_18px_rgba(56,189,248,0.21)] overflow-clip border-8 border-gray-200 dark:border-gray-950 z-30">
                    <Image src={images[4].url} alt="buildind plan image" width={1300} height={1300} className="w-full h-full object-cover z-30" />
                    </div>
                    <div className="sm:absolute right-0 bottom-[130px] h-[50%] w-[50%] rounded-3xl drop-shadow-[0_4px_10px_rgba(10,50,100,0.7)] dark:drop-shadow-[0_4px_18px_rgba(56,189,248,0.2)] overflow-clip border-8 border-gray-200 dark:border-gray-950 z-20">
                    <Image src={images[0].url} alt="working-on-housing-project" height={1300} width={1300} className="z-10 w-full h-full object-cover" />
                    </div>
                    <div className="sm:absolute left-[100px] bottom-[-50px] h-[50%] w-[50%] rounded-3xl drop-shadow-[0_4px_10px_rgba(10,50,100,0.7)] dark:drop-shadow-[0_4px_18px_rgba(56,189,248,0.2)] overflow-clip border-8 border-gray-200 dark:border-gray-950 z-10">
                    <Image src={images[1].url} alt="working-on-housing-project" height={1300} width={1300} className="z-10 w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </section>
    );
}