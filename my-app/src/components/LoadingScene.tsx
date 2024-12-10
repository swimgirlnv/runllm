import React from "react";
import { useProgress } from "@react-three/drei";

const LoadingScreen: React.FC = () => {
  const { progress } = useProgress(); // Tracks loading progress

  return (
    <div style={styles.container}>
      <div style={styles.progressContainer}>
        <div
          style={{
            ...styles.progressBar,
            width: `${progress}%`, // Dynamically update width based on progress
          }}
        />
      </div>
      <p style={styles.text}>{Math.floor(progress)}% Booting Up...</p>
    </div>
  );
};

const styles = {
  container: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "flex-end", // Align progress bar and text at the bottom
    alignItems: "center",
    backgroundColor: "transparent", // Keep the background transparent
    zIndex: 1000,
    pointerEvents: "none" as const, // Allow interaction with the main content (if needed)
  },
  progressContainer: {
    width: "80%",
    height: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Slightly transparent background
    borderRadius: "5px",
    overflow: "hidden",
    marginBottom: "10px", // Add spacing between bar and text
  },
  progressBar: {
    height: "100%",
    backgroundColor: "white", // Green progress bar color
    transition: "width 0.3s ease-in-out", // Smooth transition for progress changes
  },
  text: {
    color: "white",
    fontSize: "16px",
    marginBottom: "20px", // Add padding at the very bottom
    textAlign: "center" as const,
  },
};

export default LoadingScreen;