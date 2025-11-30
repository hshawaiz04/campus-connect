'use client';

import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
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

  const handleSubmit = async (data: College) => {
    setIsSubmitting(true);
    // We need to use the returned promise to set the document ID
    const docRefPromise = addDocumentNonBlocking(collegesRef, { ...data, id: '' });
    
    docRefPromise.then(docRef => {
        if(docRef) {
          // Firebase generates the ID, so we set it here before non-blocking update.
          const finalData = {...data, id: docRef.id };
          // This is a bit of a hack to update the doc with its own ID.
          // In a real app, you might not store the ID in the doc itself.
           addDocumentNonBlocking(doc(firestore, 'colleges', docRef.id), finalData);
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
