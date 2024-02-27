// pages/api/swap.ts

import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.post('https://api.dexhunter.app/swap/wallet', req.body);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(error.response.status).json(error.response.data);
  }
}
