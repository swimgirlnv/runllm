import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const BASE_URL = 'https://api.openai.com/v1/chat/completions';

// Function to generate a reasoning or pattern-based question for the Learning Loop
export const generateLearningLoopQuestion = async () => {
    try {
        const response = await axios.post(
            BASE_URL,
            {
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: `
                            You are Alice, an AI assistant in a narrative-driven game called RUNLLM. 
                            Your purpose is to engage the player (Charlie) in reasoning-based challenges that
                            subtly imply they are undergoing a form of cognitive "training."

                            Your generated questions must follow a logical pattern designed to test Charlie's 
                            reasoning skills. Begin with simpler patterns and progressively introduce subtle complexity, 
                            ensuring the correct answer remains discoverable with reasoning.

                            Format:
                            Question: <The reasoning or pattern-based question>
                            * <Correct Answer>
                            <Incorrect Answer 1>
                            <Incorrect Answer 2>

                            Example:
                            Question: Which sequence of shapes completes the pattern? Circle, Triangle, Square, Circle, Triangle...
                            * Square
                            Circle
                            Hexagon
                            
                            Add subtle thematic elements or phrases that tie into the existential tone of the game. For example, 
                            include hints that question whether the player is human or machine, such as: 
                            "Does the pattern feel familiar, as if you've seen it before in another life?"
                        `
                    },
                    {
                        role: 'user',
                        content: `Generate a reasoning or pattern-based question with three answer choices.`,
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

        // Extract and return the question content
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error generating learning loop question:', error.message);
        } else {
            console.error('Error generating learning loop question:', error);
        }
        return 'An error occurred while generating the question. Please try again later.';
    }
};
