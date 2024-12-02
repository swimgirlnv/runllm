export const generatePuzzle = async () => {
    try {
        const response = await fetch('http://localhost:5001/api/generate-puzzle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch puzzle');
        }

        const data = await response.json();
        return data.puzzle;
    } catch (error) {
        console.error('Error fetching puzzle from backend:', error);
        return null;
    }
};