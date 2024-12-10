import React, { useState, useEffect } from "react";

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logToDevTools: (message: string) => void; // Function to log to the DevToolDrawer
}

const BlogModal: React.FC<BlogModalProps> = ({ isOpen, onClose, logToDevTools }) => {
  const [hasLogged, setHasLogged] = useState(false); // Track if the log has occurred

  useEffect(() => {
    if (isOpen && !hasLogged) {
      const message =
        "Ahh, you've found my musings! Good job, Charlie. Now, let's see what I've been up to lately...";
      console.log(message); // Log to the browser console
      logToDevTools(message); // Log to the DevToolDrawer
      setHasLogged(true); // Prevent further logging until modal is reopened
    } else if (!isOpen) {
      setHasLogged(false); // Reset log status when the modal closes
    }
  }, [isOpen, hasLogged, logToDevTools]);

  if (!isOpen) return null; // Render nothing if the modal is closed

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "80%",
          height: "80%",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          overflow: "hidden", // Ensure iframe content doesn't overflow
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "5px 10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Close
        </button>

        {/* Blog iframe */}
        <iframe
          src="https://runllm-blog.web.app/"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title="Blog"
        ></iframe>
      </div>
    </div>
  );
};

export default BlogModal;