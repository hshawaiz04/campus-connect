'use client';

import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="container mx-auto flex h-full items-center justify-center py-12 md:py-24">
      <LoginForm />
    </div>
  );
}
