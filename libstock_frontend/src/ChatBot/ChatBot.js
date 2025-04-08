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

    try {
      // Call OpenAI API
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful library assistant for LibStock, a library management system. You can help users with questions about books, borrowing, returns, and general library services. Keep your responses concise and friendly.",
            },
            ...messages,
            userMessage,
          ],
          max_tokens: 150,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`,
          },
        }
      );

      // Add assistant response to chat
      const assistantMessage = {
        role: "assistant",
        content: response.data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
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
