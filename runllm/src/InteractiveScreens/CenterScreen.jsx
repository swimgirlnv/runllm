import React, { useState } from 'react';

const CenterScreen = ({ onMessageSend }) => {
  const [messages, setMessages] = useState([]);

  // Function to handle sending a message and receiving responses from Alice and Bob
  const handleSendMessage = async (message) => {
    const newMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, newMessage]);

    // Get responses from both Alice and Bob
    const responseAlice = await onMessageSend('center', `Alice: ${message}`);
    const responseBob = await onMessageSend('center', `Bob: ${message}`);
    const aiMessageAlice = { role: 'assistant', content: `Alice: ${responseAlice}` };
    const aiMessageBob = { role: 'assistant', content: `Bob: ${responseBob}` };

    // Add responses to the chat log
    setMessages((prev) => [...prev, aiMessageAlice, aiMessageBob]);
  };

  const renderMessages = (messages) => {
    return messages.map((msg, index) => (
      <div key={index} className={`message ${msg.role}`}>
        <p>{msg.content}</p>
      </div>
    ));
  };

  return (
    <div className="screen center-screen">
      <div className="chat-log">{renderMessages(messages)}</div>
      <input
        type="text"
        placeholder="Type a message to Alice and Bob..."
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

export default CenterScreen;
