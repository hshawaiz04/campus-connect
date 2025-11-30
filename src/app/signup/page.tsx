'use client';

import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <div className="container mx-auto flex h-full items-center justify-center py-12 md:py-24">
      <SignupForm />
    </div>
  );
}
