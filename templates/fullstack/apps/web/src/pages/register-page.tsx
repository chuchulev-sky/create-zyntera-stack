import { useNavigate } from 'react-router';

import { RegisterForm } from '@/features/auth/components/register-form';

export function RegisterPage() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex w-full max-w-md items-center justify-center px-4 py-10">
      <RegisterForm onSuccess={() => navigate('/')} />
    </main>
  );
}