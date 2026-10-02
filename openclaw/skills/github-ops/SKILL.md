# GitHub Operations Skill

Use this skill for all GitHub interactions: creating branches, managing PRs, running checks, and processing webhooks.

## Prerequisites

Environment variables (set in `~/.openclaw/.env`):
```
GITHUB_TOKEN=ghp_...
GITHUB_REPO=owner/repo-name
```

## Branch Management

### Create a feature branch
```bash
BRANCH="feature/$(echo "$TASK_SLUG" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd 'a-z0-9-')"
curl -s -X POST "https://api.github.com/repos/$GITHUB_REPO/git/refs" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"ref\": \"refs/heads/$BRANCH\",
    \"sha\": \"$(curl -s https://api.github.com/repos/$GITHUB_REPO/git/ref/heads/main -H "Authorization: token $GITHUB_TOKEN" | jq -r '.object.sha')\"
  }"
```

### Delete a branch after merge
```bash
curl -s -X DELETE "https://api.github.com/repos/$GITHUB_REPO/git/refs/heads/$BRANCH" \
  -H "Authorization: token $GITHUB_TOKEN"
```

## Pull Request Management

### Create a PR
```bash
curl -s -X POST "https://api.github.com/repos/$GITHUB_REPO/pulls" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"$PR_TITLE\",
    \"body\": \"$PR_BODY\",
    \"head\": \"$BRANCH\",
    \"base\": \"main\"
  }"
```

### Add a review comment to a PR
```bash
curl -s -X POST "https://api.github.com/repos/$GITHUB_REPO/issues/$PR_NUMBER/comments" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"body\": \"$COMMENT\"}"
```

### Get PR status and checks
```bash
curl -s "https://api.github.com/repos/$GITHUB_REPO/pulls/$PR_NUMBER" \
  -H "Authorization: token $GITHUB_TOKEN" | jq '{state, mergeable, merged, title}'

curl -s "https://api.github.com/repos/$GITHUB_REPO/commits/$SHA/check-runs" \
  -H "Authorization: token $GITHUB_TOKEN" | jq '.check_runs[] | {name, status, conclusion}'
```

### Merge a PR (squash)
Only after Gate 2 approval from Gui.
```bash
curl -s -X PUT "https://api.github.com/repos/$GITHUB_REPO/pulls/$PR_NUMBER/merge" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"merge_method": "squash"}'
```

## Commit and Push Files

### Create or update a file on a branch
```bash
# Get current file SHA (empty string if new file)
FILE_SHA=$(curl -s "https://api.github.com/repos/$GITHUB_REPO/contents/$FILE_PATH?ref=$BRANCH" \
  -H "Authorization: token $GITHUB_TOKEN" | jq -r '.sha // empty')

CONTENT_B64=$(echo -n "$FILE_CONTENT" | base64 -w0)

curl -s -X PUT "https://api.github.com/repos/$GITHUB_REPO/contents/$FILE_PATH" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"$COMMIT_MSG\",
    \"content\": \"$CONTENT_B64\",
    \"branch\": \"$BRANCH\"
    $([ -n \"$FILE_SHA\" ] && echo ", \"sha\": \"$FILE_SHA\"")
  }"
```

## Conventions
- Branch naming: `feature/<task-slug>`
- Commit messages: `feat|fix|refactor|test|docs: <description>`
- PR titles: `[task-id] <description>`
- Always create PRs against `main`
- Never force-push to `main`
