import React, { useState } from "react";

const StoryCompletionGame: React.FC<{ onComplete: (story: string) => void }> = ({ onComplete }) => {
  const [story, setStory] = useState("");

  const prompt = "The robot stood at the edge of the city, staring at the distant stars. It knew it had one choice left to make: ";

  const handleSubmit = () => {
    onComplete(story);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Complete the Story</h3>
      <p>{prompt}</p>
      <textarea
        value={story}
        onChange={(e) => setStory(e.target.value)}
        placeholder="Your ending"
        style={{ width: "100%", height: "100px", marginBottom: "20px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: "10px",
          backgroundColor: "orange",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default StoryCompletionGame;