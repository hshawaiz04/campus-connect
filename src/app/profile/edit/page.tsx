'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useUser, useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  cgpa: z.coerce.number().min(0).max(10),
  board: z.string().optional(),
  entranceExamScores: z.coerce.number().min(0),
  regionPreference: z.string().min(1, "Please select a region."),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profileRef = useMemoFirebase(
    () => (user ? doc(firestore, `users/${user.uid}/profiles`, user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(profileRef);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      cgpa: 0,
      board: '',
      entranceExamScores: 0,
      regionPreference: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
    if (userProfile) {
      form.reset({
        firstName: userProfile.firstName || user?.displayName?.split(' ')[0] || '',
        lastName: userProfile.lastName || user?.displayName?.split(' ')[1] || '',
        cgpa: userProfile.cgpa || 0,
        board: userProfile.board || '',
        entranceExamScores: userProfile.entranceExamScores || 0,
        regionPreference: userProfile.regionPreference || '',
      });
    }
  }, [user, isUserLoading, userProfile, form, router]);

  const onSubmit = (data: ProfileFormData) => {
    if (!profileRef) return;
    setIsSubmitting(true);
    setDocumentNonBlocking(profileRef, data, { merge: true });
    
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved.',
    });
    
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/profile');
    }, 1000);
  };
  
  const isLoading = isUserLoading || isProfileLoading;

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your personal and academic information.</CardDescription>
        </CardHeader>
        {isLoading ? (
          <CardContent className="space-y-4">
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
          </CardContent>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <FormField
                  control={form.control}
                  name="cgpa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CGPA (out of 10)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 8.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="entranceExamScores"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entrance Exam Score</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 95" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="board"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education Board</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CBSE, ISC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                  control={form.control}
                  name="regionPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region Preference</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your preferred region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="Abroad">Abroad</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
}
