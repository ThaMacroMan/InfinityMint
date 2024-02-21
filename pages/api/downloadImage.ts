// pages/api/downloadImage.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { imageUrl } = req.query;

  console.log('Downloading image from:', imageUrl);

  try {
    const response = await fetch(imageUrl as string);
    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'image/jpeg');
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error downloading image:', error);
    res.status(500).json({ error: 'Failed to download image' });
  }

  console.log('Image download process completed');
}
