'use server';

import {start} from 'genkit/dev-server';
import {ai} from './genkit';

start(ai, {
  port: 4001,
});
