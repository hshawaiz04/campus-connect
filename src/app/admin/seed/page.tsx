'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { colleges, type College } from '@/lib/colleges';
import { writeBatch, doc } from 'firebase/firestore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// This page should only be available in development
if (process.env.NODE_ENV !== 'development') {
  // You can return a 404 page or a simple null
  // For Next.js App router, you can use the `notFound()` function
  if (typeof window !== 'undefined') {
    window.location.href = '/404';
  }
}

export default function SeedPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedDatabase = async () => {
    if (!firestore) return;

    setIsSeeding(true);
    try {
      const batch = writeBatch(firestore);
      
      colleges.forEach((college) => {
        // Use the original college id as the document ID
        const docRef = doc(firestore, 'colleges', college.id);
        batch.set(docRef, college);
      });

      await batch.commit();

      toast({
        title: 'Database Seeded!',
        description: `${colleges.length} colleges have been added to Firestore.`,
      });
    } catch (error) {
      console.error('Error seeding database:', error);
      const e = error as Error;
      toast({
        variant: 'destructive',
        title: 'Error Seeding Database',
        description: e.message || 'An unknown error occurred.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Seed Firestore Database</CardTitle>
          <CardDescription>
            Click the button below to populate your Firestore 'colleges' collection with the data from{' '}
            <code>src/lib/colleges.json</code>. This is useful for initial setup or for resetting your data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-8 text-center">
            <p className="text-muted-foreground">This will overwrite any existing colleges with the same ID.</p>
            <Button onClick={handleSeedDatabase} disabled={isSeeding}>
              {isSeeding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                'Seed Colleges'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
