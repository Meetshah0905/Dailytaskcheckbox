import { RoutineBlock, Settings, StreakState } from "./types";

export const DEFAULT_SETTINGS: Settings = {
  completionThreshold: 80,
  streakFreezeEnabled: true,
  theme: 'dark'
};

export const DEFAULT_STREAK: StreakState = {
  currentStreak: 0,
  bestStreak: 0,
  lastStreakDate: null,
  freezeLedger: []
};

export const DEFAULT_ROUTINE: RoutineBlock[] = [
  {
    id: 'block-1',
    name: 'Morning Reset',
    startTime: '06:30',
    endTime: '07:10',
    order: 0,
    tasks: [
      { id: 't1-1', title: 'Wake up at 6:30', mustDo: true, order: 0 },
      { id: 't1-2', title: 'Black coffee', mustDo: false, order: 1 },
      { id: 't1-3', title: 'Read 5 pages', mustDo: false, order: 2 },
      { id: 't1-4', title: 'Oil pulling', mustDo: false, order: 3 },
      { id: 't1-5', title: 'Brush teeth', mustDo: false, order: 4 },
      { id: 't1-6', title: 'Shower', mustDo: false, order: 5 },
    ]
  },
  {
    id: 'block-2',
    name: 'Skills Sprint',
    startTime: '07:10',
    endTime: '08:20',
    order: 1,
    tasks: [
      { id: 't2-1', title: 'English speaking practice', mustDo: false, order: 0 },
      { id: 't2-2', title: 'Sales call practice', mustDo: false, order: 1 },
      { id: 't2-3', title: 'Objection handling', mustDo: false, order: 2 },
    ]
  },
  {
    id: 'block-3',
    name: 'Gym',
    startTime: '08:30',
    endTime: '10:30',
    order: 2,
    tasks: [
      { id: 't3-1', title: 'Leave for gym', mustDo: false, order: 0 },
      { id: 't3-2', title: 'Workout', mustDo: true, order: 1 },
      { id: 't3-3', title: 'Stretching/cooldown', mustDo: false, order: 2 },
    ]
  },
  {
    id: 'block-4',
    name: 'Post Gym + Meals',
    startTime: '10:30',
    endTime: '12:30',
    order: 3,
    tasks: [
      { id: 't4-1', title: 'Shower + get fresh', mustDo: false, order: 0 },
      { id: 't4-2', title: 'Breakfast / post-workout', mustDo: false, order: 1 },
      { id: 't4-3', title: 'Lunch finished by 12:30', mustDo: false, order: 2 },
    ]
  },
  {
    id: 'block-5',
    name: 'Mandarin',
    startTime: '11:20',
    endTime: '12:00',
    order: 4,
    tasks: [
      { id: 't5-1', title: 'Mandarin vocab', mustDo: false, order: 0 },
      { id: 't5-2', title: 'Listening + shadowing', mustDo: false, order: 1 },
    ]
  },
  {
    id: 'block-6',
    name: 'Business',
    startTime: '12:30',
    endTime: '18:00',
    order: 5,
    tasks: [
      { id: 't6-1', title: 'Business with father', mustDo: true, order: 0 },
      { id: 't6-2', title: 'Follow-ups + payments', mustDo: false, order: 1 },
      { id: 't6-3', title: '5 new outreach msgs', mustDo: false, order: 2 },
      { id: 't6-4', title: '2 sales calls', mustDo: false, order: 3 },
      { id: 't6-5', title: 'Vendor coordination', mustDo: false, order: 4 },
    ]
  },
  {
    id: 'block-7',
    name: 'Content Creation',
    startTime: '18:00',
    endTime: '19:30',
    order: 6,
    tasks: [
      { id: 't7-1', title: 'Record content', mustDo: true, order: 0 },
      { id: 't7-2', title: 'Post / schedule', mustDo: false, order: 1 },
      { id: 't7-3', title: 'Reply to comments', mustDo: false, order: 2 },
    ]
  },
  {
    id: 'block-8',
    name: 'Dinner',
    startTime: '19:30',
    endTime: '20:15',
    order: 7,
    tasks: [
      { id: 't8-1', title: 'Dinner', mustDo: false, order: 0 },
    ]
  },
  {
    id: 'block-9',
    name: 'Editing Focus',
    startTime: '20:15',
    endTime: '21:45',
    order: 8,
    tasks: [
      { id: 't9-1', title: 'Edit content', mustDo: false, order: 0 },
      { id: 't9-2', title: 'Upload/export', mustDo: false, order: 1 },
    ]
  },
  {
    id: 'block-10',
    name: 'Walk',
    startTime: '22:00',
    endTime: '22:30',
    order: 9,
    tasks: [
      { id: 't10-1', title: 'Walk at 10:00 pm', mustDo: true, order: 0 },
    ]
  },
  {
    id: 'block-11',
    name: 'Wind Down',
    startTime: '22:30',
    endTime: '23:30',
    order: 10,
    tasks: [
      { id: 't11-1', title: 'Chill / fun', mustDo: false, order: 0 },
      { id: 't11-2', title: 'Sleep by 11:30', mustDo: true, order: 1 },
    ]
  },
];
