'use client';

import { useState } from 'react';
import { getRecommendationsAction } from '@/app/actions';
import { RecommendationForm } from '@/components/recommendation-form';
import { RecommendationList } from '@/components/recommendation-list';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

type GenerateCollegeRecommendationsInput = {
    cgpa: number;
    entranceExamScore: number;
    aptitudeTestScore: number;
    regionPreference: string;
    coursePreference: string;
    additionalDetails?: string;
};

type RecommendedCollege = {
    collegeName: string;
    reason: string;
};

export default function Home() {
  const [recommendations, setRecommendations] = useState<RecommendedCollege[]>([]);
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const handleGetRecommendations = async (data: GenerateCollegeRecommendationsInput) => {
    setLoading(true);
    setRecommendations([]); // Clear previous recommendations
    try {
      // Wrap in a timeout to simulate a network call for a better UX
      setTimeout(async () => {
        const result = await getRecommendationsAction(data);
        if (result && result.recommendations.length > 0) {
          setRecommendations(result.recommendations);
          toast({
              title: "Recommendations Generated!",
              description: "We've found some colleges that might be a great fit for you.",
          });
        } else {
          toast({
              variant: "destructive",
              title: "No Recommendations Found",
              description: "We couldn't find any suitable colleges based on your profile. Try adjusting your criteria.",
          });
        }
        setLoading(false);
      }, 1000);

    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Something went wrong while generating recommendations. Please try again later.",
      });
      setLoading(false);
    }
  };

  return (
    <main>
       <section className="py-20 md:py-32 bg-card border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter text-foreground">
              Find Your <span className="text-primary">Future</span> Campus
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Our tool analyzes your academic profile and preferences to provide personalized college recommendations, guiding you to the perfect institution.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="#recommendation-tool">Get Started</a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/colleges">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="recommendation-tool" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">College Recommendation Tool</h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Fill in your details below, and let our recommendation engine find the best colleges for you.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <RecommendationForm onSubmit={handleGetRecommendations} isLoading={loading} />
            </div>
            <div className="lg:col-span-3">
              <RecommendationList recommendations={recommendations} isLoading={loading} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
