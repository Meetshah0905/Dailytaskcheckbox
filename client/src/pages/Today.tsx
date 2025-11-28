import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { useApp } from '@/lib/store';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Flame, Check, MoreHorizontal, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as Accordion from '@radix-ui/react-accordion';
import { Progress } from '@/components/ui/progress';
import { Link } from 'wouter';

export default function Today() {
  const { routine, logs, streak, toggleTask } = useApp();
  const today = format(new Date(), 'yyyy-MM-dd');
  const currentLog = logs[today] || { completedTaskIds: [] };
  
  // Calculate Progress
  const allTasks = useMemo(() => routine.flatMap(b => b.tasks), [routine]);
  const completedCount = currentLog.completedTaskIds.length;
  const totalCount = allTasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Find current block based on time
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const currentTimeVal = currentHour * 60 + currentMinute;

  const currentBlockId = useMemo(() => {
    const activeBlock = routine.find(block => {
      const [startH, startM] = block.startTime.split(':').map(Number);
      const [endH, endM] = block.endTime.split(':').map(Number);
      const startVal = startH * 60 + startM;
      const endVal = endH * 60 + endM;
      return currentTimeVal >= startVal && currentTimeVal < endVal;
    });
    return activeBlock ? activeBlock.id : routine[0]?.id;
  }, [routine, currentTimeVal]);

  return (
    <Layout>
      <div className="px-6 pt-8 pb-4 flex justify-between items-end">
        <div>
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {format(new Date(), 'EEEE, MMM do')}
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Hello, User
          </h1>
        </div>
        <Link href="/settings">
            <div className="p-2 rounded-full bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <Settings2 size={20} />
            </div>
        </Link>
      </div>

      {/* Hero Streak Card */}
      <div className="px-6 mb-8">
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame size={120} />
          </div>
          
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-3 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20")}>
                <Flame size={24} fill="currentColor" className="animate-pulse" />
              </div>
              <div>
                <div className="text-3xl font-bold font-display tabular-nums leading-none">
                  {streak.currentStreak} <span className="text-base font-medium text-muted-foreground">days</span>
                </div>
                <div className="text-xs text-muted-foreground font-medium mt-1">
                  Best: {streak.bestStreak} days
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Daily Goal</span>
                <span className={cn(progress >= 80 ? "text-green-400" : "text-foreground")}>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-secondary" indicatorClassName={cn("transition-all duration-500", progress >= 80 ? "bg-green-500" : "bg-primary")} />
            </div>

            <div className="text-sm text-muted-foreground font-medium">
              {progress >= 100 ? "All done! Amazing work." : 
               progress >= 80 ? "Goal met! Keep going for 100%." : 
               "Complete tasks to keep the streak."}
            </div>
          </div>
        </div>
      </div>

      {/* Routine Blocks */}
      <div className="px-4 pb-10 space-y-4">
        <Accordion.Root type="single" defaultValue={currentBlockId} collapsible>
          {routine.map((block) => {
            const blockTasks = block.tasks;
            const completedBlockTasks = blockTasks.filter(t => currentLog.completedTaskIds.includes(t.id)).length;
            const isBlockDone = completedBlockTasks === blockTasks.length && blockTasks.length > 0;

            return (
              <Accordion.Item key={block.id} value={block.id} className="group mb-4 rounded-3xl border border-border bg-card/40 overflow-hidden shadow-sm transition-all data-[state=open]:bg-card/80 data-[state=open]:shadow-md data-[state=open]:border-primary/10">
                <Accordion.Header>
                  <Accordion.Trigger className="w-full flex items-center justify-between p-5 outline-none">
                    <div className="flex items-center gap-4 text-left">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold font-display transition-colors border",
                        isBlockDone 
                          ? "bg-green-500/20 text-green-400 border-green-500/30" 
                          : "bg-secondary border-white/5 text-muted-foreground group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground"
                      )}>
                        {isBlockDone ? <Check size={20} strokeWidth={3} /> : <span>{completedBlockTasks}/{blockTasks.length}</span>}
                      </div>
                      <div>
                        <div className="text-lg font-bold text-foreground group-data-[state=open]:text-primary transition-colors">
                          {block.name}
                        </div>
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {block.startTime} - {block.endTime}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>
                
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                  <div className="px-2 pb-2 pt-0">
                    <div className="space-y-1">
                      {block.tasks.map((task) => {
                        const isDone = currentLog.completedTaskIds.includes(task.id);
                        return (
                          <div 
                            key={task.id}
                            onClick={() => toggleTask(today, task.id)}
                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer group/task"
                          >
                            <div className={cn(
                              "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                              isDone 
                                ? "bg-green-500 border-green-500 scale-110" 
                                : "border-muted-foreground/30 group-hover/task:border-primary"
                            )}>
                              {isDone && <Check size={14} className="text-black font-bold" strokeWidth={4} />}
                            </div>
                            <div className="flex-1">
                              <div className={cn(
                                "font-medium text-base transition-all",
                                isDone ? "text-muted-foreground line-through opacity-50" : "text-foreground"
                              )}>
                                {task.title}
                              </div>
                            </div>
                            {task.mustDo && (
                              <div className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-400/10 px-2 py-1 rounded-md border border-orange-400/20">
                                Must Do
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </Accordion.Root>
      </div>
    </Layout>
  );
}
