import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../context/theme-context';

import { RootLayout } from '../app/root-layout';

vi.mock('../hooks/use-current-user', () => ({
  useCurrentUser: vi.fn(),
}));

vi.mock('../auth/auth-client', () => ({
  authClient: {
    signOut: vi.fn().mockResolvedValue({ error: null }),
  },
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

import { authClient } from '../auth/auth-client';
import { useCurrentUser } from '../hooks/use-current-user';

describe('RootLayout', () => {
  it('shows Login link for guests', () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      session: null,
      user: null,
      sessionPending: false,
    } as never);

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <MemoryRouter>
            <RootLayout />
          </MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sign out/i })).not.toBeInTheDocument();
  });

  it('shows admin link for admin user and signs out', async () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      session: { user: { email: 'admin@example.com' } },
      user: { role: 'admin' },
      sessionPending: false,
    } as never);

    const user = userEvent.setup();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <MemoryRouter>
            <RootLayout />
          </MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /sign out/i }));
    expect(authClient.signOut).toHaveBeenCalledTimes(1);
  });
});