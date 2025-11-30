'use client';

import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection } from 'firebase/firestore';
import type { College } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const collegesQuery = useMemoFirebase(
    () => (user ? collection(firestore, 'colleges') : null),
    [firestore, user]
  );
  // This hook will now always result in an error for any user because of the security rules.
  const { isLoading: areCollegesLoading, error: collegesError } = useCollection<College>(collegesQuery);
  
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Wait until loading is complete before making a decision.
    if (isUserLoading || areCollegesLoading) {
      return;
    }

    // If there's any user and a permission error exists after loading, they are not an admin.
    // This will now be true for ALL users.
    if (user && collegesError) {
      setIsAuthorized(false);
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'You do not have permission to view this page.'
      });
      router.push('/');
    } else if (!user) {
      // If there's no user, deny access.
      setIsAuthorized(false);
       toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'You must be logged in to view this page.'
      });
      router.push('/login');
    } else {
        // This case should not be reachable if rules are correct, but as a fallback, deny access.
        setIsAuthorized(false);
        toast({
            variant: 'destructive',
            title: 'Access Denied',
            description: 'You do not have permission to view this page.'
          });
        router.push('/');
    }
  }, [user, isUserLoading, areCollegesLoading, collegesError, router, toast]);

  // Show a full-page loading skeleton while we determine authorization.
  if (isAuthorized === null) {
    return (
      <div className="container mx-auto py-12">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-2">
                  <Skeleton className="h-10 w-1/4" />
                  <Skeleton className="h-10 w-1/4" />
                  <Skeleton className="h-10 w-1/4" />
                  <Skeleton className="h-10 w-1/4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not authorized, render nothing as the redirect is in progress.
  if (!isAuthorized) {
    return null;
  }
  
  // This part of the component is now effectively unreachable but is kept for structural integrity.
  return (
    <div className="container mx-auto py-12">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>Manage college listings.</CardDescription>
            </div>
            <Button disabled>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add College (Disabled)
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Admin access is disabled.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
