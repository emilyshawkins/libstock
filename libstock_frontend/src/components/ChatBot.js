import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ChatBot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! How can I help you with your library needs today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError(null);

    try {
      // Call our backend service
      const response = await axios.post(
        "http://localhost:8080/api/chatbot/message",
        {
          messages: [...messages, userMessage],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          // Add timeout to prevent hanging requests
          timeout: 10000,
        }
      );

      // Add assistant response to chat
      const assistantMessage = {
        role: "assistant",
        content: response.data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling chatbot service:", error);

      let errorMessage =
        "Sorry, I encountered an error. Please try again later.";

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);

        if (error.response.status === 404) {
          errorMessage =
            "The chatbot service is not available. Please try again later.";
        } else if (error.response.status === 500) {
          errorMessage = "There was a server error. Please try again later.";
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        errorMessage =
          "Could not connect to the chatbot service. Please check your connection and try again.";
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
      }

      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <div className="chatbot-button" onClick={() => setIsOpen(true)}>
          <span className="chatbot-icon">💬</span>
          <span className="chatbot-text">Need help?</span>
        </div>
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Library Assistant</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.role === "user" ? "user-message" : "assistant-message"
                }`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="message assistant-message loading">
                <span className="typing-indicator">...</span>
              </div>
            )}
            {error && <div className="error-message">{error}</div>}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
