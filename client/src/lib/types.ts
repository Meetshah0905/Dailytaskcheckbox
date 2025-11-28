export type Task = {
  id: string;
  title: string;
  mustDo: boolean;
  order: number;
};

export type RoutineBlock = {
  id: string;
  name: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  order: number;
  tasks: Task[];
};

export type DailyLog = {
  date: string; // YYYY-MM-DD
  completedTaskIds: string[];
  notes?: string;
  lastUpdated: number;
};

export type StreakState = {
  currentStreak: number;
  bestStreak: number;
  lastStreakDate: string | null; // YYYY-MM-DD of the last day streak was kept
  freezeLedger: string[]; // Dates where freeze was used
};

export type Settings = {
  completionThreshold: number; // 0-100
  streakFreezeEnabled: boolean;
  theme: 'dark' | 'light';
};

export type AppState = {
  routine: RoutineBlock[];
  logs: Record<string, DailyLog>;
  streak: StreakState;
  settings: Settings;
};
