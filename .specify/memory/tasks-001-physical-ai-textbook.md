# Tasks: Physical AI Textbook

**Input**: Design documents from `.specify/memory/`
**Prerequisites**: spec-001-physical-ai-textbook.md, plan-001-physical-ai-textbook.md
**Date**: 2025-12-04

---

## Task Legend

- **[P]** = Can run in parallel (no dependencies)
- **[S]** = Serial (must wait for dependencies)
- **[BONUS]** = Optional bonus feature (+50 pts each)
- **[US#]** = User Story reference

---

## Phase 1: Setup (Foundation)

**Purpose**: Project initialization - BLOCKS all other work
**Est. Time**: 1h

- [ ] T001 [S] Initialize Docusaurus v3 project: `npx create-docusaurus@latest physical-ai-textbook classic --typescript`
- [ ] T002 [S] Configure `docusaurus.config.ts` with GitHub Pages settings, dark mode, Mermaid plugin
- [ ] T003 [P] Install Tailwind CSS: `npm install tailwindcss postcss autoprefixer && npx tailwindcss init`
- [ ] T004 [P] Create `src/css/custom.css` with Tailwind imports and dark mode styles
- [ ] T005 [P] Configure `sidebars.ts` for 4-module structure
- [ ] T006 [P] Create `.github/workflows/deploy.yml` for GitHub Pages deployment
- [ ] T007 [P] Create `src/utils/featureFlags.ts` (~15 LOC)
- [ ] T008 [P] Create `.env.example` with all feature flag variables

**Checkpoint**: `npm run build` succeeds, deploys to GitHub Pages

---

## Phase 2: MDX Content (Parallel Batch)

**Purpose**: All 21 MDX files - can be written in parallel
**Est. Time**: 4h (parallelizable)

### Intro Section [P]

- [ ] T009 [P] [US1] Create `docs/intro.mdx` - Course overview, prerequisites
- [ ] T010 [P] [US1] Create `docs/why-physical-ai.mdx` - Motivation, industry trends
- [ ] T011 [P] [US1] Create `docs/learning-outcomes.mdx` - Skills matrix, competencies
- [ ] T012 [P] [US1] Create `docs/assessments.mdx` - Grading rubric, capstone criteria

### Module 1: ROS2 [P]

- [ ] T013 [P] [US1] Create `docs/module-1-ros2/_category_.json` - Module metadata
- [ ] T014 [P] [US1] Create `docs/module-1-ros2/intro.mdx` - ROS2 overview, setup
- [ ] T015 [P] [US1] Create `docs/module-1-ros2/week-01-architecture.mdx` - Nodes, executors, DDS
- [ ] T016 [P] [US1] Create `docs/module-1-ros2/week-02-topics-services.mdx` - Pub/sub, request/reply
- [ ] T017 [P] [US1] Create `docs/module-1-ros2/week-03-launch-params.mdx` - Launch files, parameters
- [ ] T018 [P] [US1] Create `docs/module-1-ros2/week-04-tf2-urdf.mdx` - Transforms, robot description
- [ ] T019 [P] [US1] Create `docs/module-1-ros2/week-05-navigation.mdx` - Nav2 stack basics

### Module 2: Simulation [P]

- [ ] T020 [P] [US1] Create `docs/module-2-simulation/_category_.json`
- [ ] T021 [P] [US1] Create `docs/module-2-simulation/week-06-gazebo.mdx` - Gazebo Classic & Ignition
- [ ] T022 [P] [US1] Create `docs/module-2-simulation/week-07-unity.mdx` - Unity Robotics Hub

### Module 3: NVIDIA Isaac [P]

- [ ] T023 [P] [US1] Create `docs/module-3-isaac/_category_.json`
- [ ] T024 [P] [US1] Create `docs/module-3-isaac/week-08-isaac-basics.mdx` - Isaac Sim setup
- [ ] T025 [P] [US1] Create `docs/module-3-isaac/week-09-isaac-ros.mdx` - Isaac ROS integration
- [ ] T026 [P] [US1] Create `docs/module-3-isaac/week-10-synthetic-data.mdx` - Domain randomization

### Module 4: VLA [P]

- [ ] T027 [P] [US1] Create `docs/module-4-vla/_category_.json`
- [ ] T028 [P] [US1] Create `docs/module-4-vla/week-11-vla-architecture.mdx` - Vision-Language-Action models
- [ ] T029 [P] [US1] Create `docs/module-4-vla/week-12-finetuning.mdx` - Transfer learning for robotics
- [ ] T030 [P] [US1] Create `docs/module-4-vla/week-13-deployment.mdx` - Edge deployment
- [ ] T031 [P] [US1] Create `docs/module-4-vla/capstone.mdx` - End-to-end project spec

**Checkpoint**: All 21 MDX files render, navigation works, Mermaid diagrams display

---

## Phase 3: FastAPI Backend (Serial)

**Purpose**: RAG backend infrastructure
**Est. Time**: 3h

### Backend Setup

- [ ] T032 [S] Create `backend/` directory structure per plan
- [ ] T033 [S] Create `backend/requirements.txt`:
  ```
  fastapi==0.109.0
  uvicorn==0.27.0
  openai==1.12.0
  qdrant-client==1.7.0
  psycopg2-binary==2.9.9
  python-dotenv==1.0.0
  ```
- [ ] T034 [S] Create `backend/app/__init__.py`
- [ ] T035 [S] Create `backend/app/main.py` - FastAPI app with CORS, health endpoint (~60 LOC)

### RAG Implementation

- [ ] T036 [S] [US2] Create `backend/app/rag.py` - RAG logic (~80 LOC):
  - `embed_query()` - OpenAI text-embedding-3-small
  - `search_vectors()` - Qdrant similarity search
  - `build_prompt()` - Context injection
  - `generate_answer()` - gpt-4o-mini completion
- [ ] T037 [S] [US2] Add `/api/ask` endpoint in `main.py`
- [ ] T038 [S] [US3] Add `/api/ask-selection` endpoint in `main.py`

### Database Setup

- [ ] T039 [S] Create Neon Postgres database (free tier)
- [ ] T040 [S] Create `backend/app/db.py` - Connection pool, query helpers (~30 LOC)
- [ ] T041 [S] Run SQL schema from plan (users, chat_history, quiz_responses, user_levels, urdu_cache)

### Qdrant Setup

- [ ] T042 [S] Create Qdrant Cloud collection `textbook_chunks` (free tier)
- [ ] T043 [S] Create `scripts/index_content.py` - MDX chunking & embedding (~50 LOC)
- [ ] T044 [S] Run indexing script to populate Qdrant with all MDX content

### Deployment

- [ ] T045 [S] Create `backend/Dockerfile`
- [ ] T046 [S] Create `backend/render.yaml` for Render.com deployment
- [ ] T047 [S] Deploy backend to Render.com free tier
- [ ] T048 [S] Verify `/api/health` and `/api/ask` work in production

**Checkpoint**: `curl -X POST https://api.../api/ask -d '{"question":"What is ROS2?"}'` returns answer

---

## Phase 4: Chatbot Iframe (Serial)

**Purpose**: Frontend chatbot integration
**Est. Time**: 2h

- [ ] T049 [S] [US2] Create `src/components/ChatbotIframe.tsx` (~40 LOC):
  - Floating iframe container
  - postMessage listener for selection events
  - Toggle open/close button
- [ ] T050 [S] [US2] Create `src/hooks/useTextSelection.ts` (~20 LOC):
  - `window.getSelection()` capture
  - Position tracking for floating button
- [ ] T051 [S] [US3] Create `src/components/SelectionQuery.tsx` (~35 LOC):
  - Floating "Ask about this" button
  - postMessage to iframe with selected text
- [ ] T052 [S] [US2] Register components in `src/theme/Root.tsx` (Docusaurus wrapper)
- [ ] T053 [S] [US2] Update `docusaurus.config.ts` to include chatbot on all pages
- [ ] T054 [S] Test full flow: select text → click button → see answer in chatbot

**Checkpoint**: RAG chatbot works on deployed site, both full Q&A and selected-text modes

---

## Phase 5: Auth & Quiz [BONUS] (+50 pts)

**Purpose**: User authentication and background quiz
**Est. Time**: 3h

### Backend Auth

- [ ] T055 [S] [BONUS] [US4] Create `backend/app/auth.py` (~50 LOC):
  - Email/password registration with bcrypt
  - GitHub OAuth flow
  - JWT token generation
- [ ] T056 [S] [BONUS] [US4] Add auth routes to `main.py`:
  - `POST /api/auth/register`
  - `GET /api/auth/github`
  - `POST /api/auth/github/callback`
  - `GET /api/auth/me`

### Quiz System

- [ ] T057 [S] [BONUS] [US4] Create `scripts/seed_quiz.py` - 10 background questions (~20 LOC)
- [ ] T058 [S] [BONUS] [US4] Add quiz routes to `main.py`:
  - `GET /api/quiz/questions`
  - `POST /api/quiz/submit`
  - `GET /api/quiz/results/:user_id`
- [ ] T059 [S] [BONUS] [US4] Implement quiz scoring logic → compute `user_levels` (beginner/intermediate/advanced)

### Frontend Auth

- [ ] T060 [S] [BONUS] [US4] Create `src/components/AuthGuard.tsx` (~25 LOC):
  - Login/signup modal
  - GitHub OAuth button
  - Quiz flow after signup
- [ ] T061 [S] [BONUS] [US4] Add auth state management (React context or localStorage)
- [ ] T062 [S] [BONUS] [US4] Gate quiz behind auth, store results

**Checkpoint**: User can sign up → complete quiz → see level assigned

---

## Phase 6: Personalization [BONUS] (+50 pts)

**Purpose**: Adaptive content based on user level
**Est. Time**: 2h

- [ ] T063 [S] [BONUS] [US5] Create `backend/app/personalization.py` (~40 LOC):
  - Fetch user level from DB
  - Prompt gpt-4o-mini to rewrite content at appropriate level
  - Cache personalized content
- [ ] T064 [S] [BONUS] [US5] Add `/api/personalize` endpoint:
  - Request: `{chapter_slug, user_id}`
  - Response: `{content: "personalized markdown"}`
- [ ] T065 [S] [BONUS] [US5] Create `src/components/PersonalizeButton.tsx` (~30 LOC):
  - "Personalize this chapter" button
  - Loading state while LLM processes
  - Replace content in-place
- [ ] T066 [S] [BONUS] [US5] Wrap with feature flag check: `isFeatureEnabled('PERSONALIZATION')`

**Checkpoint**: Beginner user clicks Personalize → sees simplified content

---

## Phase 7: Urdu Translation [BONUS] (+50 pts)

**Purpose**: On-demand Urdu translation with caching
**Est. Time**: 2h

- [ ] T067 [S] [BONUS] [US6] Create `backend/app/translation.py` (~40 LOC):
  - Check `urdu_cache` table first
  - If miss, call gpt-4o-mini for translation
  - Store in cache for future requests
- [ ] T068 [S] [BONUS] [US6] Add `/api/translate` endpoint:
  - Request: `{chapter_slug}`
  - Response: `{urdu_content: "..."}`
- [ ] T069 [S] [BONUS] [US6] Create `src/components/UrduButton.tsx` (~30 LOC):
  - "اردو میں ترجمہ کریں" button
  - Loading spinner (target <8s)
  - RTL text rendering
- [ ] T070 [S] [BONUS] [US6] Wrap with feature flag check: `isFeatureEnabled('URDU_TRANSLATION')`

**Checkpoint**: Click Urdu button → chapter displays in Urdu within 8 seconds

---

## Phase 8: Claude Subagents [BONUS] (+50 pts)

**Purpose**: Reusable AI agent definitions
**Est. Time**: 1h

- [ ] T071 [P] [BONUS] [US7] Create `.specify/docs-plus/ros-expert.md`:
  - Identity: ROS2 domain expert
  - Capabilities: Code generation, debugging, best practices
  - Example interactions
- [ ] T072 [P] [BONUS] [US7] Create `.specify/docs-plus/urdu-translator.md`:
  - Identity: Technical Urdu translator
  - Capabilities: Preserve code blocks, consistent terminology
  - Glossary of robotics terms in Urdu
- [ ] T073 [P] [BONUS] [US7] Create `.specify/docs-plus/personalization-engine.md`:
  - Identity: Adaptive content writer
  - Capabilities: Adjust complexity, add/remove examples
  - Level definitions (beginner/intermediate/advanced)
- [ ] T074 [P] [BONUS] [US7] Create `.specify/docs-plus/quiz-generator.md`:
  - Identity: Assessment designer
  - Capabilities: Generate MCQs from content
  - Bloom's taxonomy alignment

**Checkpoint**: 4 subagent files present with complete definitions

---

## Phase 9: Testing & Polish

**Purpose**: Quality assurance and final touches
**Est. Time**: 2h

### Backend Tests

- [ ] T075 [P] Create `backend/tests/test_rag.py`:
  - Test `/api/ask` returns answer with sources
  - Test `/api/ask-selection` uses selection as context
- [ ] T076 [P] [BONUS] Create `backend/tests/test_auth.py`:
  - Test registration flow
  - Test JWT validation
- [ ] T077 [P] [BONUS] Create `backend/tests/test_translation.py`:
  - Test cache hit/miss behavior
  - Test <8s response time

### Frontend Tests

- [ ] T078 [P] Create `src/__tests__/ChatbotIframe.test.tsx`:
  - Test postMessage handling
  - Test toggle behavior
- [ ] T079 [P] Create `src/__tests__/SelectionQuery.test.tsx`:
  - Test selection detection
  - Test button positioning

### Final Polish

- [ ] T080 [S] Verify LOC count: `cloc --exclude-dir=node_modules,build,.docusaurus .`
- [ ] T081 [S] Test mobile responsiveness (375px width)
- [ ] T082 [S] Test dark mode on all pages
- [ ] T083 [S] Update README.md with setup instructions
- [ ] T084 [S] Final deploy to GitHub Pages with all features enabled

**Checkpoint**: All tests pass, LOC < 850, site live and fully functional

---

## Execution Summary

### Parallel Opportunities

```
Phase 2 (MDX Content):
├── T009-T012 (Intro) ─────────────┐
├── T013-T019 (Module 1: ROS2) ────┼── All 21 files in parallel
├── T020-T022 (Module 2: Sim) ─────┤
├── T023-T026 (Module 3: Isaac) ───┤
└── T027-T031 (Module 4: VLA) ─────┘

Phase 8 (Subagents):
├── T071 (ros-expert.md) ──────────┐
├── T072 (urdu-translator.md) ─────┼── All 4 in parallel
├── T073 (personalization.md) ─────┤
└── T074 (quiz-generator.md) ──────┘

Phase 9 (Tests):
├── T075-T077 (Backend tests) ─────┐
└── T078-T079 (Frontend tests) ────┴── All in parallel
```

### Serial Dependencies

```
T001 (Init) 
  → T002 (Config) 
    → T032 (Backend setup)
      → T035 (main.py)
        → T036 (rag.py)
          → T049 (ChatbotIframe)
            → T054 (Test flow)

[BONUS] Auth chain:
T055 (auth.py) → T056 (routes) → T060 (AuthGuard)

[BONUS] Personalization chain:
T063 (personalization.py) → T064 (endpoint) → T065 (button)

[BONUS] Translation chain:
T067 (translation.py) → T068 (endpoint) → T069 (button)
```

### Time Estimates

| Phase | Tasks | Est. Time | Parallel? |
|-------|-------|-----------|-----------|
| 1. Setup | T001-T008 | 1h | Partial |
| 2. MDX Content | T009-T031 | 4h | ✅ Full |
| 3. Backend | T032-T048 | 3h | Serial |
| 4. Chatbot | T049-T054 | 2h | Serial |
| 5. Auth [BONUS] | T055-T062 | 3h | Serial |
| 6. Personalize [BONUS] | T063-T066 | 2h | Serial |
| 7. Urdu [BONUS] | T067-T070 | 2h | Serial |
| 8. Subagents [BONUS] | T071-T074 | 1h | ✅ Full |
| 9. Testing | T075-T084 | 2h | Partial |
| **Total** | **84 tasks** | **20h** | |

### Points Breakdown

| Deliverable | Tasks | Points |
|-------------|-------|--------|
| Docusaurus + Content | T001-T031 | 40 |
| RAG Backend + Chatbot | T032-T054 | 60 |
| **Base Total** | | **100** |
| Auth + Quiz [BONUS] | T055-T062 | 50 |
| Personalization [BONUS] | T063-T066 | 50 |
| Urdu Translation [BONUS] | T067-T070 | 50 |
| Subagents [BONUS] | T071-T074 | 50 |
| **Bonus Total** | | **200** |
| **Grand Total** | | **300** |

---

**Tasks Version**: 1.0.0 | **Author**: Architect | **Date**: 2025-12-04
