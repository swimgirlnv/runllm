/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import dotenv from 'dotenv';
dotenv.config(); // Make sure this is the first line in your script

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { OpenAI } from 'openai';
import axios from 'axios';

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


// Check if the API key is loaded correctly
// console.log('Loaded API Key:', process.env.REACT_APP_OPENAI_API_KEY);

import alicePrompt from './content/alicePrompt.mjs';
import bobPrompt from './content/bobPrompt.mjs';
import levelOnePrompt from './content/levelone.mjs';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const port = 5001;

// Define the initial context for assistants Alice and Bob
const assistants = {
  alice: [...alicePrompt], // Use Alice's prompt file
  bob: [...bobPrompt],     // Use Bob's prompt file
  levelOne: [...levelOnePrompt],
};

app.use(cors());
app.use(bodyParser.json());

// Route to handle OpenAI API requests for Alice
app.post('/api/alice', async (req, res) => {
  try {
    const { message } = req.body;

    // Add user message to Alice's conversation
    assistants.alice.push({ role: 'user', content: message });

    // Generate response from OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // Choose the appropriate model
      messages: assistants.alice,
    });

    const aiResponse = response.choices[0].message.content;

    // Add assistant response to conversation history
    assistants.alice.push({ role: 'assistant', content: aiResponse });

    // Send back the assistant's response
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in Alice:', error);
    res.status(500).json({ error: 'An error occurred while processing Alice\'s response.' });
  }
});

// Route to handle OpenAI API requests for Bob
app.post('/api/bob', async (req, res) => {
  try {
    const { message } = req.body;

    // Add user message to Bob's conversation
    assistants.bob.push({ role: 'user', content: message });

    // Generate response from OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // Choose the appropriate model
      messages: assistants.bob,
    });

    const aiResponse = response.choices[0].message.content;

    // Add assistant response to conversation history
    assistants.bob.push({ role: 'assistant', content: aiResponse });

    // Send back the assistant's response
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in Bob:', error);
    res.status(500).json({ error: 'An error occurred while processing Bob\'s response.' });
  }
});

app.post('/api/generate-puzzle', async (req, res) => {
  try {

    // Generate response from OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // Choose the appropriate model
      messages: assistants.levelOne,
    });

    const aiResponse = response.choices[0].message.content;

    // Add assistant response to conversation history
    assistants.levelOne.push({ role: 'assistant', content: aiResponse });

    // Send back the assistant's response
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in level one:', error);
    res.status(500).json({ error: 'An error occurred while processing level one\'s response.' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
