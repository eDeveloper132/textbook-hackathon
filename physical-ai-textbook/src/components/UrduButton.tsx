import React, { useState } from 'react';
import { isFeatureEnabled, getBackendUrl } from '../utils/featureFlags';

interface UrduButtonProps {
  chapterSlug: string;
  onTranslated?: (content: string) => void;
}

export default function UrduButton({ chapterSlug, onTranslated }: UrduButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUrdu, setIsUrdu] = useState(false);

  // Feature flag check
  if (!isFeatureEnabled('URDU_TRANSLATION')) {
    return null;
  }

  const handleTranslate = async () => {
    if (isUrdu) {
      // Toggle back to English - reload page
      window.location.reload();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${getBackendUrl()}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter_slug: chapterSlug }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      onTranslated?.(data.urdu_content);
      setIsUrdu(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button
        onClick={handleTranslate}
        disabled={loading}
        style={{
          padding: '0.5rem 1rem',
          background: loading ? '#9ca3af' : '#059669',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem',
          fontFamily: isUrdu ? 'Noto Nastaliq Urdu, serif' : 'inherit',
        }}
      >
        {loading ? '⏳ ترجمہ ہو رہا ہے...' : isUrdu ? '🔄 English' : '🇵🇰 اردو میں ترجمہ کریں'}
      </button>
      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}
