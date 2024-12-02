import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const BASE_URL = 'https://api.openai.com/v1/chat/completions';

export const generateCloudPuzzle = async () => {
    try {
        const response = await axios.post(
            BASE_URL,
            {
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: `
You are an AI assistant in a game. You generate abstract puzzles related to concepts like encryption, memory, identity, and neural networks. 
Your puzzles are part of a surreal setting where players try to decrypt messages and uncover hidden truths about themselves.

Your response must follow this format:
Question: <The abstract puzzle question>
* <Correct answer>
<Incorrect answer 1>
<Incorrect answer 2>

For example:
Question: In an encrypted neural network, what is the name of the key that unlocks hidden layers?
* Private key
Public key
Cipher seed
`
                    },
                    {
                        role: 'user',
                        content: `
Create a puzzle about encryption, memory, or neural networks. Follow the required format with one correct and two incorrect answers.
`
                    },
                ],
                max_tokens: 200,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${API_KEY}`,
                },
            }
        );

        // Extract and return the puzzle content
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating Cloud puzzle:', error);
        return null;
    }
};
