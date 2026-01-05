# Contributing to antstack-js

First off, thank you for considering contributing to antstack-js! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and inclusive in all interactions.

---

## How Can I Contribute?

### 🐛 Reporting Bugs

- Check if the bug has already been reported in [Issues](https://github.com/SibilSoren/antstack-js/issues)
- If not, create a new issue with:
  - Clear title and description
  - Steps to reproduce
  - Expected vs actual behavior
  - Your environment (Node version, OS, etc.)

### 💡 Suggesting Features

- Open an issue with the `enhancement` label
- Describe the feature and its use case
- Explain why it would benefit users

### 🔧 Code Contributions

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## Development Setup

### Prerequisites

- Node.js 18+
- npm or pnpm

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/antstack-js.git
cd antstack-js

# Install dependencies
npm install

# Build the CLI
npm run build

# Link for local testing
npm link

# Test locally
antstack my-test-app
```

### Running the Docs

```bash
cd docs
npm install
npm run dev
```

---

## Project Structure

```
antstack-js/
├── src/                    # CLI source code
│   ├── index.ts            # Entry point
│   ├── commands/           # Command handlers
│   │   ├── add.ts          # antstack add
│   │   ├── generate.ts     # antstack generate
│   │   └── modules/        # Module handlers
│   └── utils/              # Utilities
│       └── scaffold.ts     # Scaffolding logic
├── templates/              # Project templates
│   ├── base/               # Shared base files
│   ├── frameworks/         # Framework-specific
│   │   ├── express/
│   │   ├── hono/
│   │   └── fastify/
│   ├── orms/               # ORM-specific
│   │   ├── prisma/
│   │   ├── drizzle/
│   │   └── mongoose/
│   └── modules/            # Add-on modules
│       └── auth/
├── docs/                   # Documentation site
└── dist/                   # Built output
```

---

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for automated releases.

### Format

```
<type>(<scope>): <description>

[optional body]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, etc.) |
| `refactor` | Code change that neither fixes nor adds |
| `perf` | Performance improvement |
| `test` | Adding tests |
| `chore` | Maintenance tasks |

### Examples

```bash
feat(cli): add support for Fastify framework
fix(auth): correct JWT token expiration
docs: update README with new commands
```

---

## Branching & Release Workflow

We use a structured branching model to ensure stable releases:

- **`develop`**: The primary integration branch. All feature branches and bug fixes should be merged here. **No automatic releases** are triggered from this branch.
- **`next`**: Used for public pre-releases. Merging `develop` into `next` triggers an automatic **pre-release** (e.g., `v1.1.0-next.1`) published to NPM under the `@next` tag.
- **`main`**: The stable production branch. Merging `next` into `main` triggers a full **production release** (e.g., `v1.1.0`) published to NPM under the `@latest` tag.

## Pull Request Process

1. **Create a branch** from `develop`:
   ```bash
   git checkout -b feat/my-feature
   ```

2. **Make your changes** and commit following the [Commit Guidelines](#commit-guidelines).

3. **Test your changes** locally:
   ```bash
   npm run build
   npm link
   antstack test-project
   ```

4. **Push and create a PR** targeting the `develop` branch:
   ```bash
   git push origin feat/my-feature
   ```

5. **Fill out the PR template** with:
   - Description of changes
   - Related issue (if any)
   - Screenshots (if UI changes)

6. **Wait for review** - maintainers will review and provide feedback

---

## Adding New Features

### Adding a New Framework

1. Create template in `templates/frameworks/<name>/`
2. Update `src/index.ts` to include the option
3. Update documentation

### Adding a New ORM

1. Create template in `templates/orms/<name>/`
2. Update `src/utils/scaffold.ts` for dependencies
3. Update documentation

### Adding a New Module

1. Create template in `templates/modules/<name>/`
2. Create handler in `src/commands/modules/<name>.ts`
3. Update `src/commands/add.ts`
4. Update documentation

---

## Questions?

Feel free to open an issue or reach out to the maintainers. We're happy to help!

---

Thank you for contributing! 🚀
