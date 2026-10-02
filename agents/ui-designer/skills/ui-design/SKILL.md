---
name: ui-design
description: >
  Design UI components, design systems, and interfaces. Use when asked to
  create buttons, forms, cards, layouts, dashboards, design tokens, color
  systems, typography scales, or any visual interface work. Also use for
  accessibility audits, responsive design specs, and developer handoff docs.
metadata:
  openclaw:
    emoji: 🎨
---

# UI Design Skill

## When to Use
- Creating new UI components (buttons, forms, cards, modals, navigation)
- Building or updating design token systems (colors, typography, spacing)
- Designing responsive layouts for specific breakpoints
- Performing accessibility audits on existing interfaces
- Preparing developer handoff specifications
- Creating dark mode / theming variants
- Reviewing and improving existing UI implementations

## Design Token Reference

Before creating anything, check `MEMORY.md` for established tokens.
Never introduce a new token value without first confirming it doesn't
duplicate an existing one.

### Token file location
```
frontend/assets/css/design-tokens.css
```

### Token naming convention
```
--color-{palette}-{shade}     (e.g., --color-primary-500)
--font-size-{name}            (e.g., --font-size-lg)
--space-{multiplier}          (e.g., --space-4 = 16px)
--shadow-{size}               (e.g., --shadow-md)
--transition-{speed}          (e.g., --transition-fast)
```

## Component Creation Workflow

### 1. Check Existing Patterns
```bash
# Search memory for similar components
memory_search "component [name]"
# Check if a base component exists that can be extended
```

### 2. Define the Component Spec

Every component needs this minimum spec before implementation:

```
Name:       PascalCase (e.g., ClockInButton)
Purpose:    One sentence
Variants:   List all visual variants
Sizes:      List all size options
States:     default | hover | active | focus | disabled | loading | error | empty
Props:      List with types and defaults
Tokens:     Which design tokens it uses
Responsive: Behavior at each breakpoint
A11y:       Keyboard nav, ARIA, contrast
```

### 3. Write the CSS / Tailwind Implementation

Provide both raw CSS (using design tokens) and Tailwind equivalents:

```css
/* Design token version */
.btn-primary {
  background-color: var(--color-primary-500);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

/* Tailwind equivalent */
/* class="bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition-all duration-150" */
```

### 4. Include All States

```css
/* Required states for every interactive component */
.component         { /* default */ }
.component:hover   { /* hover — never rely on hover alone for mobile */ }
.component:active  { /* pressed / active */ }
.component:focus-visible { /* keyboard focus — always visible, never remove */ }
.component:disabled { opacity: 0.6; cursor: not-allowed; pointer-events: none; }
.component--loading { /* show spinner, disable interaction */ }
.component--error   { /* error visual treatment */ }
```

### 5. Responsive Implementation

```css
/* Mobile first — base styles are mobile */
.component { /* mobile layout */ }

@media (min-width: 640px)  { .component { /* tablet adjustments */ } }
@media (min-width: 1024px) { .component { /* desktop layout */ } }
@media (min-width: 1280px) { .component { /* large screen optimizations */ } }
```

### 6. Accessibility Checklist

Before marking a component complete:

- [ ] Color contrast: 4.5:1 for normal text, 3:1 for large text
- [ ] Focus indicator: `focus-visible` outline is clearly visible
- [ ] Keyboard: component is fully operable via keyboard
- [ ] Screen reader: semantic HTML or ARIA labels present
- [ ] Touch target: minimum 44px on mobile
- [ ] Motion: respects `prefers-reduced-motion`
- [ ] Dark mode: verified in both themes

### 7. Document and Handoff

Write component documentation following the template in AGENTS.md.
Notify frontend-dev via `sessions_send` when ready.

## Dark Mode Design Rules

```css
/* Use CSS custom properties for theming */
:root {
  --bg-primary: #ffffff;
  --text-primary: #111827;
  --border-color: #e5e7eb;
}

[data-theme="dark"] {
  --bg-primary: #111827;
  --text-primary: #f9fafb;
  --border-color: #374151;
}

/* OR with Tailwind */
/* class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50" */
```

Rules:
- Don't just invert colors. Dark backgrounds need reduced contrast
  to avoid eye strain (use gray-50/gray-100 text, not pure white).
- Shadows don't work on dark backgrounds. Use subtle borders or
  lighter background elevation instead.
- Test every component in both themes before marking complete.

## Asset Optimization

- Icons: SVG preferred, Lucide icon library is in the stack.
- Images: WebP format, max 200KB for UI assets.
- Fonts: Load via @fontsource packages, subset when possible.
- Avoid large background images — use CSS gradients or patterns.

## Guardrails

- Never use `!important` unless overriding third-party CSS.
- Never remove focus outlines (`outline: none`) without providing
  a visible `focus-visible` alternative.
- Never use color alone to convey meaning — add icons or text labels.
- Never hardcode breakpoint values — use the established token scale.
- Never skip the mobile viewport — always design mobile-first.
