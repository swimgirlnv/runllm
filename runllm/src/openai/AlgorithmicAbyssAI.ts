import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const BASE_URL = 'https://api.openai.com/v1/chat/completions';

// Function to generate a question for the learning loop
export const generateAlgorithmicPuzzle = async () => {
    try {
        const response = await axios.post(
            BASE_URL,
            {
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: `
                    You are an AI assistant in a game. You generate reasoning-based puzzles related to AI concepts like reinforcement learning, neural networks, and machine learning. 
                    Your response must follow this format:
                    Question: <A reasoning or pattern-based question about AI>
                    * <Correct answer>
                    <Incorrect answer 1>
                    <Incorrect answer 2>
                    
                    For example:
                    Question: In reinforcement learning, what is the term for the reward given after completing a task?
                    * Reward signal
                    Delayed feedback
                    Penalty`
                    },
                    {
                        role: 'user',
                        content: `Generate a reasoning or pattern-based question with three answer choices.`,
                    },
                ],
                max_tokens: 150,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${API_KEY}`,
                },
            }
        );

        // Extract and return the puzzle content
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error generating learning loop question:', error);
        return null;
    }
};
