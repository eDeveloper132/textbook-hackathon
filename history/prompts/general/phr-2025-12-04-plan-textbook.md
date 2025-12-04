---
id: phr-2025-12-04-003
title: Generate Architecture Plan for Physical AI Textbook
stage: plan
date: 2025-12-04T13:14:24.578Z
surface: copilot-cli
model: claude-sonnet
feature: 001-physical-ai-textbook
branch: main
user: architect
command: /sp.plan
labels: [plan, architecture, api, database, rag]
links:
  spec: .specify/memory/spec-001-physical-ai-textbook.md
  ticket: 
  adr: .specify/memory/adr-001-loc-limit-increase.md
  pr: 
files:
  - .specify/memory/plan-001-physical-ai-textbook.md
tests:
---

## Prompt

/sp.plan
Generate complete architecture plan including:
- Folder structure
- API routes for RAG (/ask, /ask-selection)
- Database schema (users, backgrounds, chat_history)
- How the iframe chatbot works
- How selected-text querying works (window.getSelection())
- Feature flag system for bonuses
- Claude Subagent registry

## Response snapshot

Created comprehensive architecture plan at `.specify/memory/plan-001-physical-ai-textbook.md`:

**Project Structure**: Full folder tree with 21 MDX files, 7 React components, 5 backend modules, 4 subagent files

**API Routes**:
- Base: `POST /api/ask`, `POST /api/ask-selection`, `GET /api/health`
- Bonus: Auth routes, quiz routes, personalization, translation

**Database Schema** (Neon Postgres):
- `users` - Auth with email/GitHub
- `quiz_responses` - 10-question background quiz
- `user_levels` - Derived beginner/intermediate/advanced
- `chat_history` - Q&A logging
- `urdu_cache` - Translation cache

**Qdrant Schema**: `textbook_chunks` collection with 1536-dim vectors

**Architecture Diagrams**:
- System overview (GitHub Pages → Render → Qdrant/Neon/OpenAI)
- RAG data flow (embed → search → prompt → respond)
- Selected text flow (getSelection → postMessage → iframe → backend)

**Feature Flags**: Environment-based toggles for all bonus features

**Subagent Registry**: 4 agents (ROS Expert, Urdu Translator, Personalization Engine, Quiz Generator)

**LOC Budget**: 850 total across all components

**Implementation Order**: 8 phases, 18h estimated

## Outcome

- ✅ Impact: Complete architecture blueprint ready for implementation
- 🧪 Tests: Test files planned in structure
- 📁 Files: plan-001-physical-ai-textbook.md created
- 🔁 Next prompts: /sp.tasks to generate task breakdown
- 🧠 Reflection: Plan enables parallel work on frontend/backend

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): Detailed architecture request
- Next experiment (smallest change to try): Validate LOC estimates during implementation
