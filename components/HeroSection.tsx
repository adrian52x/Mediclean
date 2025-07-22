import Link from "next/link";
import Image from "next/image";
import { ImagesAPI } from "@/lib/api/ImagesAPI";
import { Button } from "./ui/button";

interface HeroSectionProps {
    images: { name: string; url: string }[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ images }) => {

    
    return (
        <section>
            <div className="w-full grid lg:grid-cols-2 lg:items-center gap-10">
                <div className="flex flex-col space-y-8 sm:space-y-14 md:space-y-18 text-center lg:text-left">
                    {/* Big title */}
                    <h1 className=" font-semibold tracking-tight text-teal-950 dark:text-white text-3xl sm:text-4xl md:text-5xl">
                        Descoperă <span className="text-transparent bg-clip-text bg-gradient-to-tr from-cyan-600 to-slate-800">dezinfectanți profesionali</span> și echipamente medicale!
                    </h1>
                    {/* Description */}
                    {/* <p className=" flex text-gray-700 dark:text-gray-300 tracking-tight md:font-normal max-w-xl mx-auto lg:max-w-none">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem molestiae soluta ipsa
                        incidunt expedita rem! Suscipit molestiae voluptatem iure, eum alias nobis velit quidem
                        reiciendis saepe nostrum
                    </p> */}
                    {/* Buttons */}
                    {/* <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
                        <Button className="px-6" variant="default" >Despre noi</Button>
                        <Button className="px-6" variant="secondary" >Contact</Button>
                    </div> */}
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