'use client';

import { useUser, useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking, doc } from '@/firebase';
import type { College } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CollegeForm } from '@/components/college-form';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function CollegeDashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const collegeDocId = useMemo(() => user ? `user-managed-${user.uid}` : null, [user]);

  const collegeRef = useMemoFirebase(
    () => (collegeDocId ? doc(firestore, 'colleges', collegeDocId) : null),
    [firestore, collegeDocId]
  );
  const { data: college, isLoading: isCollegeLoading } = useDoc<College>(collegeRef);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    // A simple role check, real security is in Firestore rules
    const checkRole = async () => {
        if (user) {
            const userDoc = await doc(firestore, 'users', user.uid).get();
            if (userDoc.exists() && userDoc.data().role !== 'college') {
                 toast({
                    variant: 'destructive',
                    title: 'Access Denied',
                    description: 'You are not authorized to view this page.'
                });
                router.push('/');
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
  
  const isLoading = isUserLoading || isCollegeLoading;

  if (isLoading || !user) {
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
       <Card className="max-w-2xl mx-auto mb-8 border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle>Welcome, College Representative!</CardTitle>
          <CardDescription>
            Use the form below to create or update your college's public profile. Any changes you save will be visible to students browsing the site.
          </CardDescription>
        </CardHeader>
      </Card>
      <CollegeForm
        mode={college ? 'edit' : 'create'}
        college={college || { name: 'My College' } as College} // Pass a default for creation
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
