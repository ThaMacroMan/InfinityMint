// pages/api/getRandomPrompt.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Getting Random Prompt!')
    if (process.env.OPENAI_API_KEY) {
    try {
      const openAI = new OpenAI({
        apiKey:process.env.OPENAI_API_KEY
        //
      });

      const response = await openAI.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        max_tokens: 70,
        temperature: 0.5,
        messages: [
          {"role": "system", "content": "You make random Dalle prompts that create incredible outputs and utilize dalle to its limits"},
          {"role": "system", "content": "Only include the prompt itself in the output. Ensure no text or quotes in the image. Max 70 tokens"},
          {"role": "system", "content": "Example prompt: a surreal cyberpunk cityscape with neon lights, flying cars, and towering skyscrapers reflecting a digital sunset"},
          {"role": "user", "content": "Make me a dalle prompt that is random and futuristic."}
        ]
      });

      res.status(200).json({ prompt: response.choices[0].message.content });
    } catch (error) {
      res.status(500).json({ error: 'Error generating random prompt' });
    }
  } else {
    res.status(500).json({ error: 'OPENAI_API_KEY is not set.' });
  }
}
