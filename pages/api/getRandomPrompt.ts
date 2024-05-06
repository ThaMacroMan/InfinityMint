// pages/api/getRandomPrompt.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { spawn } from 'child_process'; // Import spawn from child_process
dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Getting Random Prompt!');
  if (process.env.OPENAI_API_KEY) {
    try {
      // Play sound when the endpoint is called
      const playSound = () => {
        spawn('afplay', ['pages/styles/mixkit-futuristic-door-open-183.mp3', '-v', '0.']); 
      };
      
      playSound(); // Call the function to play the sound

      const openAI = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
        //
      });

      const response = await openAI.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        max_tokens: 70,
        temperature: 0.8,
        messages: [
          {
            "role": "system",
            "content": "Craft Dalle prompts that generate visually rich and imaginative futuristic scenes, tapping into the full capabilities of Dalle."
          },
          {
            "role": "system",
            "content": "Include only the prompt itself in the output. Ensure no text or quotes appear in the image. Maximum of 70 tokens."
          },
          {
            "role": "system",
            "content": "Example prompt: a bustling spaceport on an asteroid, with Cardania's citizens and aliens bartering over exotic resources like Prismaleaf and Quantum Dark Energy, starships docking in the background, and Ultrabots patrolling the area."
          },
          {
            "role": "user",
            "content": "Generate a Dalle prompt that imagines a vibrant scene in the Cardania universe, featuring spaceports, diverse alien interactions, and dynamic use of $RAD and Resource Tokens."
          }          
          
        ]
      });

      res.status(200).json({ prompt: response.choices[0].message.content });
    } catch (error) {
      res.status(500).json({ error: 'Error generating random prompt' });
    }
  } else {
    res.status(500).json({ error: 'OPENAI_API_KEY is not set.' });
  }
}
