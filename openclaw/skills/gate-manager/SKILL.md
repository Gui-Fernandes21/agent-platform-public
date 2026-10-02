# Gate Manager Skill

Human-in-the-loop approval gates. NOTHING critical happens without Gui's explicit approval via Telegram.

## The Four Gates

| Gate | When | Who Triggers | How Gui Approves |
|------|------|-------------|------------------|
| Gate 1: Task Plan | PM finishes breaking task into subtasks | pm-orchestrator | Telegram reply |
| Gate 2: PR Approval | Code review passes, PR created | code-reviewer | GitHub PR review |
| Gate 3: Deploy | PR merged, checks pass | devops-engineer | Telegram reply |
| Gate 4: Architecture | Schema/dependency/API decisions | any agent | Telegram reply |

## Gate Protocol

### Gate 1 — Task Plan Approval

The PM orchestrator sends this to Gui via Telegram:

```
🔒 GATE 1: Task Plan

Task: [title]
ID: [task-id]
Branch: feature/[slug]

Subtasks:
1. [Backend] [description] (effort: M)
2. [Database] [description] (effort: S)
3. [QA] [description] (effort: M)

Agents: backend-developer, database-engineer, qa-tester
Total effort: Medium

Reply:
  ✅ "approve" — agents begin work
  🔄 "revise: [notes]" — send back with feedback
  ❌ "reject" — cancel task
```

**BLOCKED**: No agent starts work until Gui replies "approve".

After approval:
1. Update Notion card → "In Progress"
2. Log to Agent Log: "Gate 1 approved"
3. Begin dispatching subtasks to specialist agents

### Gate 2 — PR Approval

The code-reviewer creates the PR on GitHub with:
- Summary of changes
- Review findings (blocking / suggestions / observations)
- Test results and coverage

Then notifies Gui via Telegram:

```
📝 GATE 2: PR Ready for Review

Task: [title]
PR: https://github.com/[repo]/pull/[number]
Tests: ✅ [passed]/[total] | Coverage: [%]

Review: [1-line summary from code-reviewer]

→ Review and merge on GitHub when ready
```

**BLOCKED**: PR stays open until Gui reviews and merges on GitHub.

After merge:
1. Update Notion card → "Deploy Ready"
2. Log to Agent Log: "PR merged"
3. Trigger devops-engineer for deploy prep

### Gate 3 — Deploy Approval

The devops-engineer prepares the deployment and notifies Gui:

```
🚀 GATE 3: Deploy Ready

Task: [title]
Branch: main (merged from [feature-branch])
Checks: ✅ All passing

Deploy target: [GitHub Pages / GCP VM]
Rollback plan: [description]

Reply:
  ✅ "deploy" — proceed with deployment
  ⏸️ "hold" — pause, do not deploy
```

**BLOCKED**: No deployment until Gui replies "deploy".

After approval:
1. Execute deployment
2. Run post-deploy health checks
3. Update Notion card → "Done"
4. Notify Gui: "✅ Deployed: [task title]"

### Gate 4 — Architecture Decision

Any agent can trigger this when they encounter:
- New dependency needed
- Database schema change
- Breaking API change
- Performance/security concern

Format:

```
⚠️ GATE 4: Decision Needed

Task: [title]
Agent: [agent-name]
Issue: [description]

Options:
A) [option] — [tradeoff]
B) [option] — [tradeoff]
C) [option] — [tradeoff]

Recommendation: [A/B/C] because [reason]

Reply with your choice or direction.
```

**BLOCKED**: Agent pauses work until Gui responds.

## Cron: Daily Summary

The PM orchestrator sends a daily summary via Telegram (configure as OpenClaw cron):

```
📊 Daily Summary — [date]

Active tasks: [count]
  🔄 In Progress: [list]
  🔒 Awaiting approval: [list]
  ✅ Completed today: [list]

Blocked: [list with reasons]
Upcoming: [next tasks in Ready column]
```

## Rules for All Agents

1. **Never bypass a gate.** If you're unsure whether a gate applies, assume it does and ask.
2. **Always notify before blocking.** Send the Telegram message, then stop work on that task.
3. **Update Notion first, then Telegram.** The board is the source of truth.
4. **Log every gate transition** to the Agent Log database.
5. **Only Gui can approve.** Agents cannot approve their own gates or each other's.
