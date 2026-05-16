# TaskFlow ✦ Premium To-Do App

A premium, ultra-aesthetic productivity app built with React + TypeScript + Tailwind CSS + Framer Motion.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Features

- ✅ Add / edit (double-click) / delete tasks
- ✅ Animated checkbox with ripple effect
- ✅ Drag & drop reordering (via @dnd-kit)
- ✅ Task priorities: Low / Medium / High with color system
- ✅ Due dates with overdue/today/soon indicators
- ✅ Search + filter (All / Active / Done)
- ✅ Auto-save to localStorage (no buttons needed)
- ✅ Dark / Light mode toggle (respects OS preference)
- ✅ Task progress bar with animated fill
- ✅ Beautiful empty states

## Tech Stack

- React 18 + TypeScript (Vite)
- Tailwind CSS v4
- Framer Motion (spring animations)
- @dnd-kit (drag & drop)
- lucide-react (icons)
- DM Sans + DM Mono fonts (Google Fonts)

## Project Structure

```
src/
  components/
    AnimatedCheckbox.tsx   # Ripple + SVG check animation
    TaskCard.tsx           # Main task item with drag, edit, priority
    TaskInput.tsx          # Floating add bar with priority/date pickers
    TaskList.tsx           # DnD context + sortable list
    Header.tsx             # Title, search, filter tabs, theme toggle
    ProgressBar.tsx        # Animated completion progress
    EmptyState.tsx         # Beautiful illustrated empty state
  hooks/
    useTasks.ts            # All task logic + localStorage persistence
  types/
    index.ts               # TypeScript interfaces
  utils/
    priority.ts            # Priority colors, due date formatting
  App.tsx                  # Root layout
  index.css                # Glassmorphism, gradients, animations
```
