import React, { useState } from 'react';

const InteractiveScreens = ({ onMessageSend }) => {
  const [leftMessages, setLeftMessages] = useState([]);
  const [centerMessages, setCenterMessages] = useState([]);
  const [rightMessages, setRightMessages] = useState([]);

  // Function to handle sending a message and receiving AI response
  const handleSendMessage = async (screen, message) => {
    const newMessage = { role: 'user', content: message };

    // Update chat log based on the screen
    if (screen === 'left') {
      setLeftMessages((prev) => [...prev, newMessage]);
    } else if (screen === 'center') {
      setCenterMessages((prev) => [...prev, newMessage]);
    } else if (screen === 'right') {
      setRightMessages((prev) => [...prev, newMessage]);
    }

    // Call OpenAI to get the assistant response
    if (typeof onMessageSend === 'function') {
      const response = await onMessageSend(screen, message);
      const aiMessage = { role: 'assistant', content: response };

      // Update chat log with the assistant's response
      if (screen === 'left') {
        setLeftMessages((prev) => [...prev, aiMessage]);
      } else if (screen === 'center') {
        setCenterMessages((prev) => [...prev, aiMessage]);
      } else if (screen === 'right') {
        setRightMessages((prev) => [...prev, aiMessage]);
      }
    } else {
      console.error('onMessageSend is not a function');
    }
  };

  const renderMessages = (messages) => {
    return messages.map((msg, index) => (
      <div key={index} className={`message ${msg.role}`}>
        <p>{msg.content}</p>
      </div>
    ));
  };

  return (
    <div className="container">
      {/* Left screen for Alice */}
      <div className="screen left-screen">
        <div className="chat-log">{renderMessages(leftMessages)}</div>
        <input
          type="text"
          placeholder="Type a message to Alice..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value) {
              handleSendMessage('left', e.target.value);
              e.target.value = ''; // Clear input after sending
            }
          }}
        />
      </div>

      {/* Center screen for Alice, Bob, and Charlie */}
      <div className="screen center-screen">
        <div className="chat-log">{renderMessages(centerMessages)}</div>
        <input
          type="text"
          placeholder="Type a message to Alice and Bob..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value) {
              handleSendMessage('center', e.target.value);
              e.target.value = ''; // Clear input after sending
            }
          }}
        />
      </div>

      {/* Right screen for Bob */}
      <div className="screen right-screen">
        <div className="chat-log">{renderMessages(rightMessages)}</div>
        <input
          type="text"
          placeholder="Type a message to Bob..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value) {
              handleSendMessage('right', e.target.value);
              e.target.value = ''; // Clear input after sending
            }
          }}
        />
      </div>
    </div>
  );
};

export default InteractiveScreens;
