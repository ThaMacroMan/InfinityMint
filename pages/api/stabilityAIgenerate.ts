// pages/api/generateImage.ts

import type { NextApiRequest, NextApiResponse } from 'next';

// Modify this import to match the Stability AI SDK or use node-fetch if you're making a direct HTTP request
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { text_prompts, cfg_scale, height, width, steps, samples } = req.body;

    const response = await fetch(`https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
      },
      body: JSON.stringify({
        text_prompts,
        cfg_scale,
        height,
        width,
        steps,
        samples,
      }),
    });

    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`);
    }

    const responseJSON: any = await response.json();

    // Handle the response format according to the Stability AI's response
    const imageUrls = responseJSON.artifacts.map((image: any) => image.base64 ?? '');

    res.status(200).json({ images: imageUrls });
  } catch (error) {
    console.error('Error generating images:', error);
    res.status(500).json({ error: 'Error generating images' });
  }
}
