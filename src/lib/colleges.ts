import data from './colleges.json';

export type College = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  ranking: number;
  fees: number;
  courses: string[];
  eligibility: string;
};

export const colleges: College[] = data.colleges;
