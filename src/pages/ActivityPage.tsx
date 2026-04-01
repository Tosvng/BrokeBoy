import { ActivityList } from '../features/goals/components/ActivityList';

interface ActivityPageProps {
  userId: string;
}

export function ActivityPage({ userId }: ActivityPageProps) {
  return <ActivityList userId={userId} />;
}
