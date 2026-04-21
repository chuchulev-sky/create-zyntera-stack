/**
 * Application user in the UI - comes from Better Auth `session.user` object.
 * (see `useCurrentUser` hook). Matcher `users` + `user.additionalFields.role` on the server.
 */
export type Me = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    role: 'admin' | 'user';
}