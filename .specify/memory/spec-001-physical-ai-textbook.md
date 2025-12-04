# Feature Specification: Physical AI & Humanoid Robotics Textbook

**Feature Branch**: `001-physical-ai-textbook`  
**Created**: 2025-12-04  
**Status**: Approved  
**Version**: 1.0.0  
**Input**: User description: "Docusaurus textbook on Physical AI & Humanoid Robotics with RAG chatbot"

---

## Overview

Free, open-source, GitHub Pages-deployable Docusaurus v3 interactive textbook on Physical AI & Humanoid Robotics. Scoring: Max 300 points (100 base + 200 bonus). Total LOC < 850. Zero paid services.

---

## User Scenarios & Testing

### User Story 1 - Browse Textbook Content (Priority: P1)

As a learner, I want to browse a comprehensive textbook on Physical AI & Humanoid Robotics so I can learn ROS2, Gazebo, Isaac Sim, and VLA concepts.

**Why this priority**: Core value proposition - the textbook content itself is the primary deliverable.

**Independent Test**: Navigate to GitHub Pages URL, view all 13 weeks of content across 4 modules with Mermaid diagrams and code snippets.

**Acceptance Scenarios**:

1. **Given** the site is deployed, **When** I visit the homepage, **Then** I see the intro page with navigation to all modules
2. **Given** I'm on any module page, **When** I scroll through content, **Then** I see Mermaid diagrams rendered and Python/ROS2 code highlighted
3. **Given** I'm on mobile, **When** I view any page, **Then** content is responsive and readable
4. **Given** dark mode is enabled, **When** I view any page, **Then** all content renders correctly in dark theme

---

### User Story 2 - RAG Chatbot Q&A (Priority: P1)

As a learner, I want to ask questions about the textbook content via an embedded chatbot so I can get instant answers.

**Why this priority**: Core differentiator - interactive learning experience beyond static content.

**Independent Test**: Open chatbot iframe, ask "What is ROS2?", receive accurate answer sourced from textbook content.

**Acceptance Scenarios**:

1. **Given** the chatbot is loaded, **When** I type a question about ROS2, **Then** I receive an answer within 5 seconds
2. **Given** I select text on a page, **When** I click "Ask about this", **Then** the chatbot answers specifically about the selected text
3. **Given** the backend is running, **When** I ask any textbook-related question, **Then** the response cites relevant sections

---

### User Story 3 - Selected Text Query (Priority: P2)

As a learner, I want to select text and ask questions specifically about that selection for focused learning.

**Why this priority**: Enhances RAG usability for targeted questions.

**Independent Test**: Select a paragraph, click query button, receive context-specific answer.

**Acceptance Scenarios**:

1. **Given** I select text on any page, **When** I trigger selected-text query, **Then** chatbot receives only the selected text as context
2. **Given** I select code snippet, **When** I ask "explain this", **Then** chatbot explains the specific code

---

### User Story 4 - User Authentication & Quiz (Priority: P3 - Bonus)

As a new user, I want to sign up and complete a background quiz so the content can be personalized to my level.

**Why this priority**: Bonus feature (+50 pts) - enables personalization.

**Independent Test**: Sign up with email/GitHub, complete 10-question quiz, see results stored.

**Acceptance Scenarios**:

1. **Given** I'm a new visitor, **When** I click "Sign Up", **Then** I can register via email or GitHub OAuth
2. **Given** I've registered, **When** I complete the 10-question quiz, **Then** my responses are stored in Neon Postgres
3. **Given** I return to the site, **When** I log in, **Then** my quiz results are retrieved

---

### User Story 5 - Content Personalization (Priority: P3 - Bonus)

As a logged-in user, I want to personalize chapter content based on my quiz results for adaptive learning.

**Why this priority**: Bonus feature (+50 pts) - adaptive learning experience.

**Independent Test**: Click "Personalize this chapter", see content re-rendered at appropriate level.

**Acceptance Scenarios**:

1. **Given** I'm logged in with quiz completed, **When** I click "Personalize this chapter", **Then** content re-renders as beginner/intermediate/advanced based on my quiz score
2. **Given** I'm a beginner, **When** personalization runs, **Then** I see simplified explanations and more examples

---

### User Story 6 - Urdu Translation (Priority: P3 - Bonus)

As an Urdu-speaking learner, I want to translate chapters to Urdu for accessibility.

**Why this priority**: Bonus feature (+50 pts) - accessibility for Urdu speakers.

**Independent Test**: Click "اردو میں ترجمہ کریں", see chapter translated within 8 seconds.

**Acceptance Scenarios**:

1. **Given** I'm on any chapter, **When** I click the Urdu button, **Then** the chapter translates to Urdu within 8 seconds
2. **Given** a chapter was previously translated, **When** I request Urdu, **Then** cached translation loads instantly from Postgres

---

### User Story 7 - Claude Subagents (Priority: P3 - Bonus)

As a developer extending this project, I want reusable Claude subagent definitions for common tasks.

**Why this priority**: Bonus feature (+50 pts) - developer experience and extensibility.

**Independent Test**: Verify 4+ subagent .md files exist in .specify/docs-plus/ with complete prompts.

**Acceptance Scenarios**:

1. **Given** the repo is cloned, **When** I check .specify/docs-plus/, **Then** I find at least 4 subagent definition files
2. **Given** I use the ROS Expert subagent, **When** I query about ROS2, **Then** I get expert-level responses

---

### Edge Cases

- What happens when Qdrant/Neon free tier limits are reached? → Display graceful error, suggest retry
- How does system handle OpenAI API rate limits? → Implement exponential backoff
- What if user's quiz is incomplete? → Default to intermediate level
- What if translation exceeds 8 seconds? → Show progress indicator, allow cancellation

---

## Requirements

### Functional Requirements

**Base Requirements (100 pts)**

- **FR-001**: System MUST deploy as static Docusaurus v3 site to GitHub Pages
- **FR-002**: System MUST include all MDX content: Intro, Why Physical AI, Learning Outcomes, Assessments, 13 weeks across 4 modules
- **FR-003**: System MUST render Mermaid diagrams in MDX files
- **FR-004**: System MUST syntax-highlight Python and ROS2 code snippets
- **FR-005**: System MUST embed RAG chatbot via iframe
- **FR-006**: System MUST support whole-book Q&A via chatbot
- **FR-007**: System MUST support selected-text queries via window.getSelection()
- **FR-008**: Backend MUST use FastAPI with Qdrant for vector search
- **FR-009**: Backend MUST use Neon Postgres for data persistence
- **FR-010**: System MUST be mobile-responsive
- **FR-011**: System MUST support dark mode

**Bonus Requirements (50 pts each)**

- **FR-012**: System SHOULD implement Better Auth with email + GitHub OAuth
- **FR-013**: System SHOULD implement mandatory 10-question signup quiz
- **FR-014**: System SHOULD store quiz results in Neon Postgres
- **FR-015**: System SHOULD implement per-chapter "Personalize" button
- **FR-016**: System SHOULD re-render content based on quiz results (beginner/intermediate/advanced)
- **FR-017**: System SHOULD implement per-chapter Urdu translation button
- **FR-018**: System SHOULD cache Urdu translations in Postgres
- **FR-019**: System SHOULD include minimum 4 reusable Claude subagents in .specify/docs-plus/

### Non-Functional Requirements

- **NFR-001**: Total LOC MUST be < 850 lines
- **NFR-002**: Build RAM MUST be < 2.5 GB
- **NFR-003**: All services MUST use free tiers only (zero paid services)
- **NFR-004**: Urdu translation MUST complete in < 8 seconds
- **NFR-005**: Chatbot response MUST complete in < 5 seconds

---

## Key Entities

- **User**: id, email, github_id, quiz_results, created_at
- **QuizResponse**: user_id, question_id, answer, score
- **Chapter**: id, slug, title, content_md, urdu_cache
- **ChatMessage**: id, user_id, query, response, context_type (full/selected), timestamp
- **Embedding**: id, chapter_id, chunk_text, vector, metadata

---

## Technology Stack

| Layer | Technology | Constraint |
|-------|------------|------------|
| Frontend | Docusaurus 3 + Tailwind + MDX v3 + React | Static only |
| Backend | FastAPI + Uvicorn | Free tier hosting |
| Vector DB | Qdrant Cloud | Free 1 GB |
| Postgres | Neon | Free 0.5 GB |
| Auth | Better Auth | Self-hosted |
| LLM | OpenAI gpt-4o-mini | Free credits |
| Deploy Frontend | GitHub Pages | Free |
| Deploy Backend | Render/Fly.io | Free tier |

---

## Folder Structure

```
/docs/
  intro.mdx
  why-physical-ai.mdx
  learning-outcomes.mdx
  assessments.mdx
  /module-1-ros2/
    intro.mdx
    week-01.mdx
    week-02.mdx
    week-03.mdx
    week-04.mdx
    week-05.mdx
  /module-2-simulation/
    week-06.mdx
    week-07.mdx
  /module-3-isaac/
    week-08.mdx
    week-09.mdx
    week-10.mdx
  /module-4-vla/
    week-11.mdx
    week-12.mdx
    week-13.mdx
    capstone.mdx

/src/components/
  ChatbotIframe.tsx
  PersonalizeButton.tsx
  UrduButton.tsx
  AuthGuard.tsx

/backend/app/
  main.py
  rag.py
  auth.py
  personalization.py

/.specify/docs-plus/
  ros-expert.md
  urdu-translator.md
  personalization-engine.md
  quiz-generator.md

/docusaurus.config.js
```

---

## Content Outline (13 Weeks, 4 Modules)

### Introduction
- Why Physical AI Matters
- Learning Outcomes
- Assessment Strategy

### Module 1: ROS2 Foundations (Weeks 1-5)
- **Week 1**: ROS2 Architecture & Nodes
- **Week 2**: Topics, Services, Actions
- **Week 3**: Launch Files & Parameters
- **Week 4**: TF2 & URDF
- **Week 5**: Navigation Stack Basics

### Module 2: Simulation (Weeks 6-7)
- **Week 6**: Gazebo Classic & Ignition
- **Week 7**: Unity Robotics Hub Integration

### Module 3: NVIDIA Isaac (Weeks 8-10)
- **Week 8**: Isaac Sim Setup & Basics
- **Week 9**: Isaac ROS Integration
- **Week 10**: Synthetic Data Generation

### Module 4: Vision-Language-Action (Weeks 11-13)
- **Week 11**: VLA Model Architecture
- **Week 12**: Fine-tuning for Robotics
- **Week 13**: Deployment & Integration
- **Capstone**: End-to-End Physical AI System

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Site live at `username.github.io/physical-ai-textbook/`
- **SC-002**: RAG chatbot answers questions accurately from textbook content
- **SC-003**: Selected-text query works via window.getSelection()
- **SC-004**: Total LOC < 850 (verified via `cloc`)
- **SC-005**: Build completes with < 2.5 GB RAM
- **SC-006**: All pages mobile-responsive (tested on 375px width)
- **SC-007**: Dark mode works on all pages

### Bonus Success Criteria

- **SC-008**: Auth flow completes (email + GitHub OAuth)
- **SC-009**: Quiz stores 10 responses in Neon
- **SC-010**: Personalization re-renders content correctly
- **SC-011**: Urdu translation completes in < 8 seconds
- **SC-012**: 4+ subagent files present in .specify/docs-plus/

---

## Implementation Phases

### Phase 1: Base Content (40 pts)
- [ ] Docusaurus setup with GitHub Pages deploy
- [ ] All MDX files created with content
- [ ] Mermaid diagrams + code snippets working

### Phase 2: RAG Chatbot (60 pts)
- [ ] FastAPI backend deployed
- [ ] Qdrant embeddings indexed
- [ ] Whole-book Q&A working
- [ ] Selected-text query working

### Phase 3: Bonus - Auth & Quiz (50 pts)
- [ ] Better Auth integrated
- [ ] 10-question quiz implemented
- [ ] Quiz results stored in Neon

### Phase 4: Bonus - Personalization (50 pts)
- [ ] PersonalizeButton component
- [ ] LLM-based content adaptation
- [ ] Three difficulty levels working

### Phase 5: Bonus - Urdu Translation (50 pts)
- [ ] UrduButton component
- [ ] Translation API endpoint
- [ ] Postgres caching

### Phase 6: Bonus - Subagents (50 pts)
- [ ] ROS Expert subagent
- [ ] Urdu Translator subagent
- [ ] Personalization Engine subagent
- [ ] Quiz Generator subagent

---

## Constitution Compliance Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Free Tools Only | ✅ | All services on free tiers |
| II. Minimal Codebase | ⚠️ | Target < 850 LOC (relaxed from 500 for scope) |
| III. ROS2/Gazebo/Isaac Focus | ✅ | Core content focus |
| IV. TDD | 🔲 | Tests required before implementation |
| V. Modular Architecture | ✅ | Components isolated, bonus features flagged |
| VI. Simplicity First | ✅ | MVP phases defined |

**Note**: LOC limit relaxed to 850 for this feature due to scope. Requires ADR approval.

---

**Specification Version**: 1.0.0 | **Author**: Architect | **Date**: 2025-12-04
