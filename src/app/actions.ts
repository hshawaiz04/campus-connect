'use server';

import { colleges, type College } from '@/lib/colleges';
import { z } from 'zod';

const recommendationSchema = z.object({
  cgpa: z.coerce.number().min(0).max(10),
  entranceExamScore: z.coerce.number().min(0),
  aptitudeTestScore: z.coerce.number().min(0),
  regionPreference: z.string(),
  additionalDetails: z.string().optional(),
});

type GenerateCollegeRecommendationsInput = z.infer<typeof recommendationSchema>;

// A simple local recommendation engine
const getLocalRecommendations = (
  input: GenerateCollegeRecommendationsInput
) => {
  const { regionPreference, cgpa } = input;

  const filteredColleges = colleges
    .filter((college) => college.region === regionPreference)
    .sort((a, b) => a.ranking - b.ranking); // Sort by ranking

  // Simple logic: suggest top 3 ranked colleges in the preferred region.
  // A more complex engine could match CGPA, scores, etc.
  const recommended = filteredColleges.slice(0, 3);

  return {
    recommendations: recommended.map((college) => ({
      collegeName: college.name,
      reason: `A top-ranked institution in your preferred region (${college.region}) with a focus on programs like ${college.courses[0]}.`,
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
