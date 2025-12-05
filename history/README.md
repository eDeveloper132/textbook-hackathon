# 📝 Prompt History Records

This directory stores Prompt History Records (PHRs) for the Physical AI Textbook project.

## 📁 Structure

```
history/
└── prompts/
    ├── constitution/     # Core project decisions
    ├── general/          # General development prompts
    └── <feature-name>/   # Feature-specific prompts
```

## 🎯 Purpose

PHRs track all significant prompts and decisions made during development:

- **Traceability**: Understand why decisions were made
- **Documentation**: Record architectural choices
- **Learning**: Reference for future similar projects
- **Collaboration**: Share context with team members

## 📋 PHR Format

Each PHR file follows this structure:

```markdown
# PHR-YYYY-MM-DD-HH-MM-description

## Prompt
[Original user prompt verbatim]

## Context
- Current state of the project
- Relevant files/components
- Dependencies

## Response Summary
Brief summary of the action taken

## Files Changed
- `path/to/file1.ts` - Description of change
- `path/to/file2.py` - Description of change

## Decisions Made
- Decision 1 and rationale
- Decision 2 and rationale

## Follow-up Actions
- [ ] Action item 1
- [ ] Action item 2
```

## 🏷️ Categories

### constitution/
Core architectural decisions that affect the entire project:
- Tech stack choices
- Project structure
- API design patterns
- Security policies

### general/
Day-to-day development prompts:
- Bug fixes
- Feature implementations
- Documentation updates
- Configuration changes

### <feature-name>/
Feature-specific prompts organized by feature:
- `auth/` - Authentication-related prompts
- `rag/` - RAG chatbot prompts
- `quiz/` - Quiz system prompts
- `translation/` - Translation feature prompts

## 🔗 Related

- **ADRs** (Architectural Decision Records): For major architectural decisions
- **CHANGELOG.md**: For user-facing changes
- **Git commits**: For code-level changes

---

Part of the [Physical AI Textbook](../README.md) project
