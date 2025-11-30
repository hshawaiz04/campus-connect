
'use client';

import { useParams } from 'next/navigation';
import { colleges } from '@/lib/colleges';
import type { College } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, School, MapPin, Target, BookOpen, DollarSign, Milestone, Heart, Home, Award, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useEffect, useState } from 'react';

export default function CollegeDetailsPage() {
  const params = useParams();
  const collegeId = typeof params.id === 'string' ? params.id : '';
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [college, setCollege] = useState<College | undefined>(undefined);

  useEffect(() => {
    if (collegeId) {
      const foundCollege = colleges.find(c => c.id === collegeId);
      setCollege(foundCollege);
    }
    setIsLoading(false);
  }, [collegeId]);


  const favoriteRef = useMemoFirebase(
    () => (user ? doc(firestore, `users/${user.uid}/favorites`, collegeId) : null),
    [user, firestore, collegeId]
  );
  const { data: favorite } = useDoc(favoriteRef);
  const isFavorite = !!favorite;

  const handleFavoriteToggle = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Please log in",
        description: "You need to be logged in to save colleges.",
      });
      return;
    }
    if (!college || !favoriteRef) return;

    if (isFavorite) {
      deleteDocumentNonBlocking(favoriteRef);
      toast({
        title: "Removed from Favorites",
        description: `${college.name} has been removed from your list.`,
      });
    } else {
      const favoriteData = {
        collegeId: college.id,
        name: college.name,
        location: college.location,
        field: college.field,
      };
      setDocumentNonBlocking(favoriteRef, favoriteData, { merge: false });
      toast({
        title: "Added to Favorites!",
        description: `${college.name} has been added to your list.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <Skeleton className="h-10 w-32 mb-8" />
        <Card className="max-w-4xl mx-auto">
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
       <div className="flex justify-between items-center mb-8">
        <Button asChild variant="outline">
          <Link href="/colleges">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Colleges
          </Link>
        </Button>
        {user && (
           <Button variant="outline" onClick={handleFavoriteToggle}>
            <Heart className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            {isFavorite ? 'Saved' : 'Save'}
          </Button>
        )}
      </div>
      <Card className="max-w-4xl mx-auto overflow-hidden shadow-lg">
         <CardHeader className="p-6 md:p-8 bg-card border-b">
            <Badge className="text-sm mb-2 w-fit">{college.region}</Badge>
            <CardTitle className="text-3xl md:text-4xl font-headline font-bold tracking-tighter">
              {college.name}
            </CardTitle>
            <CardDescription className="text-lg">{college.location}</CardDescription>
        </CardHeader>
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
            <h2 className="text-xl font-semibold font_headline mb-3 flex items-center gap-2">
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

          <Accordion type="single" collapsible className="w-full">
            {college.housing && (
              <AccordionItem value="housing">
                <AccordionTrigger className="text-lg font-semibold"><Home className="mr-2"/>Housing</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-8">
                  {college.housing}
                </AccordionContent>
              </AccordionItem>
            )}
             {college.scholarships && (
              <AccordionItem value="scholarships">
                <AccordionTrigger className="text-lg font-semibold"><Award className="mr-2"/>Scholarships</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-8">
                  {college.scholarships}
                </AccordionContent>
              </AccordionItem>
            )}
             {college.notes && (
              <AccordionItem value="notes">
                <AccordionTrigger className="text-lg font-semibold"><Info className="mr-2"/>Notes</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-8">
                  {college.notes}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>

        </CardContent>
      </Card>
    </div>
  );
}
