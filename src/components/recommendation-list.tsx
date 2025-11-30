'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Building2, FileText } from 'lucide-react';

type RecommendedCollege = {
    collegeName: string;
    reason: string;
};

type RecommendationListProps = {
  recommendations: RecommendedCollege[] | null;
  isLoading: boolean;
};

export function RecommendationList({ recommendations, isLoading }: RecommendationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-headline font-semibold">Generating Your Recommendations...</h2>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="shadow-md">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full rounded-md mb-2" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full min-h-[400px]">
        <div className="p-4 bg-primary/10 rounded-full mb-4">
          <FileText className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-headline font-semibold">Your Recommendations Await</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Once you fill out your profile, our AI will generate a personalized list of colleges and display them right here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-headline font-bold">Recommended Colleges</h2>
      {recommendations.map((rec, index) => (
        <Card key={index} className="shadow-md hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="font-headline text-xl">{rec.collegeName}</CardTitle>
              <CardDescription>Based on your profile</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold">Reason for Recommendation</h4>
                <p className="text-sm text-muted-foreground">{rec.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
