// Feature flags for bonus features
// Uses Docusaurus customFields from docusaurus.config.ts

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// For use in React components (hooks)
export function useFeatures() {
  try {
    const { siteConfig } = useDocusaurusContext();
    const customFields = siteConfig.customFields || {};
    return {
      AUTH: customFields.featureAuth === true,
      QUIZ: customFields.featureQuiz === true,
      PERSONALIZATION: customFields.featurePersonalization === true,
      URDU_TRANSLATION: customFields.featureUrdu === true,
    };
  } catch {
    // Fallback if context not available
    return {
      AUTH: true,
      QUIZ: true,
      PERSONALIZATION: true,
      URDU_TRANSLATION: true,
    };
  }
}

// For non-hook usage (always returns true for demo)
export const FEATURES = {
  AUTH: true,
  QUIZ: true,
  PERSONALIZATION: true,
  URDU_TRANSLATION: true,
} as const;

export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature] ?? false;
}

export function getBackendUrl(): string {
  // Always use deployed backend for now
  // To test locally, uncomment the localhost check below:
  // if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  //   return 'http://localhost:8000';
  // }
  return 'https://physical-ai-textbook-api.onrender.com';
}
