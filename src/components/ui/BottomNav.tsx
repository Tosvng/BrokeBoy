import { NavLink } from "react-router-dom";

const DashboardIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const GoalsIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <circle cx="12" cy="12" r="4"/>
    {active && <circle cx="12" cy="12" r="1.5" fill="currentColor"/>}
  </svg>
);

const ActivityIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinejoin={active ? "bevel" : "round"}/>
  </svg>
);

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const tabs = [
  { to: "/", label: "Dashboard", Icon: DashboardIcon },
  { to: "/goals", label: "Goals", Icon: GoalsIcon },
  { to: "/activity", label: "Activity", Icon: ActivityIcon },
  { to: "/profile", label: "Profile", Icon: ProfileIcon },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/5">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all ${
                isActive ? "text-gold" : "text-text-secondary"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon active={isActive} />
                <span className="text-[10px] font-semibold tracking-wide">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
