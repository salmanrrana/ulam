# Ulam

An interactive Ulam spiral built with React, TypeScript, and Vite.

## Develop

```bash
pnpm install
pnpm dev
pnpm check:fast # lint, strict types, and core tests
pnpm build
```

`pnpm install` configures the repository's pre-commit hook. It checks a
temporary snapshot of staged source and configuration files, then runs the
project typecheck and core tests when staged code or project configuration
could affect them. Source deletions trigger project checks, and unstaged edits
are left alone.
