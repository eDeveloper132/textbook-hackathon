import React, { useState, useCallback } from 'react';
import ChatbotIframe from '../components/ChatbotIframe';
import SelectionQuery from '../components/SelectionQuery';
import AuthGuard from '../components/AuthGuard';
import FeatureToolbar from '../components/FeatureToolbar';

interface Props {
  children: React.ReactNode;
}

export default function Root({ children }: Props): JSX.Element {
  const [selectionText, setSelectionText] = useState<string | null>(null);

  const handleSelectionQuery = useCallback((text: string) => {
    setSelectionText(text);
  }, []);

  const handleSelectionProcessed = useCallback(() => {
    setSelectionText(null);
  }, []);

  return (
    <AuthGuard>
      {children}
      <SelectionQuery onQuery={handleSelectionQuery} />
      <ChatbotIframe 
        selectionText={selectionText}
        onSelectionProcessed={handleSelectionProcessed}
      />
      <FeatureToolbar />
    </AuthGuard>
  );
}
