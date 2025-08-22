import Footer from '@/components/Footer';
import Navbar from '@/components/navbar/navbar';
import ThemeToggle from '@/components/theme-toggle';
import { supabaseServer } from '@/lib/supabase/server';

// Force dynamic rendering to prevent caching of session state
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await supabaseServer();
  const { data: session, error: authError } = await supabase.auth.getUser();

  //console.log('session', session);
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar session={session} />
            
            <div className="flex-1 container mx-auto px-8">{children}</div>

            <ThemeToggle />
            
            <Footer />
        </div>
    );
}
