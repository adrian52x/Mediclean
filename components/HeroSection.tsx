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
            <div className="w-full px-5 grid lg:grid-cols-2 lg:items-center gap-10">
                <div className="flex flex-col space-y-8 sm:space-y-10 lg:items-center text-center lg:text-left max-w-2xl md:max-w-3xl mx-auto">
                    {/* Big title */}
                    <h1 className=" font-semibold tracking-tight text-teal-950 dark:text-white text-4xl sm:text-5xl lg:text-6xl">
                        We'll be happy to take care of <span className="text-transparent bg-clip-text bg-gradient-to-tr from-cyan-600 to-slate-800">your work.</span>
                    </h1>
                    {/* Description */}
                    <p className=" flex text-gray-700 dark:text-gray-300 tracking-tight md:font-normal max-w-xl mx-auto lg:max-w-none">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem molestiae soluta ipsa
                        incidunt expedita rem! Suscipit molestiae voluptatem iure, eum alias nobis velit quidem
                        reiciendis saepe nostrum
                    </p>
                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
                        <Button className="px-6" variant="default" >Get started</Button>
                        <Button className="px-6" variant="secondary" >Book a call</Button>
                    </div>
                    {/* Clients logos */}
                    <div className="mt-5 flex items-center justify-center flex-wrap gap-4 lg:justify-start w-full">
                        <a href="#" target="_blank" rel='noreferer'>
                            <span className="sr-only">org name</span>
                            <Image width={600} height={120} src="/clients/microsoft.svg" alt="client name" className="h-10 w-auto dark:grayscale" />
                        </a>
                        <a href="#" target="_blank" rel='noreferer'>
                            <span className="sr-only">org name</span>
                            <Image width={600} height={120} src="/clients/microsoft.svg" alt="client name" className="h-10 w-auto dark:grayscale" />
                        </a>
                        <a href="#" target="_blank" rel='noreferer'>
                            <span className="sr-only">org name</span>
                            <Image width={600} height={120} src="/clients/microsoft.svg" alt="client name" className="h-10 w-auto dark:grayscale" />
                        </a>
                        <a href="#" target="_blank" rel='noreferer'>
                            <span className="sr-only">org name</span>
                            <Image width={600} height={120} src="/clients/microsoft.svg" alt="client name" className="h-10 w-auto dark:grayscale" />
                        </a>
                    </div>
                </div>
                <div className="flex aspect-square mx-auto h-[32rem] lg:aspect-auto relative">
                    <div className="w-3/5 h-[80%] rounded-3xl overflow-clip border-8 border-gray-200 dark:border-gray-950 z-30">
                    <Image src={images[0].url} alt="buildind plan image" width={1300} height={1300} className="w-full h-full object-cover z-30" />
                    </div>
                    <div className="absolute right-0 bottom-0 h-[calc(100%-50px)] w-4/5 rounded-3xl overflow-clip border-4 border-gray-200 dark:border-gray-800 z-10">
                    <Image src={images[1].url} alt="working-on-housing-project" height={1300} width={1300} className="z-10 w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </section>
    );
}