export interface UserMetrics {
  deepWorkMinutes: number;
  sleepScore: number; // 0-100
  hrv: number; // ms
  retentionDays: number;
  steps: number;
  workoutCompleted: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum WarModeStatus {
  OPTIMAL = 'OPTIMAL',
  COMPROMISED = 'COMPROMISED',
  CRITICAL = 'CRITICAL' // < 80% integrity
}

export interface IntegrityBreakdown {
  score: number;
  deepWorkContribution: number;
  physicalContribution: number;
  mentalContribution: number;
}
