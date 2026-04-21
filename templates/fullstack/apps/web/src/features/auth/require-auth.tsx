import { Navigate, Outlet, useLocation } from 'react-router';

import { authClient } from '../../auth/auth-client';
import { Spinner } from '../../components/ui/Spinner';

export function RequireAuth() {
    const location = useLocation();
    const { data, isPending } = authClient.useSession();
    
    if (isPending) {
        return (
            <div style={{ padding: 24 }}>
                <Spinner />
            </div>
        );
    };

    if (!data?.user) {
        return <Navigate to='/login' replace state={{ from: location.pathname }} />;
    }

    return <Outlet />;
}