'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { isUserAdminClientSide } from '@/lib/utils';
import {
  LogOutIcon,
  MonitorCog,
  UserIcon,
} from 'lucide-react';
import { ShoppingBasketIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function UserNav({ session }: { session: any }) {
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
        <DropdownMenuGroup>
          {/* <Link href="/profile/addresses">
                            <DropdownMenuItem className="flex gap-2">
                                <MapPinIcon className="h-4" />
                                Edit Addresses
                            </DropdownMenuItem>
                        </Link> */}

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
          {/* <Link href="/profile/payments">
                            <DropdownMenuItem className="flex gap-2">
                                <CreditCardIcon className="h-4" />
                                Payments
                            </DropdownMenuItem>
                        </Link> */}

          <DropdownMenuSeparator />

          <Link href="/cart">
            <DropdownMenuItem className="flex gap-2">
              <ShoppingBasketIcon className="h-4" /> Cart
            </DropdownMenuItem>
          </Link>
          {/* <Link href="/wishlist">
                            <DropdownMenuItem className="flex gap-2">
                                <HeartIcon className="h-4" /> Wishlist
                            </DropdownMenuItem>
                        </Link> */}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex gap-2" onClick={onLogout}>
          <LogOutIcon className="h-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
