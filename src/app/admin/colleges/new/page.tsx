'use client';

import { useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import type { College } from '@/lib/types';
import { CollegeForm } from '@/components/college-form';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function NewCollegePage() {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const collegesRef = collection(firestore, 'colleges');

  const handleSubmit = (data: College) => {
    setIsSubmitting(true);
    
    const docRefPromise = addDocumentNonBlocking(collegesRef, data);
    
    docRefPromise.then(docRef => {
        if(docRef) {
          // Update the new document with its own ID.
          const collegeDocRef = doc(firestore, 'colleges', docRef.id);
          setDocumentNonBlocking(collegeDocRef, { id: docRef.id }, { merge: true });
        }
    });

    toast({
      title: 'College Created',
      description: `${data.name} has been successfully added.`,
    });

    setTimeout(() => {
        setIsSubmitting(false);
        router.push('/admin/dashboard');
    }, 1000);
  };

  return (
    <div className="container mx-auto py-12">
      <CollegeForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
