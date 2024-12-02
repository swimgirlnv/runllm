import React, { useState } from 'react';

const RightScreen = ({ onMessageSend }) => {
  const [messages, setMessages] = useState([]);

  // Function to handle sending a message and receiving Bob's response
  const handleSendMessage = async (message) => {
    const newMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, newMessage]);

    // Get Bob's response
    const response = await onMessageSend('right', message);
    const aiMessage = { role: 'assistant', content: response };

    // Add Bob's response to chat
    setMessages((prev) => [...prev, aiMessage]);
  };

  const renderMessages = (messages) => {
    return messages.map((msg, index) => (
      <div key={index} className={`message ${msg.role}`}>
        <p>{msg.content}</p>
      </div>
    ));
  };

  return (
    <div className="screen right-screen">
      <div className="chat-log">{renderMessages(messages)}</div>
      <input
        type="text"
        placeholder="Type a message to Bob..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.value) {
            handleSendMessage(e.target.value);
            e.target.value = ''; // Clear input after sending
          }
        }}
      />
    </div>
  );
};

export default RightScreen;
