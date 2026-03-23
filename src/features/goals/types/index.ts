export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  targetDate?: string; // ISO date string
  monthlyContribution?: number;
  createdAt: string; // ISO date string
  completedAt?: string; // ISO date string, set when goal is marked complete
}

export interface Contribution {
  id: string;
  userId: string;
  goalId: string;
  amount: number;
  date: string; // ISO date string
}
