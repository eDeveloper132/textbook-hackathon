# 🔄 GitHub Configuration

GitHub-specific configuration files for the Physical AI Textbook project.

## 📁 Structure

```
.github/
├── copilot-instructions.md   # GitHub Copilot rules
├── prompts/                  # Copilot prompt templates
└── workflows/                # GitHub Actions CI/CD
    └── deploy.yml            # Deployment workflow
```

## 📋 Files

### copilot-instructions.md

Custom instructions for GitHub Copilot when working in this repository:

- Spec-Driven Development (SDD) guidelines
- PHR (Prompt History Record) requirements
- ADR (Architectural Decision Record) suggestions
- Code style preferences

### workflows/deploy.yml

GitHub Actions workflow for automated deployment:

**Triggers**:
- Push to `main` branch
- Manual workflow dispatch

**Jobs**:
1. **Build Frontend**
   - Install Node.js dependencies
   - Run `npm run build`
   - Upload build artifacts

2. **Deploy to GitHub Pages**
   - Download build artifacts
   - Deploy to `gh-pages` branch

3. **Trigger Render Deploy** (optional)
   - Webhook to Render.com for backend deployment

### Example Workflow

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: physical-ai-textbook/package-lock.json
      
      - name: Install dependencies
        working-directory: physical-ai-textbook
        run: npm ci
      
      - name: Build
        working-directory: physical-ai-textbook
        run: npm run build
        env:
          REACT_APP_BACKEND_URL: ${{ secrets.BACKEND_URL }}
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: physical-ai-textbook/build
```

## 🔐 Required Secrets

Configure these in repository Settings → Secrets:

| Secret | Description |
|--------|-------------|
| `BACKEND_URL` | Production backend URL |
| `RENDER_DEPLOY_HOOK` | Render.com deploy webhook (optional) |

## 🏷️ Branch Protection

Recommended settings for `main` branch:

- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Include administrators

## 📝 Issue Templates

Create issue templates in `.github/ISSUE_TEMPLATE/`:

- `bug_report.md` - Bug report template
- `feature_request.md` - Feature request template

## 🔀 Pull Request Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Documentation updated
```

---

Part of the [Physical AI Textbook](../physical-ai-textbook/README.md) project
