# 🧩 React Components

Reusable React components for the Physical AI Textbook.

## 📁 Components

| Component | Description | Props |
|-----------|-------------|-------|
| `AuthGuard.tsx` | Authentication wrapper with login modal | `children` |
| `ChatbotIframe.tsx` | Floating RAG chatbot | - |
| `FeatureToolbar.tsx` | Quiz/Translate/Personalize toolbar | - |
| `PersonalizeButton.tsx` | Content personalization button | `chapterSlug`, `content` |
| `SelectionQuery.tsx` | Text selection Q&A popup | - |
| `UrduButton.tsx` | Urdu translation button | `chapterSlug`, `content` |
| `HomepageFeatures/` | Homepage feature cards | - |

## 🔄 Component Flow

```
┌─────────────────────────────────────────────────────────┐
│                      AuthGuard                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │                   DocItem                         │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │              FeatureToolbar                 │  │  │
│  │  │  [Quiz] [Translate] [Personalize]          │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │           Page Content (MDX)                │  │  │
│  │  │                                             │  │  │
│  │  │   SelectionQuery (on text select)          │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              ChatbotIframe (floating)             │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 📋 Component Details

### AuthGuard.tsx

**Purpose**: Manages user authentication state

**Features**:
- Login/Register modal with email/password
- JWT token storage in localStorage
- 60-second timeout for Render cold starts
- User level display (Beginner/Intermediate/Advanced)

**Usage**:
```tsx
<AuthGuard>
  <App />
</AuthGuard>
```

### ChatbotIframe.tsx

**Purpose**: RAG-powered Q&A chatbot

**Features**:
- Floating button in bottom-right
- Expandable chat window
- Sends questions to `/api/ask`
- Displays AI responses with sources

### FeatureToolbar.tsx

**Purpose**: Access to bonus features

**Buttons**:
- 📊 **Quiz**: Opens 10-question assessment modal
- 🇵🇰 **Translate**: Converts page to Urdu
- 🎯 **Personalize**: Adapts content to user level

### PersonalizeButton.tsx

**Purpose**: Trigger content personalization

**Props**:
```typescript
interface Props {
  chapterSlug: string;  // Current chapter identifier
  content: string;      // Raw MDX content
}
```

**API Call**: `POST /api/personalize`

### SelectionQuery.tsx

**Purpose**: Ask questions about selected text

**Behavior**:
1. User selects text on page
2. Popup appears with "Ask about this" button
3. Opens input for question
4. Sends selection + question to `/api/ask-selection`

### UrduButton.tsx

**Purpose**: Translate content to Urdu

**Props**:
```typescript
interface Props {
  chapterSlug: string;
  content: string;
}
```

**API Call**: `POST /api/translate`

## 🎨 Styling Guidelines

All components use inline styles with CSS variables:

```tsx
<style>{`
  .component {
    background: var(--ifm-background-color);
    color: var(--ifm-font-color-base);
    border: 1px solid var(--ifm-color-emphasis-300);
  }
`}</style>
```

This ensures dark mode compatibility.

## 🧪 Testing

Each component should have tests in `src/__tests__/`:

```bash
npm test -- --testPathPattern=ComponentName
```

---

Part of the [Physical AI Textbook](../../README.md) project
