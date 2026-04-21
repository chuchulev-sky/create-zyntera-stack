import { authClient } from "../auth/auth-client";
import type { Me } from "../types/me";

/** Single mapping from Better Auth session user -> app `Me` type. */
function toMe(raw: NonNullable<
    NonNullable<ReturnType<typeof authClient.useSession>['data']>['user']>): Me {
    return {
        id: raw.id,
        name: raw.name,
        email: raw.email,
        emailVerified: raw.emailVerified,
        image: raw.image ?? null,
        role: raw.role === 'admin' ? 'admin' : 'user',
    }
}

export function useCurrentUser() {
    const { data: session, isPending: sessionPending } = authClient.useSession();
    const hasUser = Boolean(session?.user);
    const user = session?.user ? toMe(session.user): null;

    return {
        session,
        hasUser,
        user,
        sessionPending,
    };
}