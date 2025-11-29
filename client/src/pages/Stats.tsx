import React, { useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import { useApp } from '@/lib/store';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, LineChart, Line, PieChart, Pie, Legend } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, eachMonthOfInterval, startOfYear, endOfYear, eachYearOfInterval, subWeeks, subMonths, subYears } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type TimePeriod = 'week' | 'days' | 'monthly' | 'yearly';

export default function StatsPage() {
  const { logs, routine, settings } = useApp();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('days');

  const allTasks = useMemo(() => routine.flatMap(b => b.tasks), [routine]);
  const totalTasks = allTasks.length;
  const today = new Date();

  // Generate data based on selected time period
  const chartData = useMemo(() => {
    switch (timePeriod) {
      case 'days': {
        // Last 7 days
        return Array.from({ length: 7 }).map((_, i) => {
          const date = subDays(today, 6 - i);
          const dateStr = format(date, 'yyyy-MM-dd');
          const log = logs[dateStr];
          const completed = log ? log.completedTaskIds.length : 0;
          const percentage = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;
          return {
            label: format(date, 'EEE'),
            fullLabel: format(date, 'MMM dd'),
            fullDate: dateStr,
            completed: Math.max(0, completed), // Ensure non-negative
            percentage: Math.round(percentage),
            isToday: i === 6
          };
        });
      }
      case 'week': {
        // Last 4 weeks - using proper week boundaries
        return Array.from({ length: 4 }).map((_, i) => {
          // Calculate week start (Monday) for each week going back
          const weekOffset = 3 - i;
          const weekDate = subWeeks(today, weekOffset);
          const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 }); // Monday
          const weekEnd = endOfWeek(weekDate, { weekStartsOn: 1 }); // Sunday
          
          // Get all days in this week
          const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });
          let totalCompleted = 0;
          let daysWithData = 0;
          
          weekDates.forEach(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const log = logs[dateStr];
            if (log) {
              totalCompleted += log.completedTaskIds.length;
            }
            daysWithData++;
          });
          
          // Calculate average tasks per day for this week (including days with no data)
          const avgCompleted = weekDates.length > 0 ? totalCompleted / weekDates.length : 0;
          const percentage = totalTasks > 0 ? (avgCompleted / totalTasks) * 100 : 0;
          
          // Check if current week contains today
          const isCurrentWeek = weekStart <= today && weekEnd >= today;
          
          // Ensure we always return a valid number (at least 0)
          const finalCompleted = Math.max(0, Math.round(avgCompleted));
          
          return {
            label: `Week ${4 - i}`,
            fullLabel: `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd')}`,
            completed: finalCompleted,
            percentage: Math.round(percentage),
            isToday: isCurrentWeek
          };
        });
      }
      case 'monthly': {
        // Last 6 months
        return Array.from({ length: 6 }).map((_, i) => {
          const monthDate = subMonths(today, 5 - i);
          const monthStart = startOfMonth(monthDate);
          const monthEnd = endOfMonth(monthStart);
          const monthDates = eachDayOfInterval({ start: monthStart, end: monthEnd });
          let totalCompleted = 0;
          let daysWithData = 0;
          
          monthDates.forEach(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const log = logs[dateStr];
            if (log) {
              totalCompleted += log.completedTaskIds.length;
              daysWithData++;
            }
          });
          
          // Calculate average tasks per day for this month (include all days, even with no data)
          const avgCompleted = monthDates.length > 0 ? totalCompleted / monthDates.length : 0;
          const percentage = totalTasks > 0 ? (avgCompleted / totalTasks) * 100 : 0;
          
          // Ensure we always return a valid number (at least 0)
          const finalCompleted = Math.max(0, Math.round(avgCompleted));
          
          // Check if current month
          const isCurrentMonth = monthStart <= today && monthEnd >= today;
          
          return {
            label: format(monthStart, 'MMM'),
            fullLabel: format(monthStart, 'MMMM yyyy'),
            completed: finalCompleted,
            percentage: Math.round(percentage),
            isToday: isCurrentMonth
          };
        });
      }
      case 'yearly': {
        // Last 5 years
        return Array.from({ length: 5 }).map((_, i) => {
          const yearDate = subYears(today, 4 - i);
          const yearStart = startOfYear(yearDate);
          const yearEnd = endOfYear(yearStart);
          const yearDates = eachDayOfInterval({ start: yearStart, end: yearEnd });
          let totalCompleted = 0;
          let daysWithData = 0;
          
          yearDates.forEach(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const log = logs[dateStr];
            if (log) {
              totalCompleted += log.completedTaskIds.length;
              daysWithData++;
            }
          });
          
          // Calculate average tasks per day for this year
          const avgCompleted = yearDates.length > 0 ? totalCompleted / yearDates.length : 0;
          const percentage = totalTasks > 0 ? (avgCompleted / totalTasks) * 100 : 0;
          
          // Check if current year
          const isCurrentYear = yearStart <= today && yearEnd >= today;
          
          // Ensure we always return a valid number (at least 0)
          const finalCompleted = Math.max(0, Math.round(avgCompleted));
          
          return {
            label: format(yearStart, 'yyyy'),
            fullLabel: format(yearStart, 'yyyy'),
            completed: finalCompleted,
            percentage: Math.round(percentage),
            isToday: isCurrentYear
          };
        });
      }
      default:
        return [];
    }
  }, [timePeriod, logs, totalTasks, today]);

  // Calculate stats
  const totalCompletedAllTime = Object.values(logs).reduce((acc, log) => acc + log.completedTaskIds.length, 0);
  const todayLog = logs[format(today, 'yyyy-MM-dd')];
  const todayCompleted = todayLog ? todayLog.completedTaskIds.length : 0;
  const completionRateToday = totalTasks > 0 ? (todayCompleted / totalTasks) * 100 : 0;
  const leftToday = 100 - completionRateToday;

  // Calculate date range for stats based on period
  const dateRange = useMemo(() => {
    switch (timePeriod) {
      case 'days':
        return Array.from({ length: 7 }).map((_, i) => format(subDays(today, 6 - i), 'yyyy-MM-dd'));
      case 'week':
        const weekStart = subWeeks(today, 4);
        const weekEnd = today;
        return eachDayOfInterval({ start: weekStart, end: weekEnd }).map(d => format(d, 'yyyy-MM-dd'));
      case 'monthly':
        const monthStart = subMonths(today, 6);
        const monthEnd = today;
        return eachDayOfInterval({ start: monthStart, end: monthEnd }).map(d => format(d, 'yyyy-MM-dd'));
      case 'yearly':
        const yearStart = subYears(today, 1);
        const yearEnd = today;
        return eachDayOfInterval({ start: yearStart, end: yearEnd }).map(d => format(d, 'yyyy-MM-dd'));
      default:
        return [];
    }
  }, [timePeriod, today]);

  // Calculate most missed tasks
  const taskMissCount = useMemo(() => {
    const missCount: Record<string, { name: string; count: number; id: string }> = {};

    allTasks.forEach(task => {
      let missed = 0;
      dateRange.forEach(dateStr => {
        const log = logs[dateStr];
        if (!log || !log.completedTaskIds.includes(task.id)) {
          missed++;
        }
      });
      if (missed > 0) {
        missCount[task.id] = {
          id: task.id,
          name: task.title,
          count: missed
        };
      }
    });

    return Object.values(missCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [logs, allTasks, today, dateRange]);

  // Top habits by completion rate
  const topHabits = useMemo(() => {
    const totalDays = dateRange.length;

    return allTasks.map(task => {
      let completed = 0;
      dateRange.forEach(dateStr => {
        const log = logs[dateStr];
        if (log && log.completedTaskIds.includes(task.id)) {
          completed++;
        }
      });
      const rate = totalDays > 0 ? (completed / totalDays) * 100 : 0;
      return {
        id: task.id,
        name: task.title,
        completed,
        rate: Math.round(rate)
      };
    })
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 10);
  }, [logs, allTasks, today, dateRange]);

  // Donut chart data
  const donutData = [
    { name: 'COMPLETED', value: Math.round(completionRateToday), color: '#22c55e' },
    { name: 'LEFT', value: Math.round(leftToday), color: '#f97316' }
  ];

  // Line chart data
  const lineChartData = chartData.map(item => ({
    label: item.label,
    percentage: item.percentage
  }));

  // Get chart title based on period
  const getChartTitle = () => {
    switch (timePeriod) {
      case 'days': return 'Last 7 Days';
      case 'week': return 'Last 4 Weeks';
      case 'monthly': return 'Last 6 Months';
      case 'yearly': return 'Last 5 Years';
      default: return 'Progress';
    }
  };

  // Validate chart data
  const hasValidData = chartData.length > 0 && chartData.some(d => d.completed >= 0);
  
  // Calculate max value for Y-axis (ensure at least 1 for visibility)
  const maxValue = chartData.length > 0 
    ? Math.max(1, ...chartData.map(d => d.completed || 0))
    : 1;

  return (
    <Layout>
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">Insights</h1>
        <p className="text-muted-foreground">Your performance at a glance.</p>
      </div>

      <div className="px-4 space-y-6 pb-10">
        {/* Time Period Selector */}
        <div className="flex justify-center">
          <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as TimePeriod)} className="w-full">
            <TabsList className="glass-card p-1.5 w-full max-w-md">
              <TabsTrigger value="days" className="flex-1">Days</TabsTrigger>
              <TabsTrigger value="week" className="flex-1">Week</TabsTrigger>
              <TabsTrigger value="monthly" className="flex-1">Monthly</TabsTrigger>
              <TabsTrigger value="yearly" className="flex-1">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Bar Chart */}
        <div className="glass-card rounded-3xl p-6">
           <h3 className="text-sm font-medium text-muted-foreground mb-6">{getChartTitle()}</h3>
           <div className="h-48 w-full">
             {chartData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                   <Tooltip 
                     cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                     contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '12px', color: '#fff', padding: '12px' }}
                     formatter={(value: number) => [`${value} tasks`, 'Completed']}
                     labelFormatter={(label) => {
                       const item = chartData.find(d => d.label === label);
                       return item?.fullLabel || label;
                     }}
                   />
                   <XAxis 
                      dataKey="label" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#999', fontSize: 12, fontWeight: 500 }} 
                      dy={10}
                   />
                   <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#666', fontSize: 11 }}
                      width={30}
                      domain={[0, maxValue]}
                      allowDecimals={false}
                      ticks={maxValue <= 5 ? Array.from({ length: maxValue + 1 }, (_, i) => i) : undefined}
                   />
                   <Bar dataKey="completed" radius={[8, 8, 0, 0]} minPointSize={2}>
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.isToday ? '#3b82f6' : 'rgba(255,255,255,0.15)'} 
                        />
                      ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             ) : (
               <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                 No data available
               </div>
             )}
           </div>
           <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground flex-wrap">
             {chartData.map((item, i) => (
               <span key={i} className={item.isToday ? 'text-primary font-semibold' : ''}>
                 {item.label}
               </span>
             ))}
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

        {/* Two Column Layout for Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Daily Progress Donut Chart */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-6 text-center">OVERVIEW DAILY PROGRESS</h3>
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '12px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">COMPLETED</div>
                  <div className="text-2xl font-bold font-display">{Math.round(completionRateToday)}%</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-orange-500"></div>
                  <span className="text-xs text-muted-foreground">LEFT {Math.round(leftToday)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-xs text-muted-foreground">COMPLETED {Math.round(completionRateToday)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top 10 Daily Habits */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-6">TOP 10 DAILY HABITS</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {topHabits.length > 0 ? (
                topHabits.map((habit, index) => (
                  <div key={habit.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-xs text-muted-foreground font-bold w-6">{index + 1}.</span>
                      <span className="text-sm font-medium text-foreground flex-1">{habit.name}</span>
                    </div>
                    <div className="text-sm font-bold text-primary">{habit.rate}%</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No habits tracked yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Line Graph */}
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-6">{getChartTitle().toUpperCase()} PROGRESS BY GRAPH</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <Tooltip 
                  cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }}
                  contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '12px', color: '#fff' }}
                  formatter={(value: number) => [`${value}%`, 'Completion']}
                  labelFormatter={(label) => {
                    const item = chartData.find(d => d.label === label);
                    return item?.fullLabel || label;
                  }}
                />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#999', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 11 }}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(value) => `${value}%`}
                  orientation="right"
                />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-6">Analysis</h3>
          <div className="space-y-4">
            {allTasks.slice(0, 5).map((task) => {
              let completed = 0;
              dateRange.forEach(dateStr => {
                const log = logs[dateStr];
                if (log && log.completedTaskIds.includes(task.id)) {
                  completed++;
                }
              });
              const goal = dateRange.length; // Target: complete every day in range
              const actual = completed;
              const percentage = goal > 0 ? (actual / goal) * 100 : 0;

              return (
                <div key={task.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{task.title}</span>
                    <div className="text-xs text-muted-foreground">
                      Goal: {goal} Actual: {actual}
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2 bg-secondary" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Missed Tasks */}
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Most Missed Tasks</h3>
          <div className="space-y-3">
            {taskMissCount.length > 0 ? (
              taskMissCount.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                  <span className="text-xs text-muted-foreground bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    Missed {item.count}x
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground text-sm py-8">
                Great job! No missed tasks recently.
              </div>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}
