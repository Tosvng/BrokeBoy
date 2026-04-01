import { GoalDashboard } from '../features/goals/components/GoalDashboard';

interface DashboardPageProps {
  userId: string;
  onCreateGoal: () => void;
}

export function DashboardPage({ userId, onCreateGoal }: DashboardPageProps) {
  return <GoalDashboard userId={userId} onCreateGoal={onCreateGoal} variant="dashboard" />;
}
