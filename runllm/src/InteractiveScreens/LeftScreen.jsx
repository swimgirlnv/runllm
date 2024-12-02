import React, { useState } from 'react';

const LeftScreen = ({ onMessageSend }) => {
  const [messages, setMessages] = useState([]);

  // Function to handle sending a message and receiving Alice's response
  const handleSendMessage = async (message) => {
    const newMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, newMessage]);

    // Get Alice's response
    const response = await onMessageSend('left', message);
    const aiMessage = { role: 'assistant', content: response };

    // Add Alice's response to chat
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
    <div className="screen left-screen">
      <div className="chat-log">{renderMessages(messages)}</div>
      <input
        type="text"
        placeholder="Type a message to Alice..."
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

export default LeftScreen;
