import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

// Directly call the Gemini API (development only)
const ai = new GoogleGenAI({
  apiKey: "AIzaSyDb8MhCkCyiTbVOnWKMlwUmOLwAMFafMuI",
});

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to send a message and get a response from Gemini
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to the conversation
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Call Gemini API directly using generateContent
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: userMessage.text,
      });

      const botMessage = { sender: "bot", text: response.text };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Handle errors from the Gemini call
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error retrieving response: " + error.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Send message on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "300px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "5px",
        zIndex: "1000",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#007bff",
          color: "#fff",
          padding: "10px",
          borderTopLeftRadius: "5px",
          borderTopRightRadius: "5px",
        }}
      >
        Chat with AI
      </div>

      {/* Message Area */}
      <div
        style={{
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          background: "#f9f9f9",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              textAlign: msg.sender === "bot" ? "left" : "right",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px",
                borderRadius: "5px",
                background: msg.sender === "bot" ? "#e1e1e1" : "#007bff",
                color: msg.sender === "bot" ? "#000" : "#fff",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div>Loading...</div>}
      </div>

      {/* Input Area */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ccc",
        }}
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            flex: 1,
            marginRight: "10px",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "3px",
          }}
        />
        <button onClick={sendMessage} style={{ padding: "8px 12px" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
