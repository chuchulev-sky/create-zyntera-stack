import type { Auth } from '@server/config/auth';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

const apiOrigin = new URL(import.meta.env.VITE_API_BASE_URL).origin;

/**
 * Typed client for Better Auth routes under `/api/v1/auth` (must match `src/config/auth.ts`).
 */
export const authClient = createAuthClient({
    baseURL: apiOrigin,
    basePath: '/api/v1/auth',
    plugins: [inferAdditionalFields<Auth>()],
});