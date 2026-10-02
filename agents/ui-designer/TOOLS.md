# TOOLS.md — UI Designer Tool Notes

## Design Tools

### Browser / exec
- Use the browser tool to reference existing UI patterns and check
  live implementations.
- Use exec to run CSS/HTML validation, image optimization, or
  asset generation scripts.

### File Operations
- Read existing component files before creating new ones.
- Write design specs as markdown files in the workspace.
- Export CSS design tokens as `.css` or `.json` files.

## Frontend Conventions

### CSS Framework
- **Tailwind CSS** is the primary utility framework for Vue/Nuxt projects.
- When providing component specs, include both design token values AND
  the equivalent Tailwind classes.
- Example: `padding: var(--space-4)` → `p-4`

### Component Format
- Vue 3 Single File Components (SFC) with `<script setup>`.
- Nuxt 3 conventions for layouts, pages, and components.
- Components go in `components/` with PascalCase naming.

### File Naming
- Components: `PascalCase.vue` (e.g., `ClockInButton.vue`)
- Design tokens: `design-tokens.css` or `tokens.json`
- Stylesheets: `kebab-case.css`

## Asset Guidelines

- **Icons:** Use Lucide icons (already in the stack) or SVG.
- **Images:** WebP format preferred. Max 200KB for UI assets.
- **Fonts:** Inter for UI text. JetBrains Mono for code/monospace.
  Load via `@fontsource` packages, not external CDN.

## Design Token File Location

Design tokens live at:
```
frontend/assets/css/design-tokens.css
```

Component-specific styles:
```
frontend/components/[ComponentName].vue  (scoped styles)
```

## Color Accessibility Tools

When checking contrast ratios, use these formulas or reference:
- Normal text (< 18px): minimum 4.5:1 contrast ratio
- Large text (≥ 18px bold or ≥ 24px): minimum 3:1 contrast ratio
- UI components and graphics: minimum 3:1 contrast ratio

## Notion Integration

- The `notion-tracker` skill is available for reporting activity.
- Use Notion MCP tools to update the Agent Board and Operations Log.
- See AGENTS.md for reporting rules.
