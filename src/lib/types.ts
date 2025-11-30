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
    region: 'India' | 'Abroad';
    field: 'Engineering' | 'MBA' | 'Medical';
    tier: 'top' | 'mid' | 'low';
  };
  
  export type UserProfile = {
    id?: string;
    firstName?: string;
    lastName?: string;
    cgpa?: number;
    board?: string;
    entranceExamScores?: number;
    regionPreference?: string;
  }
  