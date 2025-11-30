'use client';

import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const profileRef = useMemoFirebase(
    () => (user ? doc(firestore, `users/${user.uid}/profiles`, user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(profileRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading || !user) {
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
          <CardContent className="space-y-6 pt-6">
            <Skeleton className="h-4 w-1/3" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-4 w-1/3" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
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
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                 <Avatar className="h-24 w-24 border-2 border-primary">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                    <AvatarFallback className="text-4xl">{getInitials(user.email)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle className="text-3xl font-headline">{userProfile?.firstName || user.displayName || 'Anonymous User'} {userProfile?.lastName}</CardTitle>
                    <CardDescription className="text-lg">{user.email}</CardDescription>
                </div>
                <Button onClick={() => router.push('/profile/edit')}>Edit Profile</Button>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <div>
            <h3 className="font-semibold text-lg mb-2">Academic Profile</h3>
            {userProfile ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted/50 rounded-md">
                  <p className="font-medium text-muted-foreground">CGPA</p>
                  <p className="text-xl font-bold">{userProfile.cgpa || 'N/A'}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-md">
                  <p className="font-medium text-muted-foreground">Entrance Exam Score</p>
                  <p className="text-xl font-bold">{userProfile.entranceExamScores || 'N/A'}</p>
                </div>
                 <div className="p-3 bg-muted/50 rounded-md">
                  <p className="font-medium text-muted-foreground">Preferred Region</p>
                  <p className="text-xl font-bold">
                    <Badge variant="outline">{userProfile.regionPreference || 'N/A'}</Badge>
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-md">
                  <p className="font-medium text-muted-foreground">Education Board</p>
                  <p className="text-xl font-bold">{userProfile.board || 'N/A'}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Your academic profile is empty. Edit your profile to get personalized recommendations.</p>
            )}
          </div>
           <Separator />
          <div>
            <h3 className="font-semibold text-lg">User Details</h3>
            <div className="text-muted-foreground mt-2 space-y-1 text-sm">
              <p><strong>UID:</strong> {user.uid}</p>
              <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
              <p><strong>Provider:</strong> {user.providerId}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
