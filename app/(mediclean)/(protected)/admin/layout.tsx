import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import ThemeToggle from "@/components/theme-toggle"
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AdminSidebar />
      <main className="py-4 px-6 w-full max-w-[1920px]">
        <SidebarTrigger/>
        {children}
      </main>
      <ThemeToggle />
    </SidebarProvider>
  )
}