import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      try {
        const imageFile = req.body.image;
        console.log('Received image:', imageFile); // Log received image data
        const imgbbResponse = await uploadToImgbb(imageFile);
  
        console.log('IMGBB Response:', imgbbResponse); // Log IMGBB response
        res.status(200).json({ imageUrl: imgbbResponse });
      } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
      }
    } else {
      res.status(405).end(); // Method Not Allowed
    }
  }
async function uploadToImgbb(imageFile: File) {
  try {
    const formData = new FormData();
    formData.set('key', "8072702f1c133271b4c484307bff7822"); // IMGBB API key stored in environment variable
    formData.append('image', imageFile);
    console.log(imageFile)

    const response = await axios.post('https://api.imgbb.com/1/upload', formData);
    return response.data.data.display_url;
  } catch (error) {
    console.error('Error uploading image to IMGBB:', error);
    throw error;
  }
}
