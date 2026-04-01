import { GoalDashboard } from '../features/goals/components/GoalDashboard';

interface GoalsPageProps {
  userId: string;
  onCreateGoal: () => void;
}

export function GoalsPage({ userId, onCreateGoal }: GoalsPageProps) {
  return (
    <div className="pt-8 pb-20">
      <GoalDashboard userId={userId} onCreateGoal={onCreateGoal} variant="goals" />
    </div>
  );
}
