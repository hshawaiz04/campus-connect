'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { College } from '@/lib/colleges';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export default function CollegesPage() {
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [fieldFilter, setFieldFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');

  useEffect(() => {
    const fetchColleges = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/colleges.json');
        const data: College[] = await response.json();
        setAllColleges(data.sort((a, b) => a.ranking - b.ranking));
      } catch (error) {
        console.error("Failed to fetch college data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const filteredColleges = useMemo(() => {
    return allColleges
      .filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(college =>
        fieldFilter === 'All' ? true : college.field === fieldFilter
      )
      .filter(college =>
        regionFilter === 'All' ? true : college.region === regionFilter
      );
  }, [allColleges, searchTerm, fieldFilter, regionFilter]);


  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter">
          Explore Colleges
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
          Browse, filter, and search through our curated list of top institutions.
        </p>
      </div>

      <Card className="mb-8 shadow-md">
        <CardContent className="p-4 sm:p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by college name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={fieldFilter} onValueChange={setFieldFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Fields</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="MBA">MBA</SelectItem>
                <SelectItem value="Medical">Medical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Regions</SelectItem>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="Abroad">Abroad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

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

      {!isLoading && filteredColleges && filteredColleges.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No Colleges Found</h2>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria.</p>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredColleges?.map((college) => (
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
              <Button className="w-full" asChild>
                <Link href={`/colleges/${college.id}`}>View Details</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
