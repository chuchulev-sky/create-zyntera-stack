import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RegisterPage } from '../pages/register-page';

const signUpEmailMock = vi.fn();

vi.mock('../auth/auth-client', () => ({
  authClient: {
    signUp: {
      email: (...args: unknown[]) => signUpEmailMock(...args),
    },
  },
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    signUpEmailMock.mockReset();
    signUpEmailMock.mockResolvedValue({ error: null });
  });

  it('submits valid payload', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/username/i), 'johndoe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');

    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(signUpEmailMock).toHaveBeenCalledWith({
      name: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
    });
  });

  it('shows validation error when passwords do not match', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/username/i), 'johndoe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password456');

    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(signUpEmailMock).not.toHaveBeenCalled();
  });

  it('shows server error alert when registration fails', async () => {
    const user = userEvent.setup();
    signUpEmailMock.mockResolvedValueOnce({
      error: { message: 'Email already in use' },
    });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/username/i), 'johndoe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');

    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText(/email already in use/i)).toBeInTheDocument();
  });
});