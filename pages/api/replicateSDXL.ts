import type { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';
import fetch from 'node-fetch';

// This function handles the API request and response
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Generating SDXL Image'); // Log indicating the start of the image generation process

  try {
    // Destructure the necessary parameters from the request body
    const { prompt, width, height , negative_prompt, disable_safety_checker } = req.body;
    console.log(prompt, width, height, negative_prompt, disable_safety_checker); // Log the received parameters for debugging

    // Initialize Replicate client with the API token
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN // Assuming you've configured your environment variable properly
    });

    // Make a request to the Replicate API to run the specified model with the provided inputs
    const response = await replicate.run(
      "bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f",
      // Uncomment the line below if you want to use a different model
      //"stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt,
          width,
          height,
          negative_prompt,
          disable_safety_checker
        }
      }
    );

    // Check if the response is an array of URLs and store it in imageUrls
    const imageUrls = Array.isArray(response) ? response : [];

    // Initialize an array to hold the Base64 encoded images
    const base64Images = [];

    // Fetch each image URL and convert it to Base64 format
    for (const url of imageUrls) {
      console.log('Fetching image from URL:', url); // Log each URL being fetched

      const imageResponse = await fetch(url); // Fetch the image from the URL

    }

    // Set the desired output format for the Base64 data URL
    const outputFormat = 'webp';
    // Join the Base64 images into a single data URL
;


    // Send the image URLs and the Base64 data URL as the response
    res.status(200).json({ imageUrls });
  } catch (error) {
    // Log any errors encountered during the process
    console.error('Error generating images:', error);

    // Send a 500 status code and an error message as the response
    res.status(500).json({ error: 'Error generating images' });
  }
}
