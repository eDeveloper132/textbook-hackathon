# Implementation Plan: Physical AI Textbook

**Branch**: `001-physical-ai-textbook` | **Date**: 2025-12-04 | **Spec**: [spec-001-physical-ai-textbook.md](./spec-001-physical-ai-textbook.md)

---

## Summary

Build a Docusaurus v3 interactive textbook on Physical AI & Humanoid Robotics with embedded RAG chatbot, deployed to GitHub Pages. Backend on Render/Fly.io free tier with FastAPI + Qdrant + Neon Postgres.

---

## Technical Context

| Attribute | Value |
|-----------|-------|
| **Frontend** | Docusaurus 3.0, React 18, TypeScript 5, MDX 3, Tailwind CSS |
| **Backend** | Python 3.11, FastAPI, Uvicorn |
| **Vector DB** | Qdrant Cloud (free 1GB) |
| **Postgres** | Neon (free 0.5GB) |
| **LLM** | OpenAI gpt-4o-mini |
| **Auth** | Better Auth (self-hosted) |
| **Deploy Frontend** | GitHub Pages |
| **Deploy Backend** | Render.com free tier |
| **Testing** | pytest (backend), Vitest (frontend) |
| **Performance** | <5s chatbot response, <8s translation |
| **Constraints** | <850 LOC, <2.5GB RAM build, zero paid services |

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Free Tools Only | ✅ | All free tiers verified |
| II. Minimal Codebase | ⚠️ | 850 LOC (ADR-001 pending) |
| III. ROS2/Gazebo/Isaac Focus | ✅ | Core content |
| IV. TDD | 🔲 | Tests first |
| V. Modular Architecture | ✅ | Feature flags for bonuses |
| VI. Simplicity First | ✅ | MVP phases |

---

## Project Structure

```
physical-ai-textbook/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Pages deploy
│
├── .specify/
│   ├── memory/
│   │   ├── constitution.md
│   │   ├── spec-001-physical-ai-textbook.md
│   │   ├── plan-001-physical-ai-textbook.md  # This file
│   │   └── adr-001-loc-limit-increase.md
│   └── docs-plus/                  # Claude Subagents (Bonus)
│       ├── ros-expert.md
│       ├── urdu-translator.md
│       ├── personalization-engine.md
│       └── quiz-generator.md
│
├── docs/                           # MDX Content (21 files)
│   ├── intro.mdx
│   ├── why-physical-ai.mdx
│   ├── learning-outcomes.mdx
│   ├── assessments.mdx
│   ├── module-1-ros2/
│   │   ├── _category_.json
│   │   ├── intro.mdx
│   │   ├── week-01-architecture.mdx
│   │   ├── week-02-topics-services.mdx
│   │   ├── week-03-launch-params.mdx
│   │   ├── week-04-tf2-urdf.mdx
│   │   └── week-05-navigation.mdx
│   ├── module-2-simulation/
│   │   ├── _category_.json
│   │   ├── week-06-gazebo.mdx
│   │   └── week-07-unity.mdx
│   ├── module-3-isaac/
│   │   ├── _category_.json
│   │   ├── week-08-isaac-basics.mdx
│   │   ├── week-09-isaac-ros.mdx
│   │   └── week-10-synthetic-data.mdx
│   └── module-4-vla/
│       ├── _category_.json
│       ├── week-11-vla-architecture.mdx
│       ├── week-12-finetuning.mdx
│       ├── week-13-deployment.mdx
│       └── capstone.mdx
│
├── src/
│   ├── components/
│   │   ├── ChatbotIframe.tsx       # ~40 LOC
│   │   ├── SelectionQuery.tsx      # ~35 LOC
│   │   ├── PersonalizeButton.tsx   # ~30 LOC (Bonus)
│   │   ├── UrduButton.tsx          # ~30 LOC (Bonus)
│   │   └── AuthGuard.tsx           # ~25 LOC (Bonus)
│   ├── hooks/
│   │   └── useTextSelection.ts     # ~20 LOC
│   ├── utils/
│   │   └── featureFlags.ts         # ~15 LOC
│   └── css/
│       └── custom.css              # Tailwind overrides
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI app (~60 LOC)
│   │   ├── rag.py                  # RAG logic (~80 LOC)
│   │   ├── auth.py                 # Better Auth (~50 LOC, Bonus)
│   │   ├── personalization.py      # Content adapt (~40 LOC, Bonus)
│   │   └── translation.py          # Urdu translate (~40 LOC, Bonus)
│   ├── tests/
│   │   ├── test_rag.py
│   │   ├── test_auth.py
│   │   └── test_translation.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── render.yaml                 # Render deploy config
│
├── scripts/
│   ├── index_content.py            # Index MDX to Qdrant (~50 LOC)
│   └── seed_quiz.py                # Seed quiz questions (~20 LOC)
│
├── docusaurus.config.ts
├── sidebars.ts
├── tailwind.config.js
├── package.json
└── README.md
```

---

## Architecture Diagrams

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Pages                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Docusaurus Static Site                      │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │  MDX     │ │ Chatbot  │ │Personalize│ │  Urdu    │   │    │
│  │  │ Content  │ │ Iframe   │ │  Button  │ │ Button   │   │    │
│  │  └──────────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │    │
│  └────────────────────┼────────────┼────────────┼──────────┘    │
└───────────────────────┼────────────┼────────────┼───────────────┘
                        │            │            │
                        ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Render.com (Free Tier)                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   FastAPI Backend                        │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │  /ask    │ │/ask-sel  │ │/personal │ │/translate│   │    │
│  │  │  (RAG)   │ │ection   │ │   ize    │ │          │   │    │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │    │
│  └───────┼────────────┼────────────┼────────────┼──────────┘    │
└──────────┼────────────┼────────────┼────────────┼───────────────┘
           │            │            │            │
     ┌─────┴────┐ ┌─────┴────┐ ┌─────┴────┐ ┌─────┴────┐
     ▼          ▼ ▼          ▼ ▼          ▼ ▼          ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Qdrant  │ │  Neon   │ │ OpenAI  │ │ Better  │
│ (1GB)   │ │ Postgres│ │gpt-4o-  │ │  Auth   │
│ Vectors │ │ (0.5GB) │ │  mini   │ │         │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
```

### Data Flow: RAG Chatbot

```
User Question
      │
      ▼
┌─────────────────┐
│ ChatbotIframe   │
│ (React)         │
└────────┬────────┘
         │ POST /api/ask
         ▼
┌─────────────────┐
│ FastAPI /ask    │
│                 │
│ 1. Embed query  │──────────────┐
│    (OpenAI)     │              │
│                 │              ▼
│ 2. Search       │────────► Qdrant
│    vectors      │◄──────── (top 5 chunks)
│                 │
│ 3. Build prompt │
│    with context │
│                 │
│ 4. Call LLM     │──────────────┐
│    (gpt-4o-mini)│              │
│                 │              ▼
│ 5. Return       │◄──────── OpenAI
│    response     │
└────────┬────────┘
         │
         ▼
   User sees answer
   with citations
```

### Data Flow: Selected Text Query

```
User selects text on page
         │
         ▼
┌─────────────────────────┐
│ window.getSelection()   │
│ captures selected text  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ SelectionQuery component│
│ shows floating button   │
└────────────┬────────────┘
             │ User clicks "Ask about this"
             ▼
┌─────────────────────────┐
│ postMessage to iframe   │
│ {type: 'selection',     │
│  text: selectedText}    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ ChatbotIframe receives  │
│ and sends to backend    │
└────────────┬────────────┘
             │ POST /api/ask-selection
             ▼
┌─────────────────────────┐
│ Backend uses selected   │
│ text AS context (no     │
│ vector search needed)   │
│                         │
│ Prompt: "Given this     │
│ text: {selection},      │
│ answer: {user_question}"│
└────────────┬────────────┘
             │
             ▼
       Response to user
```

---

## API Routes

### Base Routes (100 pts)

| Method | Route | Description | Request | Response |
|--------|-------|-------------|---------|----------|
| `POST` | `/api/ask` | RAG Q&A on full book | `{question: string}` | `{answer: string, sources: [{chapter, text}]}` |
| `POST` | `/api/ask-selection` | Q&A on selected text | `{question: string, selection: string}` | `{answer: string}` |
| `GET` | `/api/health` | Health check | - | `{status: "ok"}` |

### Bonus Routes (50 pts each)

| Method | Route | Description | Request | Response |
|--------|-------|-------------|---------|----------|
| `POST` | `/api/auth/register` | Email signup | `{email, password}` | `{user_id, token}` |
| `GET` | `/api/auth/github` | GitHub OAuth | - | Redirect |
| `POST` | `/api/auth/github/callback` | OAuth callback | `{code}` | `{user_id, token}` |
| `POST` | `/api/quiz/submit` | Submit quiz | `{user_id, answers: [{q_id, answer}]}` | `{score, level}` |
| `GET` | `/api/quiz/results/:user_id` | Get quiz results | - | `{score, level, answers}` |
| `POST` | `/api/personalize` | Personalize content | `{chapter_slug, user_id}` | `{content: string}` |
| `POST` | `/api/translate` | Translate to Urdu | `{chapter_slug}` | `{urdu_content: string}` |

---

## Database Schema (Neon Postgres)

```sql
-- Users table (Bonus: Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    github_id VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Quiz responses (Bonus: Auth)
CREATE TABLE quiz_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    question_id INTEGER NOT NULL,
    answer VARCHAR(50) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User levels derived from quiz (Bonus: Personalization)
CREATE TABLE user_levels (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    software_level VARCHAR(20) DEFAULT 'intermediate', -- beginner/intermediate/advanced
    hardware_level VARCHAR(20) DEFAULT 'intermediate',
    overall_level VARCHAR(20) DEFAULT 'intermediate',
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat history (Base)
CREATE TABLE chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),  -- NULL for anonymous
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    context_type VARCHAR(20) NOT NULL,  -- 'full' or 'selection'
    selection_text TEXT,                 -- Only for selection queries
    created_at TIMESTAMP DEFAULT NOW()
);

-- Urdu translation cache (Bonus: Translation)
CREATE TABLE urdu_cache (
    chapter_slug VARCHAR(100) PRIMARY KEY,
    urdu_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chat_history_user ON chat_history(user_id);
CREATE INDEX idx_quiz_responses_user ON quiz_responses(user_id);
```

---

## Qdrant Vector Schema

```json
{
  "collection_name": "textbook_chunks",
  "vectors": {
    "size": 1536,
    "distance": "Cosine"
  },
  "payload_schema": {
    "chapter_slug": "keyword",
    "chapter_title": "text",
    "week": "integer",
    "module": "integer",
    "chunk_index": "integer",
    "text": "text"
  }
}
```

**Chunking Strategy:**
- Split MDX by headers (##, ###)
- Max 500 tokens per chunk
- 50 token overlap
- Embed with `text-embedding-3-small`

---

## Iframe Chatbot Architecture

### Embedding Strategy

```tsx
// ChatbotIframe.tsx
export function ChatbotIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Listen for selection events from parent
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data.type === 'selection') {
        // Forward to chatbot UI
        setSelectionContext(e.data.text);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <iframe
        ref={iframeRef}
        src={`${BACKEND_URL}/chatbot`}
        className="w-96 h-[500px] rounded-lg shadow-xl"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
```

### Communication Protocol

```typescript
// Parent → Iframe messages
interface SelectionMessage {
  type: 'selection';
  text: string;
  pageUrl: string;
}

interface ClearMessage {
  type: 'clear';
}

// Iframe → Parent messages
interface ReadyMessage {
  type: 'ready';
}

interface ResizeMessage {
  type: 'resize';
  height: number;
}
```

---

## Selected Text Query Implementation

### Hook: useTextSelection

```typescript
// src/hooks/useTextSelection.ts (~20 LOC)
export function useTextSelection() {
  const [selection, setSelection] = useState<string | null>(null);
  const [position, setPosition] = useState<{x: number, y: number} | null>(null);

  useEffect(() => {
    const handleSelection = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim();
      
      if (text && text.length > 10) {
        const range = sel?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        setSelection(text);
        setPosition({ x: rect?.x ?? 0, y: rect?.y ?? 0 });
      } else {
        setSelection(null);
        setPosition(null);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  return { selection, position, clearSelection: () => setSelection(null) };
}
```

### Component: SelectionQuery

```tsx
// src/components/SelectionQuery.tsx (~35 LOC)
export function SelectionQuery() {
  const { selection, position, clearSelection } = useTextSelection();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleAsk = () => {
    // Send to chatbot iframe via postMessage
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'selection', text: selection },
      BACKEND_URL
    );
    clearSelection();
  };

  if (!selection || !position) return null;

  return (
    <div 
      className="fixed z-50 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg cursor-pointer"
      style={{ left: position.x, top: position.y - 40 }}
      onClick={handleAsk}
    >
      🔍 Ask about this
    </div>
  );
}
```

---

## Feature Flag System

```typescript
// src/utils/featureFlags.ts (~15 LOC)
export const FEATURES = {
  AUTH: process.env.NEXT_PUBLIC_FEATURE_AUTH === 'true',
  QUIZ: process.env.NEXT_PUBLIC_FEATURE_QUIZ === 'true',
  PERSONALIZATION: process.env.NEXT_PUBLIC_FEATURE_PERSONALIZATION === 'true',
  URDU_TRANSLATION: process.env.NEXT_PUBLIC_FEATURE_URDU === 'true',
} as const;

export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature] ?? false;
}

// Usage in components
export function PersonalizeButton() {
  if (!isFeatureEnabled('PERSONALIZATION')) return null;
  // ... rest of component
}
```

### Environment Variables

```bash
# .env.production (Base features only)
NEXT_PUBLIC_FEATURE_AUTH=false
NEXT_PUBLIC_FEATURE_QUIZ=false
NEXT_PUBLIC_FEATURE_PERSONALIZATION=false
NEXT_PUBLIC_FEATURE_URDU=false

# .env.production.bonus (All features)
NEXT_PUBLIC_FEATURE_AUTH=true
NEXT_PUBLIC_FEATURE_QUIZ=true
NEXT_PUBLIC_FEATURE_PERSONALIZATION=true
NEXT_PUBLIC_FEATURE_URDU=true
```

---

## Claude Subagent Registry

### Location: `.specify/docs-plus/`

| Subagent | File | Purpose |
|----------|------|---------|
| ROS Expert | `ros-expert.md` | Answer ROS2-specific questions with code examples |
| Urdu Translator | `urdu-translator.md` | Technical Urdu translation with terminology consistency |
| Personalization Engine | `personalization-engine.md` | Adapt content complexity based on user level |
| Quiz Generator | `quiz-generator.md` | Generate quiz questions from chapter content |

### Subagent Definition Format

```markdown
# Subagent: [NAME]

## Identity
[Role description]

## Capabilities
- [Capability 1]
- [Capability 2]

## Input Format
```json
{
  "task": "string",
  "context": "string",
  "parameters": {}
}
```

## Output Format
```json
{
  "result": "string",
  "confidence": "number",
  "sources": []
}
```

## Example Interactions
[Examples]

## Constraints
- [Constraint 1]
- [Constraint 2]
```

---

## LOC Budget

| Component | File(s) | Est. LOC | Actual |
|-----------|---------|----------|--------|
| **Frontend** | | **195** | |
| ChatbotIframe.tsx | 1 | 40 | |
| SelectionQuery.tsx | 1 | 35 | |
| useTextSelection.ts | 1 | 20 | |
| featureFlags.ts | 1 | 15 | |
| PersonalizeButton.tsx | 1 | 30 | |
| UrduButton.tsx | 1 | 30 | |
| AuthGuard.tsx | 1 | 25 | |
| **Backend** | | **270** | |
| main.py | 1 | 60 | |
| rag.py | 1 | 80 | |
| auth.py | 1 | 50 | |
| personalization.py | 1 | 40 | |
| translation.py | 1 | 40 | |
| **Scripts** | | **70** | |
| index_content.py | 1 | 50 | |
| seed_quiz.py | 1 | 20 | |
| **Config** | | **50** | |
| docusaurus.config.ts | 1 | 50 | |
| **Subagents** | | **100** | |
| 4 subagent files | 4 | 100 | |
| **Tests** | | **165** | |
| Backend tests | 3 | 100 | |
| Frontend tests | 2 | 65 | |
| **TOTAL** | | **850** | |

---

## Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      
      - name: Install & Build
        run: |
          npm ci
          npm run build
        env:
          NEXT_PUBLIC_BACKEND_URL: ${{ secrets.BACKEND_URL }}
          NEXT_PUBLIC_FEATURE_AUTH: ${{ vars.FEATURE_AUTH }}
          NEXT_PUBLIC_FEATURE_QUIZ: ${{ vars.FEATURE_QUIZ }}
          NEXT_PUBLIC_FEATURE_PERSONALIZATION: ${{ vars.FEATURE_PERSONALIZATION }}
          NEXT_PUBLIC_FEATURE_URDU: ${{ vars.FEATURE_URDU }}
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

---

## Implementation Order

| Phase | Points | Dependencies | Est. Time |
|-------|--------|--------------|-----------|
| 1. Docusaurus + Content | 40 | None | 4h |
| 2. RAG Backend | 40 | Phase 1 | 3h |
| 3. Chatbot Iframe | 20 | Phase 2 | 2h |
| 4. Selected Text Query | - | Phase 3 | 1h |
| 5. Auth + Quiz (Bonus) | 50 | Phase 2 | 3h |
| 6. Personalization (Bonus) | 50 | Phase 5 | 2h |
| 7. Urdu Translation (Bonus) | 50 | Phase 2 | 2h |
| 8. Subagents (Bonus) | 50 | None | 1h |
| **Total** | **300** | | **18h** |

---

**Plan Version**: 1.0.0 | **Author**: Architect | **Date**: 2025-12-04
