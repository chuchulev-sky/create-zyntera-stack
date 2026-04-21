
const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');

export class ApiError extends Error {
    readonly status: number;
    readonly body: unknown;

    constructor(message: string, status: number, body: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.body = body;
    }
}

export type ApiRequestInit = Omit<RequestInit, 'body'> & {
    body?: unknown;
}

function getErrorMessage(data: unknown, fallback: string) {
    if (typeof data !== 'object' || data === null) return fallback;

    const obj = data as Record<string, unknown>;

    if (typeof obj.message === 'string' && obj.message.trim()) {
        return obj.message;
    }

    if (typeof obj.error === 'string' && obj.error.trim()) {
        return obj.error;
    }
    return fallback;
}

/**
 * JSON fetch to your Express API (under VITE_API_BASE_URL).
 * Sends cookies (Better Auth session) on cross-origin dev and same-origin prod.
 */
export async function apiRequest<T>(
    path: string,
    init: ApiRequestInit = {},
): Promise<T> {
    const url = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;

    const headers = new Headers(init.headers);
    if (init.body !== undefined && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const res = await fetch(url, {
        ...init,
        headers,
        credentials: 'include',
        body:
            init.body !== undefined && typeof init.body !== 'string' && !(init.body instanceof FormData)
            ? JSON.stringify(init.body)
            : (init.body as BodyInit | null | undefined),
    })

    const text = await res.text()
    let data: unknown = null
    if (text) {
        try {
            data = JSON.parse(text) as unknown
        } catch {
            data = text
        }
    }

    if (!res.ok) {
        const message = getErrorMessage(data, res.statusText || 'Request failed');
        throw new ApiError(message || 'Request failed', res.status, data)
    }

    return data as T;
}