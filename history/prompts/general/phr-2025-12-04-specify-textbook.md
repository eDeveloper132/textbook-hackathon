---
id: phr-2025-12-04-002
title: Generate Physical AI Textbook Specification
stage: specify
date: 2025-12-04T13:11:32.458Z
surface: copilot-cli
model: claude-sonnet
feature: 001-physical-ai-textbook
branch: main
user: architect
command: /sp.specify
labels: [spec, textbook, docusaurus, rag, physical-ai]
links:
  spec: .specify/memory/spec-001-physical-ai-textbook.md
  ticket: 
  adr: .specify/memory/adr-001-loc-limit-increase.md
  pr: 
files:
  - .specify/memory/spec-001-physical-ai-textbook.md
tests:
---

## Prompt

/sp.specify
id: 001-physical-ai-textbook
title: Physical AI & Humanoid Robotics – Bridging Digital Brains and Physical Bodies
version: 1.0.0
status: approved

OVERVIEW
Free, open-source, GitHub Pages-deployable Docusaurus v3 interactive textbook on Physical AI & Humanoid Robotics. Max 300 points (100 base + 200 bonus). Total LOC < 850. Zero paid services.

BASE (100 pts)
1. Docusaurus v3 → GitHub Pages
2. Full book in MDX: Intro + Why Physical AI + Learning Outcomes + Assessments + 13 weeks + 4 modules
3. Embedded RAG chatbot (FastAPI + OpenAI + Qdrant + Neon)

BONUS (50 pts each)
4. Better Auth + signup quiz
5. Per-chapter personalization
6. Urdu translation
7. 4+ Claude subagents

## Response snapshot

Created comprehensive specification at `.specify/memory/spec-001-physical-ai-textbook.md`:

**7 User Stories** (P1-P3 prioritized):
1. P1: Browse Textbook Content
2. P1: RAG Chatbot Q&A
3. P2: Selected Text Query
4. P3: User Authentication & Quiz (Bonus)
5. P3: Content Personalization (Bonus)
6. P3: Urdu Translation (Bonus)
7. P3: Claude Subagents (Bonus)

**19 Functional Requirements** + **5 Non-Functional Requirements**

**6 Implementation Phases** with checkboxes

**Folder Structure** defined for:
- /docs/ (21 MDX files)
- /src/components/ (4 TSX files)
- /backend/app/ (4 Python files)
- /.specify/docs-plus/ (4 subagent files)

## Outcome

- ✅ Impact: Complete specification created for 300-point textbook project
- 🧪 Tests: Acceptance scenarios defined for each user story
- 📁 Files: spec-001-physical-ai-textbook.md created
- 🔁 Next prompts: /sp.plan, /sp.tasks, /sp.adr (for LOC limit)
- 🧠 Reflection: LOC limit increased from 500→850 requires ADR approval

## Evaluation notes (flywheel)

- Failure modes observed: LOC constraint conflict with project scope
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): Full detailed spec input
- Next experiment (smallest change to try): Validate LOC estimate after scaffolding
