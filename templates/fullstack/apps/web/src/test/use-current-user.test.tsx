import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useCurrentUser } from '../hooks/use-current-user';

vi.mock('../auth/auth-client', () => ({
  authClient: {
    useSession: vi.fn(),
  },
}));

import { authClient } from '../auth/auth-client';

describe('useCurrentUser', () => {
  it('returns guest state when unauthenticated', () => {
    vi.mocked(authClient.useSession).mockReturnValue({
      data: null,
      isPending: false,
      isRefetching: false,
      error: null,
      refetch: vi.fn(),
    } as never);

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.hasUser).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.sessionPending).toBe(false);
  });

  it('maps authenticated session user', () => {
    vi.mocked(authClient.useSession).mockReturnValue({
      data: {
        user: {
          id: 'u1',
          name: 'Admin User',
          email: 'admin@example.com',
          emailVerified: true,
          image: null,
          role: 'admin',
        },
      },
      isPending: false,
      isRefetching: false,
      error: null,
      refetch: vi.fn(),
    } as never);

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.hasUser).toBe(true);
    expect(result.current.user).toEqual(
      expect.objectContaining({ id: 'u1', role: 'admin' }),
    );
  });
});