'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { College } from '@/lib/colleges';
import { Skeleton } from '@/components/ui/skeleton';

export default function CollegesPage() {
  const firestore = useFirestore();
  const collegesQuery = useMemoFirebase(
    () => collection(firestore, 'colleges'),
    [firestore]
  );
  const { data: colleges, isLoading } = useCollection<College>(collegesQuery);

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter">
          Explore Colleges
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
          Browse through our curated list of top institutions in India and around the world.
        </p>
      </div>

      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="flex flex-col overflow-hidden">
              <Skeleton className="h-56 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <div className="p-6 pt-0">
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {colleges?.map((college) => (
          <Card key={college.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="relative h-56 w-full">
              <Image
                src={college.imageUrl}
                alt={college.name}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-xl">{college.name}</CardTitle>
              <CardDescription>{college.location}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground text-sm line-clamp-3">
                {college.description}
              </p>
            </CardContent>
            <div className="p-6 pt-0">
              <Button className="w-full">View Details</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
