# ADR-001: LOC Limit Increase for Physical AI Textbook

- **Status:** Proposed
- **Date:** 2025-12-04
- **Feature:** 001-physical-ai-textbook
- **Context:** Constitution mandates <500 LOC total, but the Physical AI Textbook specification requires 300 points worth of features (100 base + 200 bonus) including RAG chatbot, authentication, personalization, and Urdu translation.

## Decision

Increase LOC limit from **500 to 850** for the Physical AI Textbook project only.

**LOC Budget Allocation:**
| Component | Estimated LOC |
|-----------|---------------|
| React Components (4 files) | ~200 |
| FastAPI Backend (4 files) | ~300 |
| Docusaurus Config | ~50 |
| Subagent Definitions | ~100 |
| Tests | ~200 |
| **Total** | **~850** |

**Note:** MDX content files are excluded from LOC count (documentation, not code).

## Consequences

### Positive

- Enables full 300-point implementation (100 base + 200 bonus)
- Allows proper separation of concerns across modules
- Provides room for comprehensive test coverage (TDD requirement)
- Still maintains constraint discipline (not unlimited)

### Negative

- Deviates from constitution's 500 LOC principle
- Sets precedent for future exceptions
- May encourage feature creep

## Alternatives Considered

**Alternative A: Strict 500 LOC**
- Drop 2 bonus features (personalization, Urdu translation)
- Max score: 200 points instead of 300
- Why rejected: Significant point loss, reduces competitive advantage

**Alternative B: Split into Multiple Projects**
- Separate repos for frontend and backend
- Each under 500 LOC individually
- Why rejected: Complicates deployment, violates "simplicity first" principle

**Alternative C: 850 LOC with Strict Module Limits**
- Allow 850 total but cap each module at 100 LOC
- Enforce via CI check
- Why chosen: Maintains discipline while enabling full feature set

## References

- Feature Spec: .specify/memory/spec-001-physical-ai-textbook.md
- Implementation Plan: TBD
- Related ADRs: None
- Evaluator Evidence: TBD after implementation

---

📋 **Architectural decision detected:** LOC limit increase from 500→850. Requires approval before implementation proceeds.
