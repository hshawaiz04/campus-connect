'use client';

import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="container mx-auto flex h-full flex-col items-center justify-center gap-8 py-12 md:py-24">
      <LoginForm />
    </div>
  );
}
