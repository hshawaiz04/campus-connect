'use client';

import { useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import type { College } from '@/lib/types';
import { CollegeForm } from '@/components/college-form';
import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { colleges as localColleges } from '@/lib/colleges';

export default function EditCollegePage() {
  const params = useParams();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const collegeId = typeof params.id === 'string' ? params.id : '';

  const localCollege = useMemo(() => localColleges.find(c => c.id === collegeId), [collegeId]);

  const collegeRef = useMemoFirebase(
    () => (collegeId ? doc(firestore, 'colleges', collegeId) : null),
    [firestore, collegeId]
  );
  const { data: firestoreCollege, isLoading: isFirestoreLoading } = useDoc<College>(collegeRef);

  const college = firestoreCollege || localCollege;
  const isLoading = !college && isFirestoreLoading;

  const handleSubmit = (data: College) => {
    if (!collegeId) return;

    const finalData: College = {
      ...data,
      id: collegeId, // Ensure the ID is maintained
    };

    const docRef = doc(firestore, 'colleges', collegeId);
    
    setIsSubmitting(true);
    setDocumentNonBlocking(docRef, finalData, { merge: true });

    toast({
      title: 'College Updated',
      description: `${finalData.name} has been successfully updated.`,
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
