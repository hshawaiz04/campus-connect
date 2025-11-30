'use client';

import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="container mx-auto flex h-full flex-col items-center justify-center gap-8 py-12 md:py-24">
      <LoginForm />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>
            This area is for authorized administrators only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>Contact the administrator for the login credentials.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
