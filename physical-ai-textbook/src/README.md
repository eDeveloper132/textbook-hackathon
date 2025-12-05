# 🎨 Frontend Source Code

React/TypeScript source code for the Physical AI Textbook frontend.

## 📁 Structure

```
src/
├── components/           # Reusable React components
│   ├── AuthGuard.tsx     # Authentication wrapper & login modal
│   ├── ChatbotIframe.tsx # Embedded RAG chatbot
│   ├── FeatureToolbar.tsx # Quiz, translate, personalize toolbar
│   ├── PersonalizeButton.tsx # Content personalization trigger
│   ├── SelectionQuery.tsx # Text selection Q&A popup
│   ├── UrduButton.tsx    # Urdu translation button
│   └── HomepageFeatures/ # Homepage feature cards
│
├── css/                  # Global styles
│   └── custom.css        # Theme overrides & custom styles
│
├── hooks/                # Custom React hooks
│
├── pages/                # Custom pages (non-docs)
│   └── index.tsx         # Homepage
│
├── theme/                # Docusaurus theme customization
│   └── DocItem/          # Doc page wrapper with features
│
├── utils/                # Utility functions
│   └── featureFlags.ts   # Feature toggle logic & backend URL
│
└── __tests__/            # Jest test files
```

## 🧩 Key Components

### AuthGuard.tsx
Wraps the app to provide authentication:
- Login/Register modal
- JWT token management
- User state (email, level)
- 60-second timeout for Render cold starts

### ChatbotIframe.tsx
Embedded chatbot for RAG Q&A:
- Floating chat button
- Expandable chat window
- Sends questions to `/api/ask`

### FeatureToolbar.tsx
Toolbar appearing on doc pages:
- 📊 Quiz button → Background assessment
- 🇵🇰 Translate → Urdu translation
- 🎯 Personalize → Adapt content to level

### SelectionQuery.tsx
Text selection popup:
- Detects text selection
- Shows "Ask about this" button
- Sends to `/api/ask-selection`

## 🔧 Feature Flags

Located in `utils/featureFlags.ts`:

```typescript
export const FEATURES = {
  AUTH: true,
  QUIZ: true,
  PERSONALIZATION: true,
  URDU_TRANSLATION: true,
};

export function getBackendUrl(): string {
  return 'https://physical-ai-textbook-api.onrender.com';
}
```

Toggle features by editing the boolean values.

## 🎨 Styling

- **CSS Variables**: Use Docusaurus CSS variables for theming
- **Dark Mode**: All components support dark mode via CSS variables
- **Responsive**: Mobile-first responsive design

### Key CSS Variables

```css
--ifm-color-primary: #2e8555;
--ifm-background-color: #ffffff;
--ifm-font-color-base: #1c1e21;
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 📦 Adding New Components

1. Create component in `src/components/`
2. Use TypeScript with proper interfaces
3. Support dark mode via CSS variables
4. Add to appropriate wrapper (DocItem, Layout, etc.)

### Component Template

```tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="my-component">
      <h3>{title}</h3>
      <button onClick={onAction}>Action</button>
      
      <style>{`
        .my-component {
          padding: 1rem;
          background: var(--ifm-background-color);
          color: var(--ifm-font-color-base);
        }
      `}</style>
    </div>
  );
}
```

---

Part of the [Physical AI Textbook](../README.md) project
