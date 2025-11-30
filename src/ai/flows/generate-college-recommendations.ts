'use server';

/**
 * @fileOverview A college recommendation AI agent.
 *
 * - generateCollegeRecommendations - A function that generates a list of recommended colleges.
 * - GenerateCollegeRecommendationsInput - The input type for the generateCollegeRecommendations function.
 * - GenerateCollegeRecommendationsOutput - The return type for the generateCollegeRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCollegeRecommendationsInputSchema = z.object({
  cgpa: z.number().describe('The student\u2019s CGPA.'),
  entranceExamScore: z.number().describe('The student\u2019s entrance exam score.'),
  aptitudeTestScore: z.number().describe('The student\u2019s aptitude test score.'),
  regionPreference: z.string().describe('The student\u2019s preferred region.'),
  additionalDetails: z
    .string()
    .optional()
    .describe('Any additional details about the student.'),
});
export type GenerateCollegeRecommendationsInput = z.infer<
  typeof GenerateCollegeRecommendationsInputSchema
>;

const RecommendedCollegeSchema = z.object({
  collegeName: z.string().describe('The name of the recommended college.'),
  reason: z.string().describe('The reason for recommending this college.'),
});

const GenerateCollegeRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendedCollegeSchema),
});

export type GenerateCollegeRecommendationsOutput = z.infer<
  typeof GenerateCollegeRecommendationsOutputSchema
>;

export async function generateCollegeRecommendations(
  input: GenerateCollegeRecommendationsInput
): Promise<GenerateCollegeRecommendationsOutput> {
  const result = await generateCollegeRecommendationsFlow(input);
  return result;
}

const prompt = ai.definePrompt({
  name: 'generateCollegeRecommendationsPrompt',
  input: {schema: GenerateCollegeRecommendationsInputSchema},
  output: {schema: GenerateCollegeRecommendationsOutputSchema},
  prompt: `You are an expert college advisor with access to a vast database of information about colleges and universities around the world. Your task is to provide personalized college recommendations based on a student's profile.

Analyze the provided student profile and leverage your knowledge of real-world colleges to suggest three suitable institutions. Consider factors like admission difficulty relative to the student's scores, program strengths, location, and any other relevant details from the student's input.

Student Profile:
CGPA: {{{cgpa}}}
Entrance Exam Score: {{{entranceExamScore}}}
Aptitude Test Score: {{{aptitudeTestScore}}}
Region Preference: {{{regionPreference}}}
Additional Details: {{{additionalDetails}}}

Based on this information, recommend a list of three colleges. For each college, provide a clear and concise reason explaining why it is a good match for the student. Your response must be in the specified JSON format.`,
});

const generateCollegeRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateCollegeRecommendationsFlow',
    inputSchema: GenerateCollegeRecommendationsInputSchema,
    outputSchema: GenerateCollegeRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
