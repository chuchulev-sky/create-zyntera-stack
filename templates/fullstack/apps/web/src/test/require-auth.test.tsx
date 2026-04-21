import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { RequireAuth } from '../features/auth/require-auth';

vi.mock('../auth/auth-client', () => ({
  authClient: {
    useSession: vi.fn(),
  },
}));

import { authClient } from '../auth/auth-client';

describe('RequireAuth', () => {
  it('redirects guests to /login', async () => {
    vi.mocked(authClient.useSession).mockReturnValue({
      data: null,
      isPending: false,
    } as never);

    const router = createMemoryRouter(
      [
        {
          path: '/app',
          element: <RequireAuth />,
          children: [{ index: true, element: <div>Protected Content</div> }],
        },
        { path: '/login', element: <div>Login Page</div> },
      ],
      { initialEntries: ['/app'] },
    );

    render(<RouterProvider router={router} />);
    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });

  it('renders protected route for authenticated users', async () => {
    vi.mocked(authClient.useSession).mockReturnValue({
      data: { user: { id: 'u1', email: 'test@example.com' } },
      isPending: false,
    } as never);

    const router = createMemoryRouter(
      [
        {
          path: '/app',
          element: <RequireAuth />,
          children: [{ index: true, element: <div>Protected Content</div> }],
        },
      ],
      { initialEntries: ['/app'] },
    );

    render(<RouterProvider router={router} />);
    expect(await screen.findByText('Protected Content')).toBeInTheDocument();
  });
});