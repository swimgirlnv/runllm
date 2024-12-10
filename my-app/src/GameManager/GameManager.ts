import OpenAI from "openai";

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
    threads[threadId].push(
      `${assistant.charAt(0).toUpperCase() + assistant.slice(1)}: ${content}`
    );

    return content;
  } catch (error) {
    console.error(`Error communicating with ${assistant}:`, error);
    return `${
      assistant.charAt(0).toUpperCase() + assistant.slice(1)
    } is unavailable right now.`;
  }
};

// Generate a puzzle
export const generatePuzzle = async (
  gameState: string,
  addToDevToolLogs: (message: string) => void
): Promise<{
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
} | null> => {
  let context = "";
  switch (gameState) {
    case "Act1":
      context = "Create a logic-based puzzle for the player to solve.";
      break;
    case "Act2":
      context =
        "Generate a puzzle with philosophical undertones about AI and existence.";
      break;
    case "Act3":
      context =
        "Create an abstract puzzle that explores fragmented memories or encryption.";
      break;
    case "Act4":
      context = "Design a symbolic puzzle about identity and humanity.";
      break;
    default:
      throw new Error("Invalid game state.");
  }

  const systemPrompt = await fetchPrompt("/prompts/levelOneSystem.txt");
  const assistantPrompt = await fetchPrompt("/prompts/levelOneSystem.txt");

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "assistant", content: assistantPrompt },
      { role: "user", content: context },
    ],
    max_tokens: 200,
    temperature: 0.8,
  });

  const content = response.choices?.[0]?.message?.content?.trim();
  if (!content) return null;

  // Log the extracted content to DevToolDrawer and console (only once per call)
  const contentMessage = `${content}`;
  console.log(contentMessage);
  addToDevToolLogs(contentMessage);

  // Extract question, correct answer, and incorrect answers
  const lines = content.split("\n").map((line) => line.trim());
  const question = lines.shift();
  const correctAnswerLine = lines
    .find((line) => line.startsWith("*"))
    ?.replace("*", "")
    .trim();
  const incorrectAnswers = lines
    .filter((line) => !line.startsWith("*"))
    .map((line) => line.trim());

  if (!question || !correctAnswerLine || incorrectAnswers.length < 2)
    return null;

  return {
    question,
    correctAnswer: correctAnswerLine,
    incorrectAnswers,
  };
};

export const generateCaptcha = async (): Promise<{
  type: string;
  data: any;
} | null> => {
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
        throw new Error(
          "Invalid logic CAPTCHA format. Missing question or correct answer."
        );
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

export const generateTuringTest = async (): Promise<{
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
} | null> => {
  try {
    const prompt = `
      Create a Turing Test challenge. The Turing Test is a thought experiment that assesses a machine's ability to exhibit human-like intelligence.

      Ask a question that tries to determine if the player is human or a machine. Do not ask for capitals of countries or other simple questions.
      
      Provide the following:
      1. A single question that tests reasoning or knowledge, starting with "$", followed by a newline.
      2. One correct answer marked with "*" and at least 2 plausible incorrect answers marked with "&".
      Ensure the answers are properly labeled with symbols. The format should look like this:

      $Question
      *Correct Answer
      &Incorrect Answer 1
      &Incorrect Answer 2
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    const content = response.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("Turing Test generation failed.");

    // Split lines and clean up whitespace
    const lines = content.split("\n").map((line) => line.trim());

    // Extract the question
    const question = lines
      .find((line) => line.startsWith("$"))
      ?.replace("$", "")
      .trim();
    if (!question) {
      throw new Error("Invalid Turing Test format: Missing question.");
    }

    // Extract the correct answer
    const correctAnswerLine = lines.find((line) => line.startsWith("*"));
    if (!correctAnswerLine) {
      throw new Error("Invalid Turing Test format: Missing correct answer.");
    }
    const correctAnswer = correctAnswerLine.replace("*", "").trim();

    // Extract incorrect answers
    const incorrectAnswers = lines
      .filter((line) => line.startsWith("&"))
      .map((line) => line.replace("&", "").trim());

    // Validate the extracted data
    if (!correctAnswer || incorrectAnswers.length < 2) {
      console.error("Invalid Turing Test data:", {
        question,
        correctAnswer,
        incorrectAnswers,
      });
      throw new Error("Invalid Turing Test format: Insufficient data.");
    }

    return { question, correctAnswer, incorrectAnswers };
  } catch (error) {
    console.error("Error generating Turing Test:", error);
    return null;
  }
};

export const generateAssistantNotes = async (
  assistant: "Alice" | "Bob",
  gameData: {
    correctAnswers: number;
    incorrectAnswers: number;
    puzzlesCompleted: number;
  }
): Promise<string> => {
  const context =
    assistant === "Alice"
      ? `You are Alice, a logical assistant. Analyze the player's actions and provide an objective summary of their performance.`
      : `You are Bob, a cryptic assistant. Provide a creative and cryptic interpretation of the player's behavior.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: context },
      {
        role: "user",
        content: `The player has completed ${gameData.puzzlesCompleted} puzzles, answered ${gameData.correctAnswers} questions correctly, and made ${gameData.incorrectAnswers} mistakes.`,
      },
    ],
    max_tokens: 150,
    temperature: 0.7,
  });

  return response.choices?.[0]?.message?.content?.trim() || "";
};
