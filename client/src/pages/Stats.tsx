import React from 'react';
import Layout from '@/components/Layout';
import { useApp } from '@/lib/store';
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip, Cell } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export default function StatsPage() {
  const { logs, routine } = useApp();

  // Generate last 7 days data
  const today = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(today, 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = logs[dateStr];
    const completed = log ? log.completedTaskIds.length : 0;
    return {
      day: format(date, 'EEE'), // Mon, Tue...
      fullDate: dateStr,
      completed,
      isToday: i === 6
    };
  });

  const totalTasks = routine.reduce((acc, block) => acc + block.tasks.length, 0);

  // Calculate stats
  const totalCompletedAllTime = Object.values(logs).reduce((acc, log) => acc + log.completedTaskIds.length, 0);
  const completionRateToday = last7Days[6].completed / totalTasks * 100;

  return (
    <Layout>
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">Insights</h1>
        <p className="text-muted-foreground">Your performance at a glance.</p>
      </div>

      <div className="px-4 space-y-6">
        
        {/* Weekly Chart */}
        <div className="glass-card rounded-3xl p-6">
           <h3 className="text-sm font-medium text-muted-foreground mb-6">Last 7 Days</h3>
           <div className="h-48 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={last7Days}>
                 <Tooltip 
                   cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                   contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '12px' }}
                 />
                 <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#666', fontSize: 12 }} 
                    dy={10}
                 />
                 <Bar dataKey="completed" radius={[4, 4, 4, 4]}>
                    {last7Days.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isToday ? 'var(--primary)' : 'rgba(255,255,255,0.1)'} 
                      />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-3xl p-5">
             <div className="text-sm text-muted-foreground mb-1">Today</div>
             <div className="text-3xl font-bold font-display">{Math.round(completionRateToday)}%</div>
             <div className="text-xs text-green-500 mt-1">Completion</div>
          </div>
          <div className="glass-card rounded-3xl p-5">
             <div className="text-sm text-muted-foreground mb-1">Total Tasks</div>
             <div className="text-3xl font-bold font-display">{totalCompletedAllTime}</div>
             <div className="text-xs text-muted-foreground mt-1">Lifetime</div>
          </div>
        </div>

        {/* Missed Tasks (Mock) */}
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Most Missed Tasks</h3>
          <div className="space-y-4">
             {/* In a real app, calculate this from logs */}
             {[
               { name: "Reading 5 pages", count: 4 },
               { name: "Mandarin vocab", count: 3 },
               { name: "Walk at 10:00 pm", count: 2 },
             ].map((item, i) => (
               <div key={i} className="flex justify-between items-center">
                 <span className="text-sm font-medium">{item.name}</span>
                 <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full">Missed {item.count}x</span>
               </div>
             ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}
