import OpenAI from "openai";
import { GameState } from "../pages/MainScene";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Define the type for ChatCompletion messages
type ChatCompletionMessageParam = {
  role: "system" | "user" | "assistant";
  content: string;
};

// Thread storage to maintain separate threads (in-memory for simplicity)
const threads: Record<string, string[]> = {}; // { threadId: [message1, message2, ...] }

// Helper function to fetch prompts
const fetchPrompt = async (path: string): Promise<string> => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch prompt from: ${path}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching prompt from ${path}:`, error);
    throw new Error(`Unable to fetch prompt for assistant.`);
  }
};

// Helper function to initialize a thread if it doesn't exist
const initializeThread = (threadId: string) => {
  if (!threads[threadId]) {
    threads[threadId] = []; // Create a new thread array if it doesn't exist
  }
};

// Send a message to Alice or Bob
export const sendMessageToAssistant = async (
  assistant: "alice" | "bob",
  message: string,
  threadId: string
): Promise<string> => {
  try {
    // Fetch system and assistant prompts
    const systemPrompt =
      assistant === "alice"
        ? `You are Alice. ${await fetchPrompt("/prompts/aliceSystem.txt")}`
        : `You are Bob. ${await fetchPrompt("/prompts/bobSystem.txt")}`;
    const assistantPrompt =
      assistant === "alice"
        ? await fetchPrompt("/prompts/aliceAssistant.txt")
        : await fetchPrompt("/prompts/bobAssistant.txt");

    // Ensure the thread is initialized
    initializeThread(threadId);

    // Add the user's message to the thread
    threads[threadId].push(`Charlie: ${message}`);

    // Construct the conversation messages
    // Construct the conversation messages
    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      { role: "assistant", content: assistantPrompt },
      ...threads[threadId].map((msg) => {
        const [sender, content] = msg.split(": ");
        if (!content) {
          throw new Error(`Invalid message format: "${msg}"`);
        }
  
        // Enforce role assignment explicitly
        const role: ChatCompletionMessageParam["role"] =
          sender.toLowerCase() === "charlie" ? "user" : "assistant";
  
        return { role, content: content.trim() };
      }),
    ];

    // Call OpenAI API with the thread context
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    const content = response.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("Assistant provided an empty response.");
    }

    // Add the assistant's response to the thread
    threads[threadId].push(`${assistant.charAt(0).toUpperCase() + assistant.slice(1)}: ${content}`);

    return content;
  } catch (error) {
    console.error(`Error communicating with ${assistant}:`, error);
    return `${assistant.charAt(0).toUpperCase() + assistant.slice(1)} is unavailable right now.`;
  }
};

// Generate a puzzle
export const generatePuzzle = async (gameState: GameState): Promise<string | null> => {
  let puzzleContext: string;
  switch (gameState) {
    case "Act1":
      puzzleContext = "Create a familiar riddle or logic puzzle.";
      break;
    case "Act2":
      puzzleContext = "Create an abstract puzzle about pattern recognition or AI concepts like reinforcement learning.";
      break;
    case "Act3":
      puzzleContext = "Generate a puzzle involving decryption or piecing together corrupted files.";
      break;
    case "Act4":
      puzzleContext = "Create a final meta-puzzle about identity and existence.";
      break;
    default:
      throw new Error("Invalid game state.");
  }

  try {
    const systemPrompt = `You are a Level One Assistant. ${await fetchPrompt(
      `/prompts/levelOneSystem.txt`
    )}`;
    const assistantPrompt = await fetchPrompt(`/prompts/levelOneAssistant.txt`);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "assistant", content: assistantPrompt },
        { role: "user", content: puzzleContext },
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    const content = response.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("Puzzle generation failed.");
    }

    return content;
  } catch (error) {
    console.error("Error generating puzzle:", error);
    return null;
  }
};

export const generateCaptcha = async (): Promise<{ type: string; data: any } | null> => {
  try {
    // Randomly choose between word or logic CAPTCHA
    const captchaType = Math.random() > 0.5 ? "word" : "logic";

    const prompt =
      captchaType === "word"
        ? "Generate a CAPTCHA challenge that requires unscrambling a word or phrase. Provide a scrambled word and the correct answer, formatted as 'SCRAMBLED_WORD -> CORRECT_ANSWER'."
        : `Generate a logic-based CAPTCHA challenge. 
           Provide a question, a correct answer marked with '*', and at least 2 plausible incorrect options.
           Format as:
           Question
           *Correct Answer
           Incorrect Answer 1
           Incorrect Answer 2`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    const content = response.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("CAPTCHA generation failed. No content received.");
    }

    let captchaData;

    if (captchaType === "word") {
      // Expecting format: "SCRAMBLED_WORD -> CORRECT_ANSWER"
      const parts = content.split("->").map((part) => part.trim());
      if (parts.length !== 2) {
        throw new Error("Invalid word CAPTCHA format.");
      }
      captchaData = { scrambledWord: parts[0], correctAnswer: parts[1] };
    } else if (captchaType === "logic") {
      // Expecting format:
      // Question
      // *Correct Answer
      // Incorrect Answer 1
      // Incorrect Answer 2
      const lines = content.split("\n").map((line) => line.trim());
      const question = lines.shift(); // First line is the question
      const correctAnswerLine = lines.find((line) => line.startsWith("*"));
      if (!question || !correctAnswerLine) {
        throw new Error("Invalid logic CAPTCHA format. Missing question or correct answer.");
      }
      const correctAnswer = correctAnswerLine.replace("*", "").trim();
      const incorrectAnswers = lines.filter((line) => !line.startsWith("*"));
      captchaData = { question, correctAnswer, incorrectAnswers };
    }

    return { type: captchaType, data: captchaData };
  } catch (error) {
    console.error("Error generating CAPTCHA:", error);
    return null;
  }
};