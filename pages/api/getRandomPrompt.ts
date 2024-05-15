// pages/api/getRandomPrompt.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Getting Random Prompt!');
  if (process.env.OPENAI_API_KEY) {
    try {


      const openAI = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openAI.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        max_tokens: 12,
        temperature: 0.7, // Increase temperature for more randomness
        messages: [
          {
            role: "system",
            content: "Generate a single, 12 token or less, and imaginative sci-fi prompt. Keep the prompt concise and ensure no text or quotes appear in the image."
          },
          {
            role: "user",
            content: "Create a random short sci-fi prompt.",
          },
        ],
      });

      res.status(200).json({ prompt: response.choices[0].message.content });
    } catch (error) {
      console.error('Error generating random prompt:', error);
      res.status(500).json({ error: 'Error generating random prompt' });
    }
  } else {
    res.status(500).json({ error: 'OPENAI_API_KEY is not set.' });
  }
}
