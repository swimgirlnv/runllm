
const ALICE_API_URL = 'http://localhost:8080/api/alice';
const BOB_API_URL = 'http://localhost:8080/api/bob';

export const sendMessageToAssistant = async (assistant, message) => {
  const url = assistant === 'alice' ? ALICE_API_URL : BOB_API_URL;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error(`Error communicating with ${assistant}:`, error);
    return 'Sorry, there was an error processing your message.';
  }
};

export const generatePuzzle = async (message) => {
  try {
      const response = await fetch('http://localhost:8080/api/generate-puzzle', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
      });

      if (!response.ok) {
          throw new Error('Failed to fetch puzzle');
      }

      const data = await response.json();
      return data.response;
  } catch (error) {
      console.error('Error fetching puzzle from backend:', error);
      return null;
  }
};