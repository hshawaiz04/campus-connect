'use client';

import AptitudeTest from '@/components/aptitude-test';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AptitudeTestPage() {
  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Aptitude Test</CardTitle>
          <CardDescription className="text-lg">
            Test your skills and get a better college recommendation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AptitudeTest />
        </CardContent>
      </Card>
    </div>
  );
}
