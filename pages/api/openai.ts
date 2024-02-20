// pages/api/openai.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Instantiate OpenAI client here, securely on the server side
  const openAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  // ... your logic to interact with OpenAI API
}
