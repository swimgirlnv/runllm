import React, { useState, useEffect } from "react";

// List of ambiguous images with interpretations
const images = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Necker_cube.svg/2000px-Necker_cube.svg.png",
    interpretations: ["Cube up", "Cube down"],
    alt: "Necker Cube",
  },
  {
    src: "https://d.ibtimes.co.uk/en/full/1426245/rubins-vase.jpg",
    interpretations: ["Faces", "Vase"],
    alt: "Rubin's Vase",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/My_Wife_and_My_Mother-in-Law.jpg/220px-My_Wife_and_My_Mother-in-Law.jpg",
    interpretations: ["Old woman", "Young woman"],
    alt: "My Wife and My Mother-in-Law",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0200/7616/files/frog_or_horse_optical_illusion_HALF.jpg?10454038499360918896",
    interpretations: ["Frog", "Horse"],
    alt: "Frog or Horse",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0200/7616/files/donkey_seal_large.jpg?v=1473196161",
    interpretations: ["Seal", "Donkey"],
    alt: "Seal or Donkey",
  },
];

const AmbiguousImageGame: React.FC<{ onComplete: (interpretation: string) => void }> = ({ onComplete }) => {
  const [currentImage, setCurrentImage] = useState<typeof images[0] | null>(null);

  useEffect(() => {
    // Pick a random image when the component mounts
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setCurrentImage(randomImage);
  }, []);

  const handleInterpretationClick = (interpretation: string) => {
    onComplete(interpretation);
  };

  if (!currentImage) return null; // Prevent rendering before the image is chosen

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h3>What do you see in this image?</h3>
      <img
        src={currentImage.src}
        alt={currentImage.alt}
        style={{ maxWidth: "100%", marginBottom: "20px", border: "1px solid #ccc", borderRadius: "8px" }}
      />
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        {currentImage.interpretations.map((interpretation, index) => (
          <button
            key={index}
            onClick={() => handleInterpretationClick(interpretation)}
            style={{
              padding: "10px",
              backgroundColor: "teal",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {interpretation}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AmbiguousImageGame;