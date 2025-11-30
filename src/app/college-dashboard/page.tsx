'use client';

import { useUser, useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import type { College } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CollegeForm } from '@/components/college-form';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { doc, getDoc } from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';


export default function CollegeDashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const collegeDocId = useMemo(() => user ? `user-managed-${user.uid}` : null, [user]);

  const collegeRef = useMemoFirebase(
    () => (collegeDocId ? doc(firestore, 'colleges', collegeDocId) : null),
    [firestore, collegeDocId]
  );
  const { data: college, isLoading: isCollegeLoading, refetch } = useDoc<College>(collegeRef);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    
    // A simple role check, real security is in Firestore rules
    const checkRole = async () => {
        if (user) {
          const isEduEmail = user.email?.endsWith('.edu');
            try {
                const userDocSnap = await getDoc(doc(firestore, 'users', user.uid));
                if (userDocSnap.exists() && userDocSnap.data().role === 'college' && isEduEmail) {
                    setIsAuthorized(true);
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'Access Denied',
                        description: 'You are not authorized to view this page. A valid .edu email is required.'
                    });
                    router.push('/');
                    setIsAuthorized(false);
                }
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to verify user role.'
                });
                router.push('/');
                setIsAuthorized(false);
            }
        }
    };
    checkRole();
  }, [user, isUserLoading, firestore, router, toast]);

  const handleSubmit = (data: College) => {
    if (!collegeRef) return;

    const finalData: College = {
      ...data,
      id: collegeDocId!, // Ensure the ID is maintained
      managedBy: user!.uid, // Ensure the manager is always set
    };
    
    setIsSubmitting(true);
    setDocumentNonBlocking(collegeRef, finalData, { merge: true });

    toast({
      title: college ? 'College Updated' : 'College Created',
      description: `${finalData.name} profile has been successfully saved.`,
    });

    setTimeout(() => {
        setIsSubmitting(false);
    }, 1000);
  };
  
  const handleDelete = () => {
    if (!collegeRef) return;
    deleteDocumentNonBlocking(collegeRef);
    toast({
      title: 'Profile Deleted',
      description: 'Your college profile has been successfully removed.',
    });
    setIsDeleting(false);
    refetch(); // Refetch to update the UI state, showing the profile is gone
  };

  const isLoading = isUserLoading || isCollegeLoading || isAuthorized === null;

  if (isLoading || !user || !isAuthorized) {
      return (
        <div className="container mx-auto py-12">
            <div className="max-w-2xl mx-auto space-y-6">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <div className="space-y-4 pt-6">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
      )
  }

  return (
    <div className="container mx-auto py-12">
       <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your college profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       <Card className="max-w-2xl mx-auto mb-8 border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Welcome, College Representative!</CardTitle>
              <CardDescription>
                {college ? "Update your college's public profile below." : "Create your college's public profile to be listed on the site."}
              </CardDescription>
            </div>
             {college && (
                <Button variant="destructive" size="sm" onClick={() => setIsDeleting(true)}>
                    <Trash2 className="mr-2"/> Delete Profile
                </Button>
            )}
          </div>
        </CardHeader>
      </Card>
      <CollegeForm
        mode={college ? 'edit' : 'create'}
        college={college}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
