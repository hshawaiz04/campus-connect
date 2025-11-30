
'use client';

import { useParams } from 'next/navigation';
import type { College } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, School, MapPin, Target, BookOpen, DollarSign, Milestone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CollegeDetailsPage() {
  const params = useParams();
  const collegeId = typeof params.id === 'string' ? params.id : '';
  const [college, setCollege] = useState<College | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!collegeId) return;

    const fetchCollege = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/colleges.json');
        const allColleges: College[] = (await response.json()).colleges;
        const foundCollege = allColleges.find(c => c.id === collegeId);
        setCollege(foundCollege || null);
      } catch (error) {
        console.error("Failed to fetch college data:", error);
        setCollege(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollege();
  }, [collegeId]);


  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <Skeleton className="h-10 w-32 mb-8" />
        <Card className="max-w-4xl mx-auto">
          <Skeleton className="h-80 w-full rounded-t-lg" />
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">College not found</h1>
        <p className="text-muted-foreground">The college you are looking for does not exist.</p>
        <Button asChild className="mt-4">
          <Link href="/colleges">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Colleges
          </Link>
        </Button>
      </div>
    );
  }

  const detailItems = [
    { icon: MapPin, label: 'Location', value: college.location },
    { icon: School, label: 'Ranking', value: `#${college.ranking}` },
    { icon: DollarSign, label: 'Annual Fees', value: college.fees },
    { icon: Target, label: 'Eligibility', value: college.eligibility },
  ];

  return (
    <div className="container mx-auto py-12">
       <Button asChild variant="outline" className="mb-8">
        <Link href="/colleges">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Colleges
        </Link>
      </Button>
      <Card className="max-w-4xl mx-auto overflow-hidden shadow-2xl">
        <div className="relative h-64 md:h-80 w-full">
          <Image
            src={college.imageUrl}
            alt={college.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <Badge className="text-sm mb-2">{college.region}</Badge>
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-white tracking-tighter">
              {college.name}
            </h1>
          </div>
        </div>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold font-headline mb-2">Description</h2>
            <p className="text-muted-foreground">{college.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {detailItems.map(item => (
                <div key={item.label} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <item.icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-muted-foreground">{item.label}</h3>
                        <p className="text-lg font-medium">{item.value}</p>
                    </div>
                </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold font-headline mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Courses Offered
            </h2>
            <div className="flex flex-wrap gap-2">
              {college.courses.map((course) => (
                <Badge key={course} variant="secondary" className="text-sm">{course}</Badge>
              ))}
            </div>
          </div>

           <div>
            <h2 className="text-xl font-semibold font-headline mb-3 flex items-center gap-2">
                <Milestone className="h-5 w-5 text-primary" />
                Category
            </h2>
            <div className="flex items-center gap-4">
                <Badge className="capitalize text-sm">{college.tier} Tier</Badge>
                <Badge variant="outline" className="capitalize text-sm">{college.field}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
