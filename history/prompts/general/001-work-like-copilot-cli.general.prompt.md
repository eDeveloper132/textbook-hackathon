---
ID: 001
TITLE: Work like copilot cli
STAGE: general
DATE_ISO: 2025-12-03
SURFACE: agent
MODEL: GPT-5 mini
FEATURE: none
BRANCH: none
USER: user
COMMAND: create-phr
LABELS:
 - copilot
 - cli
LINKS:
  SPEC: null
  TICKET: null
  ADR: null
  PR: null
FILES_YAML:
 - history/prompts/general/001-work-like-copilot-cli.general.prompt.md
TESTS_YAML:
 - null
PROMPT_TEXT: |
  Can you work like copilot cli ??? (See <attachments> above for file contents. You may not need to search or read the file again.)

RESPONSE_TEXT: |
  Created a TODO plan to implement copilot-cli-like behavior and prepared to build a PowerShell wrapper script plus README. Asking for clarification about which exact features you want (interactive edits, apply patches, run tests, git commit suggestions, etc.).
OUTCOME: in-progress
---

Notes:
- This PHR records the user's prompt verbatim and the assistant's immediate plan.
