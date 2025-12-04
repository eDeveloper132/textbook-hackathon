import React, { useState, useRef, useEffect } from 'react';
import { getBackendUrl } from '../utils/featureFlags';

interface ChatbotIframeProps {
  selectionText?: string | null;
  onSelectionProcessed?: () => void;
}

export default function ChatbotIframe({ 
  selectionText, 
  onSelectionProcessed 
}: ChatbotIframeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const backendUrl = getBackendUrl();

  // Send selection to iframe when it changes
  useEffect(() => {
    if (selectionText && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'selection', text: selectionText },
        backendUrl
      );
      setIsOpen(true);
      onSelectionProcessed?.();
    }
  }, [selectionText, backendUrl, onSelectionProcessed]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== backendUrl) return;
      
      if (event.data.type === 'resize') {
        // Handle iframe resize requests
      } else if (event.data.type === 'close') {
        setIsOpen(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [backendUrl]);

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: -12,
              right: -12,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: 16,
              zIndex: 1,
            }}
            aria-label="Close chatbot"
          >
            ×
          </button>
          <iframe
            ref={iframeRef}
            src={`${backendUrl}/chatbot`}
            className="chatbot-iframe"
            title="AI Chatbot"
            allow="clipboard-read; clipboard-write"
          />
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
