
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

// This page should only be available in development
if (process.env.NODE_ENV !== 'development') {
  if (typeof window !== 'undefined') {
    window.location.href = '/404';
  }
}

export default function MakeAdminPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMakeAdmin = async () => {
    if (!firestore || !user) {
        toast({
            variant: 'destructive',
            title: 'Not Logged In',
            description: 'You must be logged in to grant admin privileges.',
        });
        return;
    }

    setIsProcessing(true);
    try {
        const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
        // The data doesn't matter, only the document's existence does.
        await setDocumentNonBlocking(adminRoleRef, { isAdmin: true }, { merge: false });

        toast({
            title: 'Success!',
            description: `You now have administrator privileges. Redirecting to dashboard...`,
        });

        setTimeout(() => {
            router.push('/admin/dashboard');
        }, 1500);

    } catch (error) {
      console.error('Error granting admin role:', error);
      const e = error as Error;
      toast({
        variant: 'destructive',
        title: 'Error Granting Role',
        description: e.message || 'An unknown error occurred.',
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Grant Administrator Privileges</CardTitle>
          <CardDescription>
            This is a development-only page. Click the button below to grant your current user
            ({user ? user.email : '...'}) administrator rights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-8 text-center">
             <ShieldCheck className="h-12 w-12 text-primary" />
            <p className="text-muted-foreground">
              This will create a role document in the `roles_admin` collection for your user ID.
            </p>
            <Button onClick={handleMakeAdmin} disabled={isProcessing || isUserLoading}>
              {isProcessing || isUserLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Make Me Admin'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
