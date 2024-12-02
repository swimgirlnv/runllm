import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Async function to read the text file and create the prompt array
async function getLevelOnePrompt() {
  try {
    // Correctly resolve paths relative to the current module file
    const contentSystem = await readFile(path.join(__dirname, '../texts/levelOneSystem.txt'), 'utf-8');
    const contentAssistant = await readFile(path.join(__dirname, '../texts/levelOneAssistant.txt'), 'utf-8');
    
    // Create the prompt array using the file content
    return [
      { role: 'system', content: contentSystem }, // Ensure you assign content correctly
      { role: 'assistant', content: contentAssistant },
    ];
  } catch (error) {
    console.error('Error reading Level One prompt:', error);
    // Return an empty prompt array or a fallback prompt to prevent further errors
    return [
      { role: 'system', content: 'Fallback content for Level One due to file read error.' },
    ];
  }
}

// Export the prompt
export default await getLevelOnePrompt();
