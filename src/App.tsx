import { useState } from 'react';
import { useAuth } from './features/auth/hooks/useAuth';
import { logout } from './features/auth/api/auth';
import { LoginModal } from './features/auth/components/LoginModal';
import { GoalDashboard } from './features/goals/components/GoalDashboard';
import { CreateGoalForm } from './features/goals/components/CreateGoalForm';
import { ActivityList } from './features/goals/components/ActivityList';
import { Layout } from './components/ui/Layout';
import { BottomNav } from './components/ui/BottomNav';
import { ThemeProvider } from './components/ui/ThemeProvider';

type Tab = "dashboard" | "goals" | "activity" | "profile";

function AppInner() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [showCreate, setShowCreate] = useState(false);

  if (loading) {
    return (
      <Layout hideNav>
        <div className="flex h-screen items-center justify-center">
          <div className="text-gold animate-pulse label-sm tracking-widest">Initializing...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout hideNav>
        <LoginModal />
      </Layout>
    );
  }

  return (
    <>
      <Layout onFab={() => setShowCreate(true)}>
        {showCreate ? (
          <CreateGoalForm
            userId={user.uid}
            onCreated={() => setShowCreate(false)}
            onCancel={() => setShowCreate(false)}
          />
        ) : (
          <>
            {tab === "dashboard" && <GoalDashboard userId={user.uid} onCreateGoal={() => setShowCreate(true)} variant="dashboard" />}
            {tab === "goals" && (
              <div className="pt-8 pb-20">
                <GoalDashboard userId={user.uid} onCreateGoal={() => setShowCreate(true)} variant="goals" />
              </div>
            )}
            {tab === "activity" && <ActivityList userId={user.uid} />}
            {tab === "profile" && (
              <div className="px-5 pt-10 flex flex-col gap-6">
                <h2 className="headline-md text-on-surface">Profile</h2>
                <div className="card-surface p-6 flex flex-col gap-4">
                  <div>
                    <p className="label-sm text-on-surface-variant mb-1">Signed in as</p>
                    <p className="title-md text-on-surface">{user.displayName || user.email}</p>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="mt-2 py-3 px-5 rounded-xl bg-error/10 text-error font-semibold text-sm hover:bg-error/20 transition-colors self-start"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Layout>
      {!showCreate && (
        <BottomNav activeTab={tab} onTabChange={(t) => setTab(t)} />
      )}
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AppInner />
    </ThemeProvider>
  );
}

export default App;
