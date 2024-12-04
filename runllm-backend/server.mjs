import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env

import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

// Import prompts
const alicePrompt = await import('./content/alicePrompt.js').then((module) => module.default);
const bobPrompt = await import('./content/bobPrompt.mjs').then((module) => module.default);
const levelOnePrompt = await import('./content/levelone.mjs').then((module) => module.default);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const allowedOrigins = ['http://localhost:3000', 'https://your-frontend-domain.com'];
// Initialize Express app
const app = express();
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})); // For development. Restrict this in production.
app.use(express.json());

// Define assistant contexts
const assistants = {
  alice: [...alicePrompt],
  bob: [...bobPrompt],
  levelOne: [...levelOnePrompt],
};

// Alice Route
app.post('/api/alice', async (req, res) => {
  try {
    const { message } = req.body;

    assistants.alice.push({ role: 'user', content: message });

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: assistants.alice,
    });

    const aiResponse = response.choices[0].message.content;

    assistants.alice.push({ role: 'assistant', content: aiResponse });

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in Alice:', error.response?.data || error.message);
    res.status(500).json({ error: 'An error occurred while processing Alice\'s response.' });
  }
});

// Bob Route
app.post('/api/bob', async (req, res) => {
  try {
    const { message } = req.body;

    assistants.bob.push({ role: 'user', content: message });

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: assistants.bob,
    });

    const aiResponse = response.choices[0].message.content;

    assistants.bob.push({ role: 'assistant', content: aiResponse });

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in Bob:', error.response?.data || error.message);
    res.status(500).json({ error: 'An error occurred while processing Bob\'s response.' });
  }
});

// Puzzle Generation Route
app.post('/api/generate-puzzle', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: assistants.levelOne,
    });

    const aiResponse = response.choices[0].message.content;

    assistants.levelOne.push({ role: 'assistant', content: aiResponse });

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in level one:', error.response?.data || error.message);
    res.status(500).json({ error: 'An error occurred while processing level one\'s response.' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

