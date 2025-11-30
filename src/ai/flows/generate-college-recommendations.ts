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

const GenerateCollegeRecommendationsOutputSchema = z.array(
  RecommendedCollegeSchema
);
export type GenerateCollegeRecommendationsOutput = z.infer<
  typeof GenerateCollegeRecommendationsOutputSchema
>;

export async function generateCollegeRecommendations(
  input: GenerateCollegeRecommendationsInput
): Promise<GenerateCollegeRecommendationsOutput> {
  return generateCollegeRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCollegeRecommendationsPrompt',
  input: {schema: GenerateCollegeRecommendationsInputSchema},
  output: {schema: GenerateCollegeRecommendationsOutputSchema},
  prompt: `You are an expert college advisor. Given a student's profile, academic records, aptitude test results, and preferences, you will generate a personalized list of recommended colleges to apply to.

Student Profile:
CGPA: {{{cgpa}}}
Entrance Exam Score: {{{entranceExamScore}}}
Aptitude Test Score: {{{aptitudeTestScore}}}
Region Preference: {{{regionPreference}}}
Additional Details: {{{additionalDetails}}}

Based on this information, recommend a list of colleges that the student should consider applying to. Explain why each college is a good fit for the student.

Format your output as a JSON array of college recommendations, including the college name and the reason for the recommendation.

{{#each this}}
  College Name: {{{collegeName}}}
  Reason: {{{reason}}}
{{/each}}`,
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
