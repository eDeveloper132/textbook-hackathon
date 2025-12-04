// Feature flags for bonus features
// Controlled via environment variables

declare global {
  interface Window {
    __DOCUSAURUS_CUSTOM_FIELDS__?: {
      backendUrl?: string;
      featureAuth?: boolean;
      featureQuiz?: boolean;
      featurePersonalization?: boolean;
      featureUrdu?: boolean;
    };
  }
}

export const FEATURES = {
  AUTH: typeof window !== 'undefined' 
    ? window.__DOCUSAURUS_CUSTOM_FIELDS__?.featureAuth === true
    : process.env.REACT_APP_FEATURE_AUTH === 'true',
  QUIZ: typeof window !== 'undefined'
    ? window.__DOCUSAURUS_CUSTOM_FIELDS__?.featureQuiz === true
    : process.env.REACT_APP_FEATURE_QUIZ === 'true',
  PERSONALIZATION: typeof window !== 'undefined'
    ? window.__DOCUSAURUS_CUSTOM_FIELDS__?.featurePersonalization === true
    : process.env.REACT_APP_FEATURE_PERSONALIZATION === 'true',
  URDU_TRANSLATION: typeof window !== 'undefined'
    ? window.__DOCUSAURUS_CUSTOM_FIELDS__?.featureUrdu === true
    : process.env.REACT_APP_FEATURE_URDU === 'true',
} as const;

export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature] ?? false;
}

export function getBackendUrl(): string {
  if (typeof window !== 'undefined') {
    return window.__DOCUSAURUS_CUSTOM_FIELDS__?.backendUrl 
      || 'https://physical-ai-backend.onrender.com';
  }
  return process.env.REACT_APP_BACKEND_URL || 'https://physical-ai-backend.onrender.com';
}
