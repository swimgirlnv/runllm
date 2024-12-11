import React from "react";

const MoralDilemmaGame: React.FC<{ onComplete: (choice: string) => void }> = ({ onComplete }) => {
  const dilemmas = [
    {
      scenario: "A runaway trolley is headed toward five people. You can pull a lever to divert it to another track, but one person is on that track. Do you pull the lever?",
      options: ["Pull the lever", "Do nothing"],
    },
    {
      scenario: "You can save a drowning child, but doing so would ruin an expensive suit. Do you save the child?",
      options: ["Save the child", "Protect your suit"],
    },
    {
      scenario: "You can lie to save a friend from harm, but it would violate your values of honesty. Do you lie?",
      options: ["Lie to protect", "Tell the truth"],
    },
  ];

  const dilemma = dilemmas[Math.floor(Math.random() * dilemmas.length)];

  return (
    <div style={{ padding: "20px" }}>
      <h3>Moral Dilemma</h3>
      <p>{dilemma.scenario}</p>
      {dilemma.options.map((option, index) => (
        <button
          key={index}
          onClick={() => onComplete(option)}
          style={{
            display: "block",
            margin: "10px auto",
            padding: "10px",
            width: "100%",
            backgroundColor: index === 0 ? "blue" : "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default MoralDilemmaGame;