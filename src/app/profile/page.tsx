'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const getInitials = (email: string | null) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
            <div className="flex items-center gap-6">
                 <Avatar className="h-24 w-24 border-2 border-primary">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                    <AvatarFallback className="text-4xl">{getInitials(user.email)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-3xl font-headline">{user.displayName || 'Anonymous User'}</CardTitle>
                    <CardDescription className="text-lg">{user.email}</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">User Details</h3>
            <div className="text-muted-foreground mt-2 space-y-1">
              <p><strong>UID:</strong> {user.uid}</p>
              <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
              <p><strong>Provider:</strong> {user.providerId}</p>
            </div>
          </div>
          <Button onClick={() => router.push('/')}>Back to Home</Button>
        </CardContent>
      </Card>
    </div>
  );
}
