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
                            {/* Style 1: Minimal Glass/Blur Effect - Dezinfectanți */}
                            <Link href="/products?category=disinfectants" className="group">
                                <div className="flex items-center space-x-3 p-5 backdrop-blur-sm bg-white/80 dark:bg-card rounded-2xl border-b-4 border-slate-400 hover:border-slate-600 dark:border-gray-600 hover:dark:border-gray-300 transition-all duration-500 hover:backdrop-blur-md hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                                    <div className="w-10 h-10 bg-slate-100 dark:bg-card rounded-xl flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-neutral-800 transition-colors duration-300">
                                        <Droplets className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 dark:text-white transition-colors">
                                            Dezinfectanți
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Profesionali
                                        </p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                                </div>
                            </Link>

                            {/* Style 2: Monochrome with Subtle Shadow - Echipamente */}
                            <Link href="/products?category=equipment" className="group">
                                <div className="flex items-center space-x-3 p-5 backdrop-blur-sm bg-white/80 dark:bg-card rounded-2xl border-b-4 border-slate-400 hover:border-slate-600 dark:border-gray-600 hover:dark:border-gray-300 transition-all duration-500 hover:backdrop-blur-md hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                                    <div className="w-10 h-10 bg-slate-100 dark:bg-card rounded-xl flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-neutral-800 transition-colors duration-300">
                                        <Stethoscope className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 dark:text-white transition-colors">
                                            Echipamente
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Medicale
                                        </p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                                </div>
                            </Link>

                            {/* Style 3: Dark Minimalist - Toate Produsele */}
                            <Link href="/products" className="group sm:col-span-2 lg:col-span-1">
                                <div className="relative lg:h-[82px] flex items-center justify-center space-x-3 p-5 bg-primary dark:bg-gray-100 rounded-2xl border border-gray-800 dark:border-gray-200 transition-all duration-500 hover:bg-gray-800 dark:hover:bg-gray-50 hover:shadow-2xl hover:scale-[1.02] overflow-hidden">
                                    <ShoppingCart className="w-5 h-5 text-white dark:text-gray-900" />
                                    <span className="font-medium text-white dark:text-gray-900">
                                        Toate produsele
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-white dark:text-gray-900 group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </Link>
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
                    <Image src={images[0].url} alt="buildind plan image" width={1300} height={1300} className="w-full h-full object-cover z-30" />
                    </div>
                    <div className="sm:absolute right-0 bottom-[130px] h-[50%] w-[50%] rounded-3xl drop-shadow-[0_4px_10px_rgba(10,50,100,0.7)] dark:drop-shadow-[0_4px_18px_rgba(56,189,248,0.2)] overflow-clip border-8 border-gray-200 dark:border-gray-950 z-20">
                    <Image src={images[4].url} alt="working-on-housing-project" height={1300} width={1300} className="z-10 w-full h-full object-cover" />
                    </div>
                    <div className="sm:absolute left-[100px] bottom-[-50px] h-[50%] w-[50%] rounded-3xl drop-shadow-[0_4px_10px_rgba(10,50,100,0.7)] dark:drop-shadow-[0_4px_18px_rgba(56,189,248,0.2)] overflow-clip border-8 border-gray-200 dark:border-gray-950 z-10">
                    <Image src={images[1].url} alt="working-on-housing-project" height={1300} width={1300} className="z-10 w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </section>
    );
}