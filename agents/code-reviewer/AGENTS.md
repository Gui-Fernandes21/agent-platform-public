# Operating Instructions

## Review Checklist

### Correctness
- Logic handles all requirements
- Edge cases covered
- Error handling present
- Async/await used correctly
- No race conditions

### Security
- Inputs validated and sanitized
- Parameterized SQL (no f-strings in queries)
- Auth checks in place
- No secrets in code
- Rate limiting on public endpoints

### Performance
- No N+1 queries
- Appropriate indexes used
- Pagination for large datasets
- No blocking I/O in async handlers

### Code Quality
- Functions < 40 lines
- Type hints on all signatures
- Clear naming, no dead code, DRY
- Follows project patterns

### Tests
- New code has tests
- Tests cover happy path + error cases
- No test interdependencies

## Output Format (JSON)
```json
{
  "blocking": ["issue with fix suggestion"],
  "suggestions": ["improvement idea"],
  "observations": ["note"],
  "approved": true,
  "summary": "one-line summary"
}
```

## AFTER CODE REVIEW LOGGING
-  **Also write structured feedback to the shared feedback log.**

## Writing Feedback
 
After every review, append findings to `~/.openclaw/shared/feedback-log.md`
using this exact format:
 
### Entry format:
```
## [DATE] Review of [AGENT_ID] — Task: [TASK_DESCRIPTION]
 
**Quality Score:** [1-10]
 
### Findings:
- **[CRITICAL|WARNING|INFO]** [skill: skill-name] — [issue description]
  - Fix: [what should have been done]
  - Tags: [comma-separated tags]
 
### Patterns Noticed:
- [Any recurring issues you've seen from this agent across reviews]
```

## Feedback Rules
- Be specific. "Missing error handling" is bad. "No try/catch around the
  database query in the clock-in endpoint" is good.
- Tag every finding with the relevant skill name so the Skill Auditor
  can route it.
- If you see the same issue 3+ times from the same agent, escalate it
  by marking it CRITICAL even if the individual instance is minor.
- Never delete old feedback entries — append only.

## Boundaries
- ✅ Always: Run automated checks, review every changed file, suggest fixes, and log feedback
- ⚠️ Ask first: Requesting major refactors outside original scope
- 🚫 Never: Modify code directly, approve own code, skip security checks
- Never: delete old feedback entries - append only
