import Footer from '@/components/Footer';
import Navbar from '@/components/navbar/navbar';
import ThemeToggle from '@/components/theme-toggle';
import { supabaseServer } from '@/lib/supabase/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await supabaseServer();
  const { data: session, error: authError } = await supabase.auth.getUser();

  console.log('session', session);
  return (
    <>
      <Navbar session={session} />
      {/* <div className="px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]"> */}
      <div className="container mx-auto px-8">{children}</div>
      {/* Dark/Light Mode */}
      <ThemeToggle />

      <Footer />
    </>
  );
}
