import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root");

function ChatbotModal({ isOpen, onRequestClose, charityName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (isOpen && charityName) {
      // Display an initial message to the user
      const initialMessage = `What would you like to know about ${charityName}?`;
      setMessages([{ sender: "bot", text: initialMessage }]);
    }
  }, [isOpen, charityName]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      // Send the user's message to the proxy server
      const response = await axios.post("http://ec2-18-119-248-206.us-east-2.compute.amazonaws.com:5000/api/generative-ai", {
        model: 'gemini-1.5-flash',
        message: input,
      });

      const botMessage = { sender: "bot", text: response.data.responseText };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error communicating with Generative AI API:", error);
    }

    setInput(""); // Clear input after sending
  };
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal">
      <div className="modal">
        <h2>Learn about {charityName}</h2>
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </Modal>
  );
}

export default ChatbotModal;
