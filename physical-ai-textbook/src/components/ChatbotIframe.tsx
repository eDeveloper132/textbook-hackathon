import React, { useState, useRef, useEffect } from 'react';
import { getBackendUrl } from '../utils/featureFlags';

interface ChatbotIframeProps {
  selectionText?: string | null;
  onSelectionProcessed?: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatbotIframe({ 
  selectionText, 
  onSelectionProcessed 
}: ChatbotIframeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const backendUrl = getBackendUrl();

  // Handle selection text
  useEffect(() => {
    if (selectionText) {
      setInput(`Explain this: "${selectionText}"`);
      setIsOpen(true);
      onSelectionProcessed?.();
    }
  }, [selectionText, onSelectionProcessed]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer || 'Sorry, I could not process that request.' 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I could not connect to the server. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>🤖 AI Assistant</span>
            <button onClick={() => setIsOpen(false)} aria-label="Close chatbot">×</button>
          </div>
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chatbot-welcome">
                Hi! I'm your AI assistant for Physical AI & Robotics. Ask me anything about ROS2, simulation, or VLA models!
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-message assistant">
                <span className="typing-indicator">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              disabled={isLoading}
            />
            <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          className="chatbot-toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Open chatbot"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
        </button>
      )}
    </div>
  );
}
