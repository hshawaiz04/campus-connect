'use server';

import {
  generateCollegeRecommendations,
  type GenerateCollegeRecommendationsInput,
} from '@/ai/flows/generate-college-recommendations';
import { experimental_streamObject } from 'ai';
import { z } from 'zod';

const recommendationSchema = z.object({
  cgpa: z.coerce.number().min(0).max(10),
  entranceExamScore: z.coerce.number().min(0),
  aptitudeTestScore: z.coerce.number().min(0),
  regionPreference: z.string(),
  additionalDetails: z.string().optional(),
});

const RecommendedCollegeSchema = z.object({
  collegeName: z.string(),
  reason: z.string(),
});

export const getRecommendationsAction = async (
  input: GenerateCollegeRecommendationsInput
) => {
  const validatedInput = recommendationSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error('Invalid input');
  }

  return experimental_streamObject<z.infer<typeof RecommendedCollegeSchema>>({
    cb: async (stream) => {
      await generateCollegeRecommendations(validatedInput.data, (recommendation) => {
        stream.update(recommendation);
      });
      stream.done();
    },
    schema: RecommendedCollegeSchema
  })
}
