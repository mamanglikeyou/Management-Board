# Adhivasindo Task Board

A Kanban task-management board built with **Ionic 9 + Vue 3 + TypeScript** for the Adhivasindo frontend test.
No backend: all data lives in the browser (Pinia + localStorage).

## Features

| Requirement | Implementation |
| --- | --- |
| Board & columns | To do / Doing / Review / Done / Rework, plus **Add new List**, rename, delete, collapse |
| Task card | Title, label, checklist progress bar, due date, checklist count, attachment count, assignee avatars, cover image |
| Filter & search | Search (title, description, label, assignee, subtasks) + filter by assignee, label and due date (overdue / today / 7 days / none / specific date) |
| CRUD | Create (column "+"), read (cards), update and delete in the detail modal |
| Drag & drop | Move cards between and within columns (SortableJS, touch friendly, works while filtering) |
| Checklist | Add / tick / remove subtasks, progress bar updates automatically |
| Storage | Pinia stores persisted to localStorage through a swappable storage driver |
| Bonus | Cover image upload, toasts for create / update / delete, animations, activity log, export / import JSON, multiple boards |
| Responsive | Desktop layout from the design; on mobile one column per screen with snap scrolling and a full-screen detail view |

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (Vitest)
npm run lint       # ESLint + Vue + TypeScript rules
npm run build      # type-check + production build
```

## Architecture

```
src/
├── core/                 framework-agnostic building blocks
│   ├── storage/          StorageDriver interface + Pinia persist plugin
│   └── utils/            date, file, id, clone helpers
├── theme/                design tokens (measured from the reference) + Ionic theme
├── shared/               reusable UI: AvatarStack, LabelBadge, ProgressBar, DateChip,
│   │                     FieldSelect, ActionMenu, InlineInput, SectionBlock, buttons…
│   ├── composables/      useToast, useConfirm
│   └── icons/            single icon registry (Ionicons + custom design glyphs)
├── features/
│   ├── board/            board & column store, header, columns, page
│   ├── task/             task store, card, detail modal, form logic, activity log
│   ├── filter/           filter store + pure `matchTask` predicate
│   ├── members/          team members
│   └── transfer/         export / import / reset
└── data/                 seed data that mirrors the design
```

Key decisions:

- **Feature-first folders.** Each feature owns its store, components and logic, so features can grow independently.
- **Logic out of components.** Filtering (`matchTask`), checklist progress, ordering (`positionBetween`) and the activity diff are pure functions and covered by unit tests. Components only render and emit events.
- **Swappable persistence.** Stores opt in with `persist: { key, version }`, and the plugin talks to a `StorageDriver`. Moving to IndexedDB, Ionic Storage or a REST API means writing one new driver.
- **Draft-based editing.** The detail modal edits a copy (`useTaskForm`). Save commits it, Discard drops it, and closing with unsaved changes asks for confirmation.
- **Fractional ordering.** Each task has a numeric `position`, so a drag & drop rewrites only the moved card. That is ready for a real API.
- **Design tokens.** Colours, radii and sizes are CSS variables in `theme/tokens.css`. They were measured from the reference screenshots, which were exported at 125 % scale.

## Deployment

The project is ready for Vercel (`vercel.json` includes the SPA rewrite):

```bash
npx vercel        # first time: log in and link the project
npx vercel --prod
```

## Notes

- Cover images are dummy photos from Unsplash (allowed by the brief).
- Avatars are generated once into `public/avatars` with `npm run avatars`.
