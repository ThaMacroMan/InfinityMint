// pages/api/summarizePrompt.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const summarizePrompt = async (prompt: string): Promise<string> => {
  console.log('Summarizing Prompt!')
  try {
    const openAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || ''
    });

    const response = await openAI.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 150,
      temperature: 0.5,
      messages: [
        { "role": "system", "content": "Summarize the given prompt into a short epic name." },
        { "role": "system", "content": "Only include the name itself in the output. Ensure no text or quotes in the image. Max 50 tokens" },
        { "role": "system", "content": "Example Name: Crystal World: Orbiting Alien Planet" },
        { "role": "user", "content": prompt }
      ]
    });

    const summary = response.choices[0]?.message.content || '';
    return summary;
  } catch (error) {
    console.error('Error generating summarized prompt:', error);
    throw new Error('Error generating summarized prompt');
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  try {
    const summary = await summarizePrompt(prompt);
    res.status(200).json({ summary });
} catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
