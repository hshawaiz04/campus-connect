'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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

const recommendationSchema = z.object({
  cgpa: z.coerce.number({invalid_type_error: 'Please enter a number.'}).min(0, "CGPA must be positive.").max(10, "CGPA cannot exceed 10."),
  entranceExamScore: z.coerce.number({invalid_type_error: 'Please enter a number.'}).min(0, "Score must be positive."),
  aptitudeTestScore: z.coerce.number({invalid_type_error: 'Please enter a number.'}).min(0, "Score must be positive."),
  regionPreference: z.string().min(1, "Please select a region."),
  coursePreference: z.string().min(1, "Please select a field of study."),
  additionalDetails: z.string().optional(),
});

type GenerateCollegeRecommendationsInput = z.infer<typeof recommendationSchema>;


type RecommendationFormProps = {
  onSubmit: (data: GenerateCollegeRecommendationsInput) => void;
  isLoading: boolean;
};

export function RecommendationForm({ onSubmit, isLoading }: RecommendationFormProps) {
  const form = useForm<z.infer<typeof recommendationSchema>>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      cgpa: 7.5,
      entranceExamScore: 90,
      aptitudeTestScore: 85,
      regionPreference: 'India',
      coursePreference: 'Engineering',
      additionalDetails: '',
    },
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Your Profile</CardTitle>
        <CardDescription>Enter your academic details to get personalized recommendations.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                name="entranceExamScore"
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
            </div>
             <FormField
                control={form.control}
                name="aptitudeTestScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aptitude Test Score</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 88" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="coursePreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your preferred field" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="MBA">MBA</SelectItem>
                        <SelectItem value="Medical">Medical Sciences</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <FormField
              control={form.control}
              name="additionalDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us more about your interests, achievements, or any specific college preferences."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This helps us tailor recommendations even better.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Get Recommendations'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
