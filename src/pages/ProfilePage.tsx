import { logout } from '../features/auth/api/auth';
import type { User } from 'firebase/auth';

interface ProfilePageProps {
  user: User;
}

export function ProfilePage({ user }: ProfilePageProps) {
  return (
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
  );
}
