// pages/api/generateImage.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

// This function handles the API request and response
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Generating Image');
  try {
    const { prompt, size, quality, model } = req.body;
    console.log(prompt,size,quality,model);
    const openAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY // Assuming you've configured your environment variable properly
    });

    const response = await openAI.images.generate({
      model,
      prompt,
      size,
      quality
    });

    const imageUrls = response.data.map((imageData: any) => imageData.url ?? '');

    res.status(200).json({ imageUrls });
  } catch (error) {
    console.error('Error generating images:', error);
    res.status(500).json({ error: 'Error generating images' });
  }
}
