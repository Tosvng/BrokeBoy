import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './features/auth/hooks/useAuth';
import { LoginModal } from './features/auth/components/LoginModal';
import { CreateGoalForm } from './features/goals/components/CreateGoalForm';
import { Layout } from './components/ui/Layout';
import { BottomNav } from './components/ui/BottomNav';
import { ThemeProvider } from './components/ui/ThemeProvider';
import { DashboardPage } from './pages/DashboardPage';
import { GoalsPage } from './pages/GoalsPage';
import { ActivityPage } from './pages/ActivityPage';
import { ProfilePage } from './pages/ProfilePage';

function AppInner() {
  const { user, loading } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

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

  const handleCreated = () => {
    setShowCreate(false);
    navigate('/goals');
  };

  return (
    <>
      <Layout onFab={() => setShowCreate(true)}>
        {showCreate ? (
          <CreateGoalForm
            userId={user.uid}
            onCreated={handleCreated}
            onCancel={() => setShowCreate(false)}
          />
        ) : (
          <Routes>
            <Route path="/" element={<DashboardPage userId={user.uid} onCreateGoal={() => setShowCreate(true)} />} />
            <Route path="/goals" element={<GoalsPage userId={user.uid} onCreateGoal={() => setShowCreate(true)} />} />
            <Route path="/activity" element={<ActivityPage userId={user.uid} />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </Layout>
      {!showCreate && <BottomNav />}
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
