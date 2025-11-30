'use client';

import { useState } from 'react';
import type { GenerateCollegeRecommendationsInput, GenerateCollegeRecommendationsOutput } from '@/ai/flows/generate-college-recommendations';
import { getRecommendationsAction } from '@/app/actions';
import { RecommendationForm } from '@/components/recommendation-form';
import { RecommendationList } from '@/components/recommendation-list';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<GenerateCollegeRecommendationsOutput | null>(null);
  const { toast } = useToast();
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-campus');

  const handleGetRecommendations = async (data: GenerateCollegeRecommendationsInput) => {
    setLoading(true);
    setRecommendations(null);
    try {
      const result = await getRecommendationsAction(data);
      if (result && result.length > 0) {
        setRecommendations(result);
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
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Something went wrong while generating recommendations. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="relative py-20 md:py-32 bg-card border-b">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter">
              Find Your <span className="text-primary">Future</span> Campus
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
              Our AI-powered tool analyzes your academic profile and preferences to provide personalized college recommendations, guiding you to the perfect institution.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Button size="lg" asChild>
                <a href="#recommendation-tool">Get Started</a>
              </Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </div>
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-2xl">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                data-ai-hint={heroImage.imageHint}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
          </div>
        </div>
      </section>

      <section id="recommendation-tool" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">College Recommendation Tool</h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Fill in your details below, and let our AI find the best colleges for you.
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
