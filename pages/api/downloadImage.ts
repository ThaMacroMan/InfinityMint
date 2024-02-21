// pages/api/downloadImage.ts

import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("API FILE");
    const imageUrl = req.query.imageUrl as string; // Assuming imageUrl is passed as a query parameter
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Stream the fetched image data back to the client
    if (response.body) {
        response.body.pipe(res);
      }
  } catch (error) {
    console.error('Error downloading image:', error);
    res.status(500).json({ error: 'Failed to download image' });
  }
}
