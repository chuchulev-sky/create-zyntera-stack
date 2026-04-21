import { Navigate, Outlet } from "react-router";

import { Spinner } from "../../components/ui/Spinner";
import { useCurrentUser } from "../../hooks/use-current-user";
import type { Me } from "../../types/me";

type RequireRoleProps = {
    role: Me['role'];
}

export function RequireRole({ role }: RequireRoleProps) {
    const { hasUser, user, sessionPending } = useCurrentUser();

    if (sessionPending) {
        return (
            <div style={{ padding: 24 }}>
                <Spinner />
            </div>
        );
    }

    if (!hasUser) {
        return <Navigate to='/login' replace />;
    }

    if (!user || user.role !== role) {
        return <Navigate to='/app' replace />;
    }

    return <Outlet />;
}