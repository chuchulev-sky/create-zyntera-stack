/**
 * Better Auth instance: Drizzle/MySQL adapter, email/password, and URL config.
 *
 * `basePath` must stay in sync with routes (`/api/v1/auth`) and `BETTER_AUTH_URL`.
 */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from '../models/schema.js';
import { sendVerificationEmail as sendVerificationEmailService } from "../services/email.service.js";
import { db } from "./db.js";
import { env } from "./env.js";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'mysql',
        schema: schema,
    }),

    emailAndPassword: { 
        enabled: true,
        requireEmailVerification: true,
    },

    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            const frontendUrl = new URL('/verify-email', env.APP_WEB_URL);
            const source = new URL(url);
            const token = source.searchParams.get('token');
            
            if (token) {
                frontendUrl.searchParams.set('token', token);
            }

            frontendUrl.searchParams.set('next', '/app');

            void sendVerificationEmailService({
                to: user.email,
                verifyUrl: frontendUrl.toString(),
            });
        }
    },
    user: {
        additionalFields: {
            role: {
                type: 'string',
                required: false,
                defaultValue: 'user',
                input: false,
            },
        },
    },
    basePath: '/api/v1/auth',
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.CORS_ORIGIN],
});

export type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;
export type AuthUser = NonNullable<AuthSession>['user'];
export type Auth = typeof auth;