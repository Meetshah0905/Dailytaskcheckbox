import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useApp } from '@/lib/store';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, isSameDay, parseISO } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const { logs, routine, settings } = useApp();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) setIsSheetOpen(true);
  };

  // Custom modifiers for the calendar
  const modifiers = {
    completed: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const log = logs[dateStr];
      if (!log) return false;
      
      // Check if streak was kept for this day
      // Re-using logic from store would be better, but for now duplicate simplified check
      const completedCount = log.completedTaskIds.length;
      const allTasks = routine.flatMap(b => b.tasks);
      const totalCount = allTasks.length;
      const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
      
      const mustDoTasks = allTasks.filter(t => t.mustDo);
      const completedMustDos = mustDoTasks.filter(t => log.completedTaskIds.includes(t.id));
      const allMustDosDone = completedMustDos.length === mustDoTasks.length && mustDoTasks.length > 0;

      return allMustDosDone || completionRate >= settings.completionThreshold;
    },
    partial: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const log = logs[dateStr];
      return !!log && log.completedTaskIds.length > 0;
    }
  };

  const modifiersStyles = {
    completed: { color: 'var(--success)', fontWeight: 'bold' },
    partial: { color: 'var(--primary)' }
  };
  
  // Helper to get log for selected date
  const selectedDateStr = date ? format(date, 'yyyy-MM-dd') : '';
  const selectedLog = logs[selectedDateStr];
  const selectedTasks = selectedLog?.completedTaskIds || [];

  return (
    <Layout>
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">History</h1>
        <p className="text-muted-foreground">Track your consistency over time.</p>
      </div>

      <div className="px-4">
        <div className="glass-card rounded-3xl p-4 flex justify-center">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={handleSelect}
            modifiers={modifiers}
            modifiersClassNames={{
              completed: "bg-green-500/20 text-green-500 hover:bg-green-500/30 hover:text-green-400 font-bold rounded-full",
              partial: "bg-white/10 text-white font-medium rounded-full"
            }}
            className="p-0"
            classNames={{
               day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
               day_today: "bg-accent text-accent-foreground",
            }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="px-8 mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
          <span>Streak Kept</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-white/10 border border-white/20" />
          <span>Partial</span>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl border-t border-white/10 bg-[#1a1a1a] p-0">
           <SheetHeader className="p-6 border-b border-white/5 text-left">
             <SheetTitle className="text-2xl font-bold">
               {date ? format(date, 'MMMM do, yyyy') : 'Details'}
             </SheetTitle>
             <div className="text-muted-foreground text-sm">
               {selectedLog 
                  ? `${selectedLog.completedTaskIds.length} tasks completed` 
                  : "No activity recorded"}
             </div>
           </SheetHeader>
           
           <ScrollArea className="h-full px-6 py-4 pb-20">
             <div className="space-y-6">
               {routine.map(block => {
                 const blockTasks = block.tasks;
                 // Filter to show only what was relevant or all? Let's show all with status
                 
                 return (
                   <div key={block.id} className="space-y-2">
                     <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider sticky top-0 bg-[#1a1a1a] py-2 z-10">
                       {block.name}
                     </h3>
                     <div className="space-y-2">
                       {blockTasks.map(task => {
                         const isCompleted = selectedTasks.includes(task.id);
                         return (
                           <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                             <div className={cn(
                               "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border",
                               isCompleted 
                                 ? "bg-green-500 border-green-500 text-black" 
                                 : "border-white/20 text-transparent"
                             )}>
                               <Check size={12} strokeWidth={4} />
                             </div>
                             <div className={cn(
                               "text-sm font-medium",
                               isCompleted ? "text-white" : "text-muted-foreground"
                             )}>
                               {task.title}
                             </div>
                             {task.mustDo && (
                               <div className="ml-auto text-[10px] text-orange-400 font-bold px-1.5 py-0.5 bg-orange-400/10 rounded">
                                 MUST
                               </div>
                             )}
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 );
               })}
             </div>
           </ScrollArea>
        </SheetContent>
      </Sheet>
    </Layout>
  );
}
