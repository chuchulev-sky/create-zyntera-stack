export function parseError(data: unknown, fallback: string): string {
    if (typeof data !== 'object' || data === null) {
        return fallback;
    }
    const o = data as Record<string, unknown>;
    if (typeof o.message === 'string' && o.message) {
        return o.message;
    }
    if (typeof o.error === 'string' && o.error) {
        return o.error;
    }
    return fallback;
}