'use client';

import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import type { College } from '@/lib/types';
import { colleges as localColleges } from '@/lib/colleges';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [collegeToDelete, setCollegeToDelete] = useState<College | null>(null);

  const collegesQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'colleges') : null),
    [firestore]
  );
  const { data: firestoreColleges, isLoading: areCollegesLoading, error: collegesError } = useCollection<College>(collegesQuery);

  const allColleges = useMemo(() => {
    const combined = new Map<string, College>();
    
    // Add local colleges first
    localColleges.forEach(college => combined.set(college.id, college));

    // Add/overwrite with firestore colleges
    if (firestoreColleges) {
      firestoreColleges.forEach(college => combined.set(college.id, college));
    }
    
    return Array.from(combined.values()).sort((a,b) => a.ranking - b.ranking);
  }, [firestoreColleges]);


  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Wait until user and data loading is complete
    if (isUserLoading) {
      return;
    }

    // If there is no user, redirect to login
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'You must be logged in to view this page.'
      });
      router.push('/login');
      setIsAuthorized(false);
      return;
    }
    
    // If there is a permission error fetching colleges, the user is not an admin
    // We check this by seeing if the user is `admin@gmail.com`
    if (user.email !== 'admin@gmail.com') {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'You do not have permission to view this page.'
      });
      router.push('/');
      setIsAuthorized(false);
      return;
    }

    // If loading is finished, there's a user, and it's the admin, they are authorized
    if (!isUserLoading && user.email === 'admin@gmail.com') {
        setIsAuthorized(true);
    }

  }, [user, isUserLoading, router, toast]);

  const handleDeleteCollege = async () => {
    if (!collegeToDelete || !firestore) return;

    try {
      await deleteDoc(doc(firestore, 'colleges', collegeToDelete.id));
      toast({
        title: 'College Deleted',
        description: `${collegeToDelete.name} has been removed.`,
      });
    } catch (error) {
      const e = error as Error;
      toast({
        variant: 'destructive',
        title: 'Error Deleting College',
        description: e.message || 'An unknown error occurred.',
      });
    } finally {
      setCollegeToDelete(null);
    }
  };


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
  
  return (
    <div className="container mx-auto py-12">
      <AlertDialog open={!!collegeToDelete} onOpenChange={(open) => !open && setCollegeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the college
              &quot;{collegeToDelete?.name}&quot; and remove it from public view.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCollege}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>Manage all college listings.</CardDescription>
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
              {areCollegesLoading ? (
                 [...Array(10)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-1/2" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-1/2" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-5 ml-auto" /></TableCell>
                  </TableRow>
                 ))
              ) : allColleges && allColleges.length > 0 ? (
                allColleges.map((college) => (
                  <TableRow key={college.id}>
                    <TableCell className="font-medium">{college.name}</TableCell>
                    <TableCell>{college.location}</TableCell>
                    <TableCell>{college.field}</TableCell>
                    <TableCell><span className="capitalize">{college.tier}</span></TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/admin/colleges/${college.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setCollegeToDelete(college)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No colleges found. Start by adding one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
