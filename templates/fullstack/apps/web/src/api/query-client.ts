import { QueryClient } from '@tanstack/react-query';

import { ApiError } from './client';

export function createAppQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30_000,
                retry: (failureCount, error) => {
                    if (error instanceof ApiError && error.status === 401) {
                        return false;
                    }
                    return failureCount < 2;
                },
            },
        },
    });
}