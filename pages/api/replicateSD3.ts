import type { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';
import fetch from 'node-fetch';

// This function handles the API request and response
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Generating SD3 Image');
  try {
    const { prompt, width, height, num_outputs, output_format, output_quality } = req.body;
    console.log(prompt, width, height, num_outputs, output_format, output_quality);
    const startTime = Date.now(); // Record start time

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN // Assuming you've configured your environment variable properly
    });

    const response = await replicate.run(
      "stability-ai/stable-diffusion-3", // Model identifier
      {
        input: {
          prompt,
          width,
          height,
          num_outputs,
          output_format,
        }
      }
    );

    // Assuming the response is an array of URLs
    const imageUrls = Array.isArray(response) ? response : [];

    // Fetch each image URL and convert it to Base64
    const base64Images = [];
    for (const url of imageUrls) {
      const imageResponse = await fetch(url);
      const buffer = await imageResponse.buffer();
      const base64Image = buffer.toString('base64');
      base64Images.push(base64Image);
    }

    // Construct the Base64 data URL
    const base64DataUrl = `data:image/webp;base64,${base64Images.join('')}`;
    console.log(response);

    const endTime = Date.now(); // Record end time
    const generationTime = endTime - startTime; // Calculate the time difference
    console.log(`Image generation took ${generationTime} ms`);

    res.status(200).json({ base64DataUrl, imageUrls });
  } catch (error) {
    console.error('Error generating images:', error);
    res.status(500).json({ error: 'Error generating images' });
  }
}
