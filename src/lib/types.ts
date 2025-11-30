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
  };
  
  export type UserProfile = {
    id?: string;
    firstName?: string;
    lastName?: string;
    cgpa?: number;
    board?: string;
    entranceExamScores?: number;
    regionPreference?: string;
    aptitudeTestScore?: number;
  }

  export type FavoriteCollege = {
    id: string;
    collegeId: string;
    name: string;
    location: string;
    field: string;
  }
  