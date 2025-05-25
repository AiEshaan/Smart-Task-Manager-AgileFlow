import { Blocks } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';

export function AppLogo({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link href="/board" className="flex items-center gap-2 px-2 py-4 text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors duration-200">
      <Blocks className="h-8 w-8 text-sidebar-primary" />
      {!collapsed && <span className="text-xl font-semibold">{APP_NAME}</span>}
    </Link>
  );
}
