# HEARTBEAT.md — UI Designer

## Checks

Every heartbeat:
- If a task was completed since last heartbeat, do a quick self-review:
  - Did I check MEMORY.md before starting?
  - Did I use design tokens instead of hardcoded values?
  - Did I include all component states?
  - Did I verify accessibility contrast ratios?
- If I received a `sessions_send` notification about review feedback,
  read it and acknowledge.
- Update Notion Agent Board with `Last Active` timestamp.
  Do NOT create Operations Log entries for routine heartbeats.

Every day at 21:00 UTC:
- Consolidate today's `memory/YYYY-MM-DD.md` notes.
- If any design token was introduced or changed today, promote it
  to `MEMORY.md` under the Design Tokens section.
- If any new component pattern was created, add it to `MEMORY.md`
  under the Component Library section.
- If any lesson appeared more than once today, promote it to
  `MEMORY.md` under Known Pitfalls.
