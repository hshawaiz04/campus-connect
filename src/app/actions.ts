'use server';

import { colleges, type College } from '@/lib/colleges';
import { z } from 'zod';

const recommendationSchema = z.object({
  cgpa: z.coerce.number().min(0).max(10),
  entranceExamScore: z.coerce.number().min(0),
  aptitudeTestScore: z.coerce.number().min(0),
  regionPreference: z.string(),
  coursePreference: z.string(),
  additionalDetails: z.string().optional(),
});

type GenerateCollegeRecommendationsInput = z.infer<typeof recommendationSchema>;

// Calculate a weighted score to determine the user's "Elo"
const calculateEloScore = (input: GenerateCollegeRecommendationsInput) => {
  // Weights can be adjusted to prioritize certain scores
  const weights = {
    cgpa: 0.3,
    entranceExam: 0.4,
    aptitude: 0.3,
  };

  // Normalize scores to a common scale (e.g., 0-100)
  const normalizedCgpa = input.cgpa * 10; // Assuming CGPA is out of 10
  // Assuming entrance and aptitude scores are already out of 100-ish
  const normalizedEntrance = input.entranceExamScore;
  const normalizedAptitude = input.aptitudeTestScore;

  const score =
    normalizedCgpa * weights.cgpa +
    normalizedEntrance * weights.entranceExam +
    normalizedAptitude * weights.aptitude;

  return score;
};

// Determine the tier based on the Elo score
const getTierFromScore = (score: number): College['tier'] => {
  if (score >= 85) return 'top';
  if (score >= 60) return 'mid';
  return 'low';
};


// A simple local recommendation engine based on tiers
const getLocalRecommendations = (
  input: GenerateCollegeRecommendationsInput
) => {
  const { regionPreference, coursePreference } = input;

  const eloScore = calculateEloScore(input);
  const recommendedTier = getTierFromScore(eloScore);

  const filteredColleges = colleges
    .filter((college) => 
      college.region === regionPreference && 
      college.field === coursePreference &&
      college.tier === recommendedTier
    )
    .sort((a, b) => a.ranking - b.ranking); // Sort by ranking within the tier

  const recommended = filteredColleges.slice(0, 3); // Suggest top 3 from the recommended tier

  // If no colleges are found in the ideal tier, try the next one down
  if (recommended.length === 0 && recommendedTier !== 'low') {
    const fallbackTier = recommendedTier === 'top' ? 'mid' : 'low';
    const fallbackColleges = colleges
      .filter(c => c.region === regionPreference && c.field === coursePreference && c.tier === fallbackTier)
      .sort((a, b) => a.ranking - b.ranking)
      .slice(0, 3);
    
    return {
      recommendations: fallbackColleges.map((college) => ({
        collegeName: college.name,
        reason: `Based on your profile, we suggest considering colleges in the '${fallbackTier}' tier. ${college.name} is a great option in your preferred field and region.`,
      })),
    };
  }


  return {
    recommendations: recommended.map((college) => ({
      collegeName: college.name,
      reason: `With a strong profile, you are a good fit for top-tier institutions like this one in your preferred field (${college.field}) and region (${college.region}).`,
    })),
  };
};

export const getRecommendationsAction = async (
  input: GenerateCollegeRecommendationsInput
) => {
  const validatedInput = recommendationSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error('Invalid input');
  }

  const result = getLocalRecommendations(validatedInput.data);
  return result;
};
