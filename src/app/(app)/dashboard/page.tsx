'use client';

import { useState, useEffect } from 'react';
import type { Task } from '@/types';
import { MOCK_TASKS } from '@/data/mock';
import { OverviewWidget } from '@/components/dashboard/OverviewWidget';
import { TasksByStatusChart } from '@/components/dashboard/TasksByStatusChart';
import { ListChecks, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const priorityColors = {
  [TASK_PRIORITIES.HIGH]: 'hsl(var(--destructive))',
  [TASK_PRIORITIES.MEDIUM]: 'hsl(var(--chart-4))', // Using chart colors for variety
  [TASK_PRIORITIES.LOW]: 'hsl(var(--chart-2))',
  'default': 'hsl(var(--muted))'
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(MOCK_TASKS);
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === TASK_STATUSES.DONE).length;
  const pendingTasks = tasks.filter(task => task.status === TASK_STATUSES.TODO || task.status === TASK_STATUSES.IN_PROGRESS).length;
  const highPriorityTasks = tasks.filter(task => task.priority === TASK_PRIORITIES.HIGH).length;

  const tasksByPriorityData = Object.values(TASK_PRIORITIES).map(priority => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    value: tasks.filter(task => task.priority === priority).length,
    fill: priorityColors[priority] || priorityColors.default,
  })).filter(item => item.value > 0);


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-foreground">Progress Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <OverviewWidget title="Total Tasks" value={totalTasks} icon={ListChecks} description="All tasks in the system" />
        <OverviewWidget title="Completed Tasks" value={completedTasks} icon={CheckCircle} description={`${Math.round(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0)}% completion rate`} />
        <OverviewWidget title="Pending Tasks" value={pendingTasks} icon={Clock} description="Tasks in To Do or In Progress" />
        <OverviewWidget title="High Priority" value={highPriorityTasks} icon={AlertTriangle} description="Critical tasks needing attention" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <TasksByStatusChart tasks={tasks} />
        
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tasksByPriorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {tasksByPriorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--popover-foreground))',
                        borderRadius: 'var(--radius)',
                    }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
