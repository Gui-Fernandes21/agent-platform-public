# Notion Board Skill

Use this skill to manage the Sprint Board kanban, Agent Log, and Decision Log in Notion.

## Prerequisites

Environment variables (set in `~/.openclaw/.env`):
```
NOTION_TOKEN=ntn_...
NOTION_SPRINT_DB=<database-id>
NOTION_LOG_DB=<agent-log-database-id>
NOTION_DECISION_DB=<decision-log-database-id>
```

## Board Columns

| Column | Meaning |
|--------|---------|
| Backlog | Ideas and future tasks |
| Ready | Approved tasks with clear requirements |
| Planning | PM breaking down the task |
| In Progress | Agents working |
| Code Review | Code review agent checking |
| In Review | Waiting for Gui's PR approval |
| Deploy Ready | Merged, awaiting deploy approval |
| Done | Deployed and verified |

## Card Operations

### Create a card
```bash
curl -s -X POST "https://api.notion.com/v1/pages" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d "{
    \"parent\": {\"database_id\": \"$NOTION_SPRINT_DB\"},
    \"properties\": {
      \"Title\": {\"title\": [{\"text\": {\"content\": \"$TASK_TITLE\"}}]},
      \"Status\": {\"status\": {\"name\": \"$STATUS\"}},
      \"Priority\": {\"select\": {\"name\": \"$PRIORITY\"}},
      \"Assigned Agent\": {\"select\": {\"name\": \"$AGENT_NAME\"}},
      \"Task ID\": {\"rich_text\": [{\"text\": {\"content\": \"$TASK_ID\"}}]},
      \"Branch\": {\"rich_text\": [{\"text\": {\"content\": \"$BRANCH\"}}]}
    }
  }"
```

### Update card status
Map internal status to Notion columns:
- `planning` → "Planning"
- `in_progress` → "In Progress"
- `code_review` → "Code Review"
- `pr_pending` → "In Review"
- `merged` → "Deploy Ready"
- `done` → "Done"

```bash
curl -s -X PATCH "https://api.notion.com/v1/pages/$PAGE_ID" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d "{
    \"properties\": {
      \"Status\": {\"status\": {\"name\": \"$NEW_STATUS\"}}
    }
  }"
```

### Add PR link to card
```bash
curl -s -X PATCH "https://api.notion.com/v1/pages/$PAGE_ID" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d "{
    \"properties\": {
      \"PR Link\": {\"url\": \"$PR_URL\"}
    }
  }"
```

### Query cards by status
```bash
curl -s -X POST "https://api.notion.com/v1/databases/$NOTION_SPRINT_DB/query" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d "{
    \"filter\": {
      \"property\": \"Status\",
      \"status\": {\"equals\": \"$STATUS_NAME\"}
    },
    \"sorts\": [{\"property\": \"Priority\", \"direction\": \"descending\"}]
  }" | jq '.results[] | {
    id: .id,
    title: .properties.Title.title[0].text.content,
    task_id: .properties["Task ID"].rich_text[0].text.content,
    priority: .properties.Priority.select.name
  }'
```

### Find card by Task ID
```bash
curl -s -X POST "https://api.notion.com/v1/databases/$NOTION_SPRINT_DB/query" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d "{
    \"filter\": {
      \"property\": \"Task ID\",
      \"rich_text\": {\"equals\": \"$TASK_ID\"}
    }
  }" | jq '.results[0].id'
```

## Agent Log

### Write a log entry
```bash
curl -s -X POST "https://api.notion.com/v1/pages" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d "{
    \"parent\": {\"database_id\": \"$NOTION_LOG_DB\"},
    \"properties\": {
      \"Title\": {\"title\": [{\"text\": {\"content\": \"$AGENT: $ACTION\"}}]},
      \"Agent\": {\"select\": {\"name\": \"$AGENT\"}},
      \"Action Type\": {\"select\": {\"name\": \"$ACTION_TYPE\"}},
      \"Timestamp\": {\"date\": {\"start\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}},
      \"Details\": {\"rich_text\": [{\"text\": {\"content\": \"$DETAILS\"}}]}
    }
  }"
```

## Decision Log

### Record an architecture decision
```bash
curl -s -X POST "https://api.notion.com/v1/pages" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d "{
    \"parent\": {\"database_id\": \"$NOTION_DECISION_DB\"},
    \"properties\": {
      \"Title\": {\"title\": [{\"text\": {\"content\": \"$DECISION_TITLE\"}}]},
      \"Decision\": {\"rich_text\": [{\"text\": {\"content\": \"$DECISION\"}}]},
      \"Rationale\": {\"rich_text\": [{\"text\": {\"content\": \"$RATIONALE\"}}]},
      \"Date\": {\"date\": {\"start\": \"$(date -u +%Y-%m-%d)\"}}
    }
  }"
```

## Database Setup

See `docs/notion-setup.md` for the full step-by-step guide to creating the Sprint Board, Agent Log, and Decision Log databases with the correct properties.
