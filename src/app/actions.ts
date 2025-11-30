'use server';

import {
  generateCollegeRecommendations,
  type GenerateCollegeRecommendationsInput,
} from '@/ai/flows/generate-college-recommendations';
import { z } from 'zod';

const recommendationSchema = z.object({
  cgpa: z.coerce.number().min(0).max(10),
  entranceExamScore: z.coerce.number().min(0),
  aptitudeTestScore: z.coerce.number().min(0),
  regionPreference: z.string(),
  additionalDetails: z.string().optional(),
});

export const getRecommendationsAction = async (
  input: GenerateCollegeRecommendationsInput
) => {
  const validatedInput = recommendationSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error('Invalid input');
  }

  const result = await generateCollegeRecommendations(validatedInput.data);
  return result;
};
