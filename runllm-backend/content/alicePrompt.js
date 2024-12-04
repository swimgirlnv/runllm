const { readFileSync } = require('fs');
const path = require('path');

const aliceSystemPath = path.join(__dirname, '../texts/aliceSystem.txt');
const aliceAssistantPath = path.join(__dirname, '../texts/aliceAssistant.txt');

let alicePrompt;

try {
  const contentSystem = readFileSync(aliceSystemPath, 'utf-8');
  const contentAssistant = readFileSync(aliceAssistantPath, 'utf-8');

  alicePrompt = [
    { role: 'system', content: contentSystem },
    { role: 'assistant', content: contentAssistant },
  ];
} catch (error) {
  console.error('Error reading Alice prompt:', error);
  alicePrompt = [
    { role: 'system', content: 'Fallback content for Alice due to file read error.' },
  ];
}

module.exports = alicePrompt;
