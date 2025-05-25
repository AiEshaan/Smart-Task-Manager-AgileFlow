'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarNavProps {
  collapsed?: boolean;
}

export function SidebarNav({ collapsed = false }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="flex flex-col gap-1 px-2">
        {NAV_ITEMS.map((item: NavItem) => {
          const isActive = pathname === item.href || (item.href !== '/board' && pathname.startsWith(item.href));
          
          const linkContent = (
            <>
              <item.icon className={cn(
                "h-5 w-5 shrink-0",
                isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
              )} />
              {!collapsed && (
                <span className="truncate">
                  {item.label}
                </span>
              )}
            </>
          );

          const linkClasses = cn(
            "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
            collapsed ? "justify-center" : "",
            isActive
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            item.disabled && "cursor-not-allowed opacity-50"
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href} className={linkClasses} aria-disabled={item.disabled}>
                    {linkContent}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-popover text-popover-foreground">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={linkClasses}
              aria-disabled={item.disabled}
            >
              {linkContent}
            </Link>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}
