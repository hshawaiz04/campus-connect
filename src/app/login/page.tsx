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
            To access the admin dashboard, sign up and log in with the following credentials:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> admin@example.com</p>
            <p><strong>Password:</strong> password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
