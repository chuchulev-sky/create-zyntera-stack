import { useNavigate } from 'react-router';

import { LoginForm } from '@/features/auth/components/login-form';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex w-full max-w-md items-center justify-center px-4 py-10">
      <LoginForm onSuccess={() => navigate('/')} />
    </main>
  );
}