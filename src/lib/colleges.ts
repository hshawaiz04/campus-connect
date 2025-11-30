import data from './colleges.json';

export type College = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  ranking: number;
  fees: string;
  courses: string[];
  eligibility: string;
  region: 'India' | 'Abroad';
  field: 'Engineering' | 'MBA' | 'Medical';
  tier: 'top' | 'mid' | 'low';
  housing?: string;
  scholarships?: string;
  notes?: string;
};

export const colleges: College[] = data as College[];
