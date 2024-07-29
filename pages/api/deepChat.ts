import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

interface ChatRequestBody {
  messages: { role: 'system' | 'user' | 'assistant' | 'function'; text: string, name: string; content:string }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  (res as any).flushHeaders(); // flush the headers to establish SSE

  if (process.env.OPENAI_API_KEY) {
    try {
      const openAI = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const { messages }: ChatRequestBody = req.body;
      console.log('Received messages:', messages); // Logging received messages

      const validMessages = messages
        .filter((message) => message.text !== null && message.text !== undefined)
        .map((message) => ({
          role: message.role,
          content: message.text,
          name: message.name,
        }));

      if (validMessages.length === 0) {
        throw new Error('All messages have null or undefined content.');
      }

      const systemContent = `
        Assist the user with any help with the InfinityMint platform. Use very concise response.
        To use: Connect wallet, Refuel by signing a 1 ADA transaction, giving you 15 AI Generations. 
        Your remaining uses are shown in the fuel bar.       
        Then enter a prompt or use AutoIdea to create one for you.
        Select your style, the AI Model, Form, and Grade. Then click build Idea.
        If you love it, Upscale it. Then click mint creation to create an NFT and send it to your wallet by signing the transaction!

        InfinityMint Platform:
        Overview: InfinityMint is a versatile platform that allows users to generate and mint AI-created NFTs on the Cardano blockchain. The platform has been recently updated with several new features to enhance user experience and functionality.
        Key Features:
        - Image Models: SDXL Lightning, Stable Diffusion 3, Dalle 3. 
        - AutoIdea: Click Autoidea to generate a random prompt for you.
        - Each generation uses AI to create a title!
        - Upscaler: Allows users to upscale their images by 4x, increasing size and detail.
        - Sidebar: Generated images are saved on the side of the screen. Select any saved image to upscale or mint.
        - Minting: Save your image by minting it as an NFT on the Cardano Blockchain. Minting in collaboration with SickCity. In-house minting coming soon.
        - Future Plans: Upcoming features include audio, video, and more advanced functionalities. Integration of Catnip, $CATSKY, and OG NFT holders for unlocking features and adjusting pricing. Platform income supports $CATSKY.
        - Click your image to open it in a new window.
        
        Catsky AI Project:
        Overview: Catsky AI is a comprehensive AI-driven project within the Cardano ecosystem that combines various AI applications and tools to create a unique and engaging experience for users. The project includes several innovative features and community-driven initiatives.
        Key Components:
        - InfinityMint: AI NFT generator allowing users to create and mint NFTs on Cardano. Updated with new models and features for enhanced user experience.
        - AI Meme Generator: A tool for creating custom memes using AI. Supports preloaded images and allows users to upload their own images.
        - Quick Think AI: A Twitter bot powered by Catsky AI that answers questions and provides information. Can be tagged in replies to any Twitter post.
        - Community Initiatives: Catsky Designs: An Etsy store selling AI-generated cat merchandise. Collaboration with other projects and platforms to increase visibility and utility.
        - Cross-Chain Integration: Integration with Wanchain for cross-chain swaps between Cardano, BNB Chain, and Ethereum. Future plans to add more chains for broader accessibility.
        - Partnerships and Collaborations: Collaborations with projects like BabyShitzu and StripperCoin. Involvement in the Cardano community through initiatives like Intersect MBO.
        - Future Development: Continuous improvement and expansion of AI tools and applications. Focus on sustainability and long-term growth through building valuable and useful products.
        - Community Engagement: Active presence on social media platforms like Twitter and Facebook. Regular updates and interactions with the community through Discord and other channels.
      `;

      const response = await openAI.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 2000,
        temperature: 0.9,
        top_p: 1.0,
        messages: [
          {
            role: "system",
            content: systemContent,
            name: 'user'
          },
          ...validMessages,
        ],
        stream: true, // enable streaming
      });

      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
          (res as any).flush(); // ensure the data is sent immediately
        }
      }

      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error) {
      console.error('Error handling chat request:', error); // Detailed error logging
      res.write(`data: ${JSON.stringify({ error: 'Error handling chat request', details: (error as Error).message })}\n\n`);
      res.end();
    }
  } else {
    console.error('OPENAI_API_KEY is not set.');
    res.write(`data: ${JSON.stringify({ error: 'OPENAI_API_KEY is not set.' })}\n\n`);
    res.end();
  }
}
