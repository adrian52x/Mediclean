import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Button } from '../ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronsDown, Droplets, ListChecks, Stethoscope, Info, MapPin, Phone, LogOutIcon, MonitorCog, UserIcon } from 'lucide-react';

import { supabaseBrowser } from '@/lib/supabase/browser';
import { isUserAdminClientSide } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export const NavBarButtons: React.FC = () => {
  return (
    <Menubar className='hidden lg:flex border-1 border-gray-300 dark:border-neutral-700'>
        <MenubarMenu>
            <MenubarTrigger> 
                <ChevronDown size={18}/> 
                Produse
            </MenubarTrigger>
            <MenubarContent>
                <Link href="/products">
                    <MenubarItem>
                        <ListChecks /> Toate produsele
                    </MenubarItem>
                </Link>

                <MenubarSeparator />

                <Link href="/products?category=disinfectants">
                    <MenubarItem className='flex flex-col items-start'>
                        <div className='flex items-center gap-2'>
                            <Droplets/> Dezinfectanți
                        </div>
                        <div className='flex flex-col items-start ml-6'>
                            <span className='font-normal text-xs text-muted-foreground'>Stomatologie</span>
                            <span className='font-normal text-xs text-muted-foreground'>Medicina Generala</span>
                        </div>
                    </MenubarItem>
                </Link>

                <MenubarSeparator />
                <Link href="/products?category=equipment">
                    <MenubarItem>
                        <Stethoscope/>
                        Echipament
                    </MenubarItem>
                </Link>
            </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
            <MenubarTrigger>
                <ChevronDown size={18} />
                Servicii
            </MenubarTrigger>
            <MenubarContent>
                <Link href="/#services">
                    <MenubarItem className='flex flex-col items-start'>
                        <div className='flex items-center gap-2'>
                            <Info /> Consultanță
                        </div>
                        <span className='font-normal text-muted-foreground ml-6'>Solicită consultanță</span>
                    </MenubarItem>
                </Link>
            </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
            <MenubarTrigger>
                <ChevronDown size={18} />
                Locație / Contact
            </MenubarTrigger>
            <MenubarContent>
                <Link href="/#location">
                    <MenubarItem>
                            <MapPin /> Str. Nicolae Zelinski 36/6.
                    </MenubarItem>
                    <MenubarItem disabled className='cursor-default'>
                            <Phone /> +373 123 456 789
                    </MenubarItem>
                </Link>
            </MenubarContent>
        </MenubarMenu>
    </Menubar>
  );
}

export const UserNavButton: React.FC<{ session: any }> = ({ session }) => {
    const supabase = supabaseBrowser();
    const router = useRouter();

    const isAdmin = isUserAdminClientSide(session);

    const onLogout = async () => {
      await supabase.auth.signOut();
      router.refresh();
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-9">
                    <UserIcon className="h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex gap-2">
                    <UserIcon className="h-4" />
                    {session?.user?.email}
                </DropdownMenuItem>
                {isAdmin && (
                    <Link href="/admin">
                    <DropdownMenuItem className="flex gap-2">
                        <MonitorCog className="h-4" />
                        Admin
                    </DropdownMenuItem>
                    </Link>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem className="flex gap-2" onClick={onLogout}>
                <LogOutIcon className="h-4" /> Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// export const ProductsButton: React.FC = () => {
//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button size="default" variant="outline" className="h-9 bg-gray-200 border-gray-400">
//                     <ChevronsDown /> Produse
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-55 p-3 font-bold" align="start" forceMount>
//                 <Link href="/products"> 
//                     <DropdownMenuItem className="h-15 text-lg">
//                         <ListChecks /> Toate produsele
//                     </DropdownMenuItem>
//                 </Link>
//                 <DropdownMenuSeparator />
//                 <Link href="/products?category=disinfectants">    
//                     <DropdownMenuItem className="h-15 text-lg">
//                         <Droplets/>
//                         <div className='flex flex-col'>
//                             Dezinfectanți
//                             <span className='font-normal text-xs text-muted-foreground'>Stomatologie</span>
//                             <span className='font-normal text-xs text-muted-foreground'>Medicina Generala</span>
//                         </div>
                        
//                     </DropdownMenuItem>
//                 </Link>
//                 <DropdownMenuSeparator />
//                 <Link href="/products?category=equipment">    
//                     <DropdownMenuItem className="h-15 text-lg">
//                         <Stethoscope/> Echipament
//                     </DropdownMenuItem>
//                 </Link>
//             </DropdownMenuContent>
//         </DropdownMenu>
//     );
// };


// export const ServicesButton: React.FC = () => {
//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button size="default" variant="outline" className="h-9 bg-gray-200 border-gray-400">
//                     <ChevronsDown /> Servicii
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-55 p-3 font-bold" align="end" forceMount>
//                 <Link href="#services"> 
//                     <DropdownMenuItem className="h-15 text-lg">
//                         <ListChecks /> Consultanță
//                     </DropdownMenuItem>
//                 </Link>
//                 <DropdownMenuSeparator />

//             </DropdownMenuContent>
//         </DropdownMenu>
//     );
// };

// export const oldNavigation: React.FC = () => {
//     return (
//         <NavigationMenu className="hidden md:flex">
//             <NavigationMenuList>
//               {/* Categories Dropdown */}
//               <NavigationMenuItem>
//                 <NavigationMenuTrigger>Produse & Servicii</NavigationMenuTrigger>
//                 <NavigationMenuContent>
//                   <ul className="grid w-[250px] gap-3 p-4">
//                     <li className="row-span-3">
//                       <NavigationMenuLink asChild>
//                         <a
//                           className="flex h-full w-full select-none flex-col  rounded-md bg-gradient-to-b from-muted/50 to-muted no-underline outline-none focus:shadow-md"
//                           href="/products"
//                         >
//                           <div className="my-2 text-lg font-medium text-center">Toate produsele</div>
//                         </a>
//                       </NavigationMenuLink>
//                     </li>
//                     <ListItem href="/products?category=disinfectants" title="1. Dezinfectanți"></ListItem>
//                     <ListItem href="/products?category=equipment" title="2. Echipament"></ListItem>
//                     <ListItem href="#services" title="3. Consultanță">
//                       Text.. ?
//                     </ListItem>
//                   </ul>
//                 </NavigationMenuContent>
//               </NavigationMenuItem>
//             </NavigationMenuList>
//         </NavigationMenu>
//     );
// }

// Helper component for navigation menu items
// const ListItem = React.forwardRef<
//   //React.ElementRef<'a'>,
//   React.ComponentRef<'a'>,
//   React.ComponentPropsWithoutRef<'a'> & {
//     title: string;
//   }
// >(({ className, title, children, ...props }, ref) => {
//   return (
//     <li>
//       <NavigationMenuLink asChild>
//         <a
//           ref={ref}
//           className={cn(
//             'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none',
//             className,
//           )}
//           {...props}
//         >
//           <div className="text-sm leading-none font-medium">{title}</div>
//           <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
//             {children}
//           </p>
//         </a>
//       </NavigationMenuLink>
//     </li>
//   );
// });
// ListItem.displayName = 'ListItem';