import React, { useState } from 'react';
import { isFeatureEnabled, getBackendUrl } from '../utils/featureFlags';

interface PersonalizeButtonProps {
  chapterSlug: string;
  onPersonalized?: (content: string) => void;
}

export default function PersonalizeButton({ 
  chapterSlug, 
  onPersonalized 
}: PersonalizeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Feature flag check
  if (!isFeatureEnabled('PERSONALIZATION')) {
    return null;
  }

  const handlePersonalize = async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Please log in to personalize content');
        return;
      }

      const response = await fetch(`${getBackendUrl()}/api/personalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter_slug: chapterSlug, user_id: userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to personalize content');
      }

      const data = await response.json();
      onPersonalized?.(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button
        onClick={handlePersonalize}
        disabled={loading}
        style={{
          padding: '0.5rem 1rem',
          background: loading ? '#9ca3af' : '#8b5cf6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem',
        }}
      >
        {loading ? '⏳ Personalizing...' : '✨ Personalize this chapter'}
      </button>
      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}
