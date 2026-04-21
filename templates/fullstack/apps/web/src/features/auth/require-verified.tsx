// apps/web/src/features/auth/require-verified.tsx
import { Navigate, Outlet } from 'react-router';
import { Spinner } from '@/components/ui/Spinner';
import { useCurrentUser } from '@/hooks/use-current-user';

export function RequireVerified() {
  const { hasUser, user, sessionPending } = useCurrentUser();

  if (sessionPending) {
    return (
      <div style={{ padding: 24 }}>
        <Spinner />
      </div>
    );
  }

  if (!hasUser) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
}