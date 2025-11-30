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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { College } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

const collegeSchema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().min(1, "Description is required."),
  location: z.string().min(1, "Location is required."),
  ranking: z.coerce.number().int().positive(),
  fees: z.string().min(1, "Fees are required."),
  courses: z.string().min(1, "Enter at least one course, comma-separated."),
  eligibility: z.string().min(1, "Eligibility is required."),
  region: z.enum(['India', 'Abroad']),
  field: z.enum(['Engineering', 'MBA', 'Medical']),
  tier: z.enum(['top', 'mid', 'low']),
  housing: z.string().optional(),
  scholarships: z.string().optional(),
  notes: z.string().optional(),
});

type CollegeFormData = z.infer<typeof collegeSchema>;

interface CollegeFormProps {
  college?: College;
  onSubmit: (data: College) => void;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
}

export function CollegeForm({ college, onSubmit, isSubmitting, mode }: CollegeFormProps) {
  const router = useRouter();

  const defaultValues = useMemo(() => ({
    name: college?.name || '',
    description: college?.description || '',
    location: college?.location || '',
    ranking: college?.ranking || 0,
    fees: college?.fees || '',
    courses: college?.courses.join(', ') || '',
    eligibility: college?.eligibility || '',
    region: college?.region || 'India',
    field: college?.field || 'Engineering',
    tier: college?.tier || 'mid',
    housing: college?.housing || '',
    scholarships: college?.scholarships || '',
    notes: college?.notes || '',
  }), [college]);

  const form = useForm<CollegeFormData>({
    resolver: zodResolver(collegeSchema),
    defaultValues,
  });

  const handleSubmit = (data: CollegeFormData) => {
    const processedData: College = {
      ...data,
      id: college?.id || `clg-${data.region.slice(0,2).toLowerCase()}-${data.field.slice(0,3).toLowerCase()}-${data.tier}-${Math.random().toString(36).substring(2, 6)}`,
      imageUrl: college?.imageUrl || `https://picsum.photos/seed/${data.name.replace(/\s+/g, '')}/800/600`,
      courses: data.courses.split(',').map(c => c.trim()),
    };
    onSubmit(processedData);
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Add New College' : 'Edit College'}</CardTitle>
        <CardDescription>
          {mode === 'create' ? 'Fill out the form to add a new college to the database.' : `You are editing ${college?.name}.`}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College Name</FormLabel>
                  <FormControl><Input placeholder="e.g., IIT Bombay" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="A premier institution..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl><Input placeholder="Mumbai, India" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="ranking"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Ranking</FormLabel>
                    <FormControl><Input type="number" placeholder="1" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="fees"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Annual Fees</FormLabel>
                    <FormControl><Input placeholder="₹200000 or $50,000" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="eligibility"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Eligibility</FormLabel>
                    <FormControl><Input placeholder="JEE Advanced Rank" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="courses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Courses (comma-separated)</FormLabel>
                  <FormControl><Input placeholder="Computer Science, Mechanical Engineering" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="housing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Housing</FormLabel>
                  <FormControl><Textarea placeholder="Details about on-campus housing, fees, etc." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scholarships"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scholarships</FormLabel>
                  <FormControl><Textarea placeholder="Information about available scholarships..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl><Textarea placeholder="Any other relevant notes..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Region</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="India">India</SelectItem>
                                <SelectItem value="Abroad">Abroad</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="field"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Field</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Engineering">Engineering</SelectItem>
                                <SelectItem value="MBA">MBA</SelectItem>
                                <SelectItem value="Medical">Medical</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="tier"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tier</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="top">Top</SelectItem>
                                <SelectItem value="mid">Mid</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
          </CardContent>
          <CardFooter className="gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Create College' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
