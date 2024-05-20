// pages/api/getRandomPrompt.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const characters = [
  "a cyborg detective", "an alien scientist", "a time-traveling historian", 
  "a rogue AI", "a space pirate", "a quantum physicist", "a mutant explorer",
  "a robotic bounty hunter", "a genetically engineered soldier", "a telepathic alien",
  "a shape-shifting spy", "a virtual reality hacker", "a rogue android",
  "a time-traveling pilot", "an intergalactic smuggler", "a bioengineered human",
  "a galactic emperor", "a rogue space marine", "a time-traveling archaeologist",
  "an AI overlord", "a mutant renegade", "a cybernetic hacker", "a cloned warrior",
  "a cosmic entity", "a dimension-hopping trader", "a telekinetic rebel",
  "a futuristic bounty hunter", "a space-faring monk", "a starship captain"
];

const settings = [
  "on a distant planet", "in a parallel universe", "inside a virtual reality simulation", 
  "in a post-apocalyptic world", "on a massive space station", "in a hidden dimension",
  "during a galactic war", "in a futuristic megacity", "in an ancient alien ruin",
  "on a spaceship traveling faster than light", "on a colony at the edge of the galaxy",
  "in an underwater city", "on a desert planet with three suns", "in a hollow asteroid",
  "in a multiverse laboratory", "in a starship graveyard", "on a floating island",
  "inside a black hole", "in a galaxy-spanning empire", "in an AI-controlled utopia",
  "on a rogue comet", "in an interstellar ark", "on a virtual planet",
  "inside a nebula", "in a war-torn sector", "on a moon base", "in a Dyson sphere"
];

const events = [
  "discovering a hidden civilization", "battling an interstellar fleet", 
  "uncovering a secret technology", "negotiating peace with aliens", 
  "escaping a collapsing star", "solving a cosmic mystery", "defusing a quantum bomb",
  "encountering a time paradox", "preventing an AI uprising", "stopping a rogue planet",
  "rescuing a kidnapped scientist", "recovering a stolen artifact", "surviving a black hole",
  "unraveling a conspiracy", "finding a cure for a galactic plague",
  "leading a rebellion", "exploring an uncharted galaxy", "building a new colony",
  "restoring a forgotten technology", "battling a cosmic entity", "negotiating with a hostile alien race",
  "finding a legendary spaceship", "protecting a sacred artifact", "escaping a mind prison",
  "surviving a supernova", "stopping a starship mutiny", "investigating an alien signal"
];

const objects = [
  "a mysterious artifact", "an advanced spaceship", "a holographic map", 
  "a sentient robot", "a dimensional gateway", "an ancient alien relic", "a nanotech suit",
  "a quantum computer", "a gravity-manipulating device", "a time-travel bracelet",
  "a mind-control helmet", "an energy shield", "a teleportation device", "a plasma sword",
  "a bioengineered creature", "a cybernetic implant", "an alien symbiote",
  "a starship AI core", "a galaxy map", "an interstellar communicator", 
  "a universal translator", "a photon blaster", "a dark matter engine",
  "a neural interface", "a chronomancer's staff", "a cosmic compass", "a terraforming device"
];

const getRandomElement = (array: string[]) => array[Math.floor(Math.random() * array.length)];

const generateRandomSciFiPrompt = () => {
  const character = getRandomElement(characters);
  const setting = getRandomElement(settings);
  const event = getRandomElement(events);
  const obj = getRandomElement(objects);
  return `${character} ${setting} ${event} involving ${obj}.`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Getting Random Prompt!');
  if (process.env.OPENAI_API_KEY) {
    try {
      const openAI = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const randomPrompt = generateRandomSciFiPrompt();
      console.log('Generated Prompt:', randomPrompt);

      const response = await openAI.chat.completions.create({
        model: "gpt-3.5-turbo",
        max_tokens: 15, // Ensure the response is within 15 tokens
        temperature: 0.9, // Higher temperature for more randomness
        messages: [
          {
            role: "system",
            content: "Generate an imaginative and highly random sci-fi prompt based on the following inspiration elements. The prompt should be concise, within 15 tokens, and ensure no text or quotes appear in the image."
          },
          {
            role: "user",
            content: `Use the following elements as inspiration: ${randomPrompt}`
          },
        ],
      });

      res.status(200).json({ prompt: response.choices[0]?.message?.content?.trim() });
    } catch (error) {
      console.error('Error generating random prompt:', error);
      res.status(500).json({ error: 'Error generating random prompt' });
    }
  } else {
    res.status(500).json({ error: 'OPENAI_API_KEY is not set.' });
  }
}
