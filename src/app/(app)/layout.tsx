'use client';

import * as React from 'react';
import { AppLogo } from '@/components/layout/AppLogo';
import { Header } from '@/components/layout/Header';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const SIDEBAR_COOKIE_NAME = "sidebar_collapsed_agileflow";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
    const storedState = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
      ?.split('=')[1];
    if (storedState) {
      setIsCollapsed(storedState === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const newState = !prev;
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${newState}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
      return newState;
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside
        className={cn(
          "hidden md:flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className={cn("flex h-16 items-center border-b px-2", isCollapsed ? "justify-center" : "justify-start")}>
           <AppLogo collapsed={isCollapsed} />
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav collapsed={isCollapsed} />
        </div>
        <Separator className="bg-sidebar-border my-2" />
         <div className="p-4 mt-auto">
            {/* Add user profile or settings shortcut here if needed */}
         </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <Header toggleSidebar={toggleSidebar} isSidebarCollapsed={isCollapsed} />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
