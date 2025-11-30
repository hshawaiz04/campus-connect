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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';


const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  role: z.enum(['student', 'college'], {
    required_error: "You need to select a login type.",
  }),
});

export function LoginForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'student',
    },
  });

  // Effect to redirect user if they are already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
        // This is a simple redirect, role-based redirect happens on login
        router.push('/'); 
    }
  }, [user, isUserLoading, router]);


  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    if (!auth || !firestore) return;
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const loggedInUser = userCredential.user;

      if (!loggedInUser) {
        throw new Error("Login failed, user not found.");
      }

      // Special case for admin
      if (loggedInUser.email === 'admin@gmail.com') {
        toast({ title: 'Admin Login Successful', description: 'Redirecting to dashboard...' });
        router.push('/admin/dashboard');
        return;
      }

      // Check the user's role from Firestore
      const userDocRef = doc(firestore, 'users', loggedInUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        // Redirect based on the role stored in the database
        if (userRole === 'student' && values.role === 'student') {
          toast({ title: 'Login Successful', description: 'Welcome back!' });
          router.push('/profile');
        } else if (userRole === 'college' && values.role === 'college') {
          toast({ title: 'Login Successful', description: 'Redirecting to your college dashboard.' });
           router.push('/college-dashboard');
        } else {
          // Role mismatch between form and database
          throw new Error(`You are registered as a ${userRole}. Please log in as a ${userRole}.`);
        }
      } else {
         // This case handles users who signed up before the role system was in place.
         // Default them to 'student' role.
         if(values.role === 'student') {
            toast({ title: 'Login Successful', description: 'Welcome back!' });
            router.push('/profile');
         } else {
            throw new Error("This account is not registered as a College Representative.");
         }
      }

    } catch (error) {
      const e = error as Error;
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: e.message || 'An unknown error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md shadow-lg">
       <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Please select your role and enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>I am a...</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      <FormItem>
                         <FormControl>
                            <RadioGroupItem value="student" id="student" className="peer sr-only" />
                         </FormControl>
                         <Label htmlFor="student" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            Student
                         </Label>
                      </FormItem>
                       <FormItem>
                         <FormControl>
                            <RadioGroupItem value="college" id="college" className="peer sr-only" />
                         </FormControl>
                         <Label htmlFor="college" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            College Representative
                         </Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
           <CardFooter className="flex-col items-stretch gap-4">
             <Button type="submit" disabled={isSubmitting || isUserLoading}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up as a Student
              </Link>
               {' or '}
               <Link href="/college-signup" className="font-medium text-primary hover:underline">
                as a College
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
