'use client';

import { useUser, useCollection, useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, doc } from 'firebase/firestore';
import type { College } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Trash2, Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [collegeToDelete, setCollegeToDelete] = useState<College | null>(null);

  // Attempt to query the 'colleges' collection.
  // Security rules will only allow this for an admin user.
  const collegesQuery = useMemoFirebase(
    () => (user ? collection(firestore, 'colleges') : null),
    [firestore, user]
  );
  const { data: colleges, isLoading: areCollegesLoading, error: collegesError } = useCollection<College>(collegesQuery);

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const isLoading = isUserLoading || areCollegesLoading;

  useEffect(() => {
    if (isLoading) {
      return; // Wait until loading is complete
    }

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'You must be logged in to view this page.'
      });
      router.push('/login');
      return;
    }
    
    // After loading, if there's a permission error, the user is not an admin.
    if (collegesError) {
      setIsAdmin(false);
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'You must be an administrator to view this page.'
      });
      router.push('/');
    } else {
      // If there's no error, loading is done, and we have a user, they are an admin.
      setIsAdmin(true);
    }
  }, [user, isLoading, collegesError, router, toast]);
  
  const handleDelete = () => {
    if (!collegeToDelete || !firestore) return;
    const docRef = doc(firestore, 'colleges', collegeToDelete.id);
    deleteDocumentNonBlocking(docRef);
    toast({
        title: "College Deleted",
        description: `${collegeToDelete.name} has been removed.`,
    });
    setCollegeToDelete(null);
  };

  if (isLoading || isAdmin === null) {
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

  return (
    <div className="container mx-auto py-12">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>Manage college listings.</CardDescription>
            </div>
            <Button onClick={() => router.push('/admin/colleges/new')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add College
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
              {colleges?.map((college) => (
                <TableRow key={college.id}>
                  <TableCell className="font-medium">{college.name}</TableCell>
                  <TableCell>{college.location}</TableCell>
                  <TableCell>{college.field}</TableCell>
                  <TableCell className="capitalize">{college.tier}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/colleges/${college.id}/edit`)}>
                           <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onClick={() => setCollegeToDelete(college)}>
                           <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AlertDialog open={!!collegeToDelete} onOpenChange={(open) => !open && setCollegeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the college
              <span className="font-bold"> {collegeToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
