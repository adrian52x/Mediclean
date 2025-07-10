import { Stethoscope, WrapText, Droplets } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export const ProductsGridHeader: React.FC = () => {
    return (
        <div className="sm:flex pb-2 space-y-4 sm:gap-4">
            {/* <div className="w-[300px]">
                <Button
                variant="outline"
                className="text-muted-foreground relative w-full justify-start text-sm font-light"
                >
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <span className="inline-flex pl-6">Search...</span>
                </Button>
            </div> */}

            <Link href={'/products'} className="flex">
                <Button className="font-bold cursor-pointer" variant={'outline'}>
                    <WrapText />
                    <p>Vezi toate produsele</p>
                </Button>
            </Link>

            <Link href={'/products'} className="flex">
                <Button className="font-bold cursor-pointer" variant={'outline'}>
                    <Droplets />
                    <p>Dezinfectanți</p>
                </Button>
            </Link>

            <Link href={'/products'} className="flex">
                <Button className="font-bold cursor-pointer" variant={'outline'}>
                    <Stethoscope />
                    <p>Echipamente</p>
                </Button>
            </Link>            
        </div>
    );
};    