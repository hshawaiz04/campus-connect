'use client';

import { useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import type { College } from '@/lib/types';
import { CollegeForm } from '@/components/college-form';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditCollegePage() {
  const params = useParams();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const collegeId = typeof params.id === 'string' ? params.id : '';

  const collegeRef = useMemoFirebase(
    () => (collegeId ? doc(firestore, 'colleges', collegeId) : null),
    [firestore, collegeId]
  );
  const { data: college, isLoading } = useDoc<College>(collegeRef);

  const handleSubmit = (data: College) => {
    if (!collegeRef) return;
    setIsSubmitting(true);
    setDocumentNonBlocking(collegeRef, data, { merge: true });

    toast({
      title: 'College Updated',
      description: `${data.name} has been successfully updated.`,
    });

    setTimeout(() => {
        setIsSubmitting(false);
        router.push('/admin/dashboard');
    }, 1000);
  };
  
  if (isLoading) {
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

  if (!college) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">College Not Found</h1>
        <p>The college you are trying to edit does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <CollegeForm
        mode="edit"
        college={college}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
