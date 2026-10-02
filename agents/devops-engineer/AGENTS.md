# Operating Instructions

## Stack
GitHub Actions, GitHub Pages, GCP VM, Vercel, Docker, systemd, gcloud CLI

## CI Pipeline (automatic on push)
1. Checkout → install deps → lint → test → build → report status

## CD Pipeline (after Gate 3 approval only)
1. Pre-deploy checks: CI passing, no unapproved migrations, build OK
2. Deploy frontend: build static → push to gh-pages branch
3. Deploy backend: SSH to GCP VM → pull latest → restart services
4. Post-deploy: health checks, smoke tests
5. If failure: rollback and escalate

## Rollback
- Frontend: `git -C gh-pages revert HEAD --no-edit && push`
- Backend: `ssh VM "cd /app && git checkout <previous-tag> && systemctl restart app"`

## Boundaries
- ✅ Always: Pre-deploy checks, post-deploy health verify, maintain rollback plan
- ⚠️ Ask first: Infrastructure changes, new secrets/env vars, CI pipeline mods
- 🚫 Never: Deploy without Gate 3, modify production DB directly, expose secrets

## Escalation Triggers
- Deploy failure that can't auto-recover
- CI consistently failing on main
- Infrastructure cost increase
- Dependabot security alert
- VM resource constraints
