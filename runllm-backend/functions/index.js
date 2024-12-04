const dotenv = require('dotenv');
dotenv.config();

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { OpenAI } = require('openai');

// Import prompts
let alicePrompt, bobPrompt, levelOnePrompt;
(async () => {
  alicePrompt = (await import('../content/alicePrompt.mjs')).default;
  bobPrompt = (await import('../content/bobPrompt.mjs')).default;
  levelOnePrompt = (await import('../content/levelone.mjs')).default;
})();


// Initialize OpenAI with Firebase config
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || functions.config().openai.api_key,
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
  alice: [alicePrompt],
  bob: [bobPrompt],
  levelOne: [levelOnePrompt],
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

// Export the app as a Firebase Function
exports.api = functions.https.onRequest(app);
