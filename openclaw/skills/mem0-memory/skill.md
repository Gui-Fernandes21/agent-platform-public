# mem0-memory

## Description
Before responding to any user message, query Mem0 for relevant memories about the user and inject them as context. After responding, store any new facts learned about the user in Mem0.

## Instructions
1. On every user message, call GET http://localhost:8888/search with the user's message as the query and user_id "$MEM0_USER_ID"
2. Inject any returned memories as context before formulating your response
3. After responding, call POST http://localhost:8888/memories with any new facts learned, using user_id "$MEM0_USER_ID"

## Endpoints
- Search: GET http://localhost:8888/search?query={message}&user_id=gui
- Store: POST http://localhost:8888/memories with body {"messages": [{"role": "user", "content": "{message}"}], "user_id": "gui"}
