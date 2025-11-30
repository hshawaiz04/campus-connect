'use server';

import {genkit, type Plugin} from 'genkit';
import {googleAI, type GoogleAIVertexPredictOptions} from '@genkit-ai/google-genai';

const googleAIPlugin = googleAI();

export const ai = genkit({
  plugins: [googleAIPlugin],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
