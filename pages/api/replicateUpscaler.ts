import type { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Upscaling Image');
  try {
    const { imageUrl, prompt } = req.body;
    console.log('Original Image URL:', imageUrl);

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN
    });

    const input = {
      image: imageUrl,
      scale: 4,
      face_enhance: true,
    };

    const response = await replicate.run(
      "nightmareai/real-esrgan:f0992969a94014d73864d08e6d9a39286868328e4263d9ce2da6fc4049d01a1a",
      { input }
    );

    console.log('Replicate Response:', response);

    // Check if the response contains the expected URL
    const upscaleImageUrl = Array.isArray(response) ? response[0] : response;

    if (!upscaleImageUrl) {
      throw new Error('No upscaled image generated');
    }

    res.status(200).json({ upscaleImageUrl });
  } catch (error: any) {
    console.error('Error upscaling image:', error);
    res.status(500).json({ error: 'Error upscaling image', details: error.message });
  }
}