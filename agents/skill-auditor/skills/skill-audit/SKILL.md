---
name: skill-audit
description: >
  Analyze accumulated code review feedback, identify recurring patterns,
  and update producing agents' skills and memory files to prevent
  repeated mistakes. Run weekly via cron.
---
 
# Skill Audit Workflow
 
## Trigger
This skill runs via cron every Sunday at 09:00 UTC.
 
## Steps
 
### 1. Read the Feedback Log
Read `~/.openclaw/shared/feedback-log.md` in full.
 
### 2. Identify Patterns
Group findings by:
- **Agent**: Which agent keeps making which mistakes?
- **Skill**: Which skill areas have the most issues?
- **Severity**: Focus on CRITICAL and WARNING items first.
- **Recurrence**: Any finding that appears 3+ times is a pattern.
 
### 3. Generate Improvement Actions
For each pattern, decide one of:
- **Update MEMORY.md**: Add a new entry to the agent's Known Pitfalls section.
- **Update AGENTS.md**: Add a new behavioral rule if the issue is procedural.
- **Update a Skill**: If the agent has a skill for the relevant area,
  add a guardrail or checklist item to the SKILL.md.
- **Create a new Skill**: If no skill covers the area and it's substantial
  enough, draft a new SKILL.md.
 
### 4. Apply Changes
- Read the target file first (the agent's MEMORY.md, AGENTS.md, or SKILL.md).
- Make the minimal edit needed. Don't rewrite entire files.
- Use the `edit` tool to make precise changes.
- Append a changelog entry at the bottom of the file:
  `<!-- Skill Auditor: [DATE] — Added [description] based on [N] review findings -->`
 
### 5. Archive Processed Feedback
After processing, move the handled entries from `feedback-log.md` to
`~/.openclaw/shared/feedback-archive/YYYY-MM-DD.md`.
 
### 6. Report
Write a summary to `~/.openclaw/shared/audit-reports/YYYY-MM-DD.md`:
- How many findings processed
- What changes were made to which agents
- Current "health score" per agent (based on review quality scores)
 
Send a summary to Gui via Telegram.
 
## Guardrails
- Never change SOUL.md files (identity is sacred).
- Never remove existing lessons from MEMORY.md (append only).
- Maximum 3 changes per agent per audit cycle (avoid overwhelming).
- If a change would contradict an existing rule, flag it for
  human review instead of auto-applying.
