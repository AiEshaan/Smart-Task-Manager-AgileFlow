'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Task } from '@/types';
import { TASK_STATUSES } from '@/lib/constants';

interface TasksByStatusChartProps {
  tasks: Task[];
}

export function TasksByStatusChart({ tasks }: TasksByStatusChartProps) {
  const statusCounts = Object.values(TASK_STATUSES).map(status => ({
    name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
    count: tasks.filter(task => task.status === status).length,
  }));

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Tasks by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusCounts} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--popover-foreground))',
                borderRadius: 'var(--radius)',
              }}
              cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Task Count" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
