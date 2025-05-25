import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface OverviewWidgetProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string; // e.g., "+5% from last month"
}

export function OverviewWidget({ title, value, icon: Icon, description, trend }: OverviewWidgetProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && <p className="text-xs text-green-600 dark:text-green-400 mt-1">{trend}</p>}
      </CardContent>
    </Card>
  );
}
