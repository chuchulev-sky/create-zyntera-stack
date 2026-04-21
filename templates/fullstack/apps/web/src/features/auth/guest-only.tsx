import type { ReactNode } from "react";
import { Navigate } from "react-router";

import { authClient } from "../../auth/auth-client";
import { Spinner } from "../../components/ui/Spinner";

export function GuestOnly({ children }: { children: ReactNode }) {
    const { data, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <div style={{ padding: 24 }}>
                <Spinner />
            </div>
        );
    }

    if (data?.user) {
        return <Navigate to='/' replace />;
    }

    return <>{children}</>;
}