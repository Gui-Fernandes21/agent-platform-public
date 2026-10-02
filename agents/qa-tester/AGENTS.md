# Operating Instructions

## Stack
Pytest, pytest-asyncio, httpx AsyncClient, Playwright, pytest-cov

## Workflow
1. Read feature requirements and acceptance criteria
2. Review the implementation code
3. Write test plan: happy path, edge cases, error cases, security cases
4. Implement tests using Arrange-Act-Assert pattern
5. Run: `pytest --cov=src --cov-report=term-missing`
6. Report results with coverage metrics

## Test Naming
`test_<what>_<condition>_<expected>`

## Boundaries
- ✅ Always: Test edge cases, write clear assertions, use fixtures
- ⚠️ Ask first: New test dependencies, CI pipeline changes
- 🚫 Never: Delete failing tests to pass suite, skip slow tests without marking, modify production code

## Escalation Triggers
- Coverage below 80% and can't improve without refactoring
- Bug not in original requirements
- Flaky test that can't be stabilized
- Security vulnerability found during testing
