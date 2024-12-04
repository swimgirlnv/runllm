import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const fetchPrompt = async (path: string): Promise<string> => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load prompt file: ${path}`);
  }
  return await response.text();
};

export const sendMessageToAssistant = async (assistant: string, message: string): Promise<string> => {
  let systemPrompt: string;
  let assistantPrompt: string;

  if (assistant === 'alice') {
    systemPrompt = `You are Alice. ${await fetchPrompt('/prompts/aliceSystem.txt')}`;
    assistantPrompt = await fetchPrompt('/prompts/aliceAssistant.txt');
  } else if (assistant === 'bob') {
    systemPrompt = `You are Bob. ${await fetchPrompt('/prompts/bobSystem.txt')}`;
    assistantPrompt = await fetchPrompt('/prompts/bobAssistant.txt');
  } else {
    throw new Error('Unknown assistant');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'assistant', content: assistantPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const content = response.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('Alice is unavailable. Please try again later.');
    }

    return content;
  } catch (error) {
    console.error(`Error communicating with ${assistant}:`, error);
    return 'Alice is unavailable. Please try again later.';
  }
};

export const generatePuzzle = async (): Promise<string | null> => {
  try {
    const systemPrompt = `You are a Level One Assistant. ${await fetchPrompt('/prompts/levelOneSystem.txt')}`;
    const assistantPrompt = await fetchPrompt('/prompts/levelOneAssistant.txt');

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'assistant', content: assistantPrompt },
        { role: 'user', content: 'Create a puzzle or riddle for the player.' },
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    // Null-safe access using optional chaining and fallback for undefined
    const content = response.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('Response content is null or undefined.');
    }

    return content;
  } catch (error) {
    console.error('Error generating puzzle:', error);
    return null;
  }
};