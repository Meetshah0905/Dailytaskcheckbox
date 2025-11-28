import React, { createContext, useContext, useEffect, useState } from 'react';
import { RoutineBlock, DailyLog, StreakState, Settings } from './types';
import { DEFAULT_ROUTINE, DEFAULT_SETTINGS, DEFAULT_STREAK } from './constants';
import { format, isSameDay, parseISO, subDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  routine: RoutineBlock[];
  logs: Record<string, DailyLog>;
  streak: StreakState;
  settings: Settings;
  setRoutine: (routine: RoutineBlock[]) => void;
  toggleTask: (date: string, taskId: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  resetRoutine: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [routine, setRoutineState] = useState<RoutineBlock[]>(DEFAULT_ROUTINE);
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [streak, setStreak] = useState<StreakState>(DEFAULT_STREAK);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const { toast } = useToast();

  // Load from localStorage
  useEffect(() => {
    const savedRoutine = localStorage.getItem('routine');
    const savedLogs = localStorage.getItem('logs');
    const savedStreak = localStorage.getItem('streak');
    const savedSettings = localStorage.getItem('settings');

    if (savedRoutine) setRoutineState(JSON.parse(savedRoutine));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedStreak) setStreak(JSON.parse(savedStreak));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('routine', JSON.stringify(routine));
  }, [routine]);

  useEffect(() => {
    localStorage.setItem('logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('streak', JSON.stringify(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const setRoutine = (newRoutine: RoutineBlock[]) => {
    setRoutineState(newRoutine);
  };

  const resetRoutine = () => {
    setRoutineState(DEFAULT_ROUTINE);
    toast({
      title: "Routine Reset",
      description: "Your routine has been reset to default."
    });
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const calculateStreak = (currentLogs: Record<string, DailyLog>, currentRoutine: RoutineBlock[]) => {
    // This is a simplified streak calculation. 
    // In a real app, we'd traverse back from today/yesterday.
    // For now, we update streak when toggling tasks if conditions met.
    // But correctly, we should re-evaluate streak on load or day change.
    
    // Let's implement a basic check for "Today"
    // A full streak recalculation is expensive to do on every render, 
    // so we'll do it reactively when logs change for the relevant dates.
    
    // TODO: Implement robust streak logic
  };

  const toggleTask = (date: string, taskId: string) => {
    setLogs(prev => {
      const log = prev[date] || { date, completedTaskIds: [], lastUpdated: Date.now() };
      const isCompleted = log.completedTaskIds.includes(taskId);
      
      let newCompletedIds;
      if (isCompleted) {
        newCompletedIds = log.completedTaskIds.filter(id => id !== taskId);
      } else {
        newCompletedIds = [...log.completedTaskIds, taskId];
      }

      const newLog = { ...log, completedTaskIds: newCompletedIds, lastUpdated: Date.now() };
      const newLogs = { ...prev, [date]: newLog };
      
      // Check Streak Condition for this date
      checkStreakForDate(date, newLog, routine);
      
      return newLogs;
    });
  };

  const checkStreakForDate = (date: string, log: DailyLog, currentRoutine: RoutineBlock[]) => {
    // Calculate completion
    const allTasks = currentRoutine.flatMap(b => b.tasks);
    const mustDoTasks = allTasks.filter(t => t.mustDo);
    const completedCount = log.completedTaskIds.length;
    const totalCount = allTasks.length;
    const completedMustDos = mustDoTasks.filter(t => log.completedTaskIds.includes(t.id));
    
    const allMustDosDone = completedMustDos.length === mustDoTasks.length && mustDoTasks.length > 0;
    const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    
    const isStreakKept = allMustDosDone || completionRate >= settings.completionThreshold;

    if (isStreakKept) {
      // Update streak state if not already counted for today
      // This logic needs to be robust against double counting
      // Simplified: We just store the "lastStreakDate"
      
      const today = format(new Date(), 'yyyy-MM-dd');
      if (date === today) {
         setStreak(prev => {
             if (prev.lastStreakDate === today) return prev; // Already counted
             
             // Check if yesterday was completed or if it's the start
             // Ideally we check yesterday's log. 
             // For simplicity in this prototype:
             // If lastStreakDate was yesterday, increment. Else reset to 1.
             
             const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
             const isContinuation = prev.lastStreakDate === yesterday;
             
             const newCurrent = isContinuation ? prev.currentStreak + 1 : 1;
             
             return {
                 ...prev,
                 currentStreak: newCurrent,
                 bestStreak: Math.max(prev.bestStreak, newCurrent),
                 lastStreakDate: today
             };
         });
         
         // Celebration!
         if (streak.lastStreakDate !== today) {
             toast({
                 title: "Streak Kept! 🔥",
                 description: "You've hit your daily target.",
                 className: "border-green-500/50 text-green-500"
             });
         }
      }
    }
  };

  return (
    <AppContext.Provider value={{ routine, logs, streak, settings, setRoutine, toggleTask, updateSettings, resetRoutine }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
