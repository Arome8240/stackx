import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { RightSidebar } from '@/components/layout/right-sidebar';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="lg:ml-64 xl:mr-80 pb-16 lg:pb-0">
        {children}
      </main>
      <RightSidebar />
      <MobileNav />
    </div>
  );
}
