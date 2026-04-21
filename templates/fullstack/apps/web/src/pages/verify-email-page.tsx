// apps/web/src/pages/verify-email-page.tsx
import { authClient } from '@/auth/auth-client';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

type VerifyState = 'idle' | 'verifying' | 'success' | 'error';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { hasUser, user, sessionPending } = useCurrentUser();

  const token = params.get('token');
  const next = params.get('next') ?? '/app';

  const [state, setState] = useState<VerifyState>('idle');
  const [message, setMessage] = useState<string>('');
  const [resending, setResending] = useState(false);

  const hasToken = useMemo(() => Boolean(token), [token]);

  useEffect(() => {
    if (!token) return;

    let active = true;
    async function runVerify() {
      setState('verifying');
      const { error } = await authClient.verifyEmail({
        query: { token },
      });

      if (!active) return;

      if (error) {
        setState('error');
        setMessage(error.message ?? 'Verification failed. Request a new email.');
        return;
      }

      setState('success');
      setMessage('Email verified successfully. Redirecting...');
      setTimeout(() => {
        navigate(next, { replace: true });
      }, 800);
    }

    void runVerify();
    return () => {
      active = false;
    };
  }, [token, navigate, next]);

  async function handleResend() {
    if (!user?.email) {
      setMessage('Please sign in first to resend verification.');
      return;
    }

    setResending(true);
    setMessage('');
    const { error } = await authClient.sendVerificationEmail({
      email: user.email,
      callbackURL: `${window.location.origin}/verify-email?next=/app`,
    });
    setResending(false);

    if (error) {
      setMessage(error.message ?? 'Could not resend verification email.');
      return;
    }

    setMessage('Verification email sent. Check your inbox.');
  }

  if (hasToken) {
    return (
      <main className="mx-auto max-w-md space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Verifying email</h1>
        {state === 'verifying' ? <p>Verifying your email...</p> : null}
        {state === 'success' ? <p>{message}</p> : null}
        {state === 'error' ? (
          <div className="space-y-2">
            <p className="text-red-600">{message}</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="rounded border px-3 py-2"
            >
              {resending ? 'Sending...' : 'Resend verification email'}
            </button>
          </div>
        ) : null}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Verify your email</h1>
      <p>You must verify your email before accessing the app.</p>

      {sessionPending ? <p>Checking session...</p> : null}

      {!sessionPending && !hasUser ? (
        <p>Please sign in first, then request a verification email.</p>
      ) : null}

      {!sessionPending && hasUser ? (
        <>
          <p>Signed in as: {user?.email ?? 'unknown'}</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="rounded border px-3 py-2"
          >
            {resending ? 'Sending...' : 'Resend verification email'}
          </button>
        </>
      ) : null}

      {message ? <p>{message}</p> : null}
    </main>
  );
}