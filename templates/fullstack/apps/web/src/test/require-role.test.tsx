import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { RequireRole } from '../features/auth/require-role';

vi.mock('../hooks/use-current-user', () => ({
  useCurrentUser: vi.fn(),
}));

import { useCurrentUser } from '../hooks/use-current-user';

describe('RequireRole', () => {
  it('redirects guests to /login', async () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      hasUser: false,
      user: null,
      sessionPending: false,
      mePending: false,
    } as never);

    const router = createMemoryRouter(
      [
        {
          path: '/admin',
          element: <RequireRole role="admin" />,
          children: [{ index: true, element: <div>Admin Area</div> }],
        },
        { path: '/login', element: <div>Login Page</div> },
      ],
      { initialEntries: ['/admin'] },
    );

    render(<RouterProvider router={router} />);
    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });

  it('redirects non-admin users to /app', async () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      hasUser: true,
      user: { role: 'user' },
      sessionPending: false,
      mePending: false,
    } as never);

    const router = createMemoryRouter(
      [
        {
          path: '/admin',
          element: <RequireRole role="admin" />,
          children: [{ index: true, element: <div>Admin Area</div> }],
        },
        { path: '/app', element: <div>App Home</div> },
      ],
      { initialEntries: ['/admin'] },
    );

    render(<RouterProvider router={router} />);
    expect(await screen.findByText('App Home')).toBeInTheDocument();
  });

  it('allows admin users', async () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      hasUser: true,
      user: { role: 'admin' },
      sessionPending: false,
      mePending: false,
    } as never);

    const router = createMemoryRouter(
      [
        {
          path: '/admin',
          element: <RequireRole role="admin" />,
          children: [{ index: true, element: <div>Admin Area</div> }],
        },
      ],
      { initialEntries: ['/admin'] },
    );

    render(<RouterProvider router={router} />);
    expect(await screen.findByText('Admin Area')).toBeInTheDocument();
  });
});