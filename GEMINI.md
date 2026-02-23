# Judo Calendar - Gemini CLI Configuration

This file provides project-specific context and instructions for Gemini CLI.

## Project Overview
Judo Calendar is a training log and technique management application for judo practitioners, built with React Router v7 and Firebase.

## Core Tech Stack
- **Framework:** React Router v7 (Vite-based)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + Shadcn UI (Radix UI)
- **Backend:** Firebase (Firestore, Auth, Hosting)
- **Package Manager:** pnpm (v10+)
- **Validation:** Zod
- **Forms:** React Hook Form

## Directory Structure
- `app/`: Main application source code.
  - `routes/`: Route components using flat-file routing.
  - `components/`: UI components.
    - `ui/`: Shadcn UI primitives.
  - `services/`: Data fetching, Firebase hooks, and business logic.
  - `models/`: TypeScript interfaces and Zod schemas for data structures.
  - `modules/`: Feature-specific modules and layout components (e.g., Header).
  - `server/`: Server-side logic and Firebase Admin initialization.
  - `lib/`: Shared utilities (e.g., `utils.ts` for Tailwind merge).
- `tools/`: Utility scripts for data management and seeding.

## Development Workflow
- **Start Dev Server:** `pnpm dev`
- **Build Project:** `pnpm build`
- **Linting:** `pnpm lint`
- **Type Checking:** `pnpm typecheck`
- **Deployment:** `pnpm deploy` (Builds and deploys to Firebase Hosting)

## Coding Standards & Conventions
- **Path Aliases:** Use `~/` to refer to the `app/` directory (e.g., `import { Button } from "~/components/ui/button"`).
- **Components:**
  - Prefer functional components with Arrow Function syntax.
  - Use Shadcn UI primitives for basic UI elements.
  - Keep components modular and reusable.
- **Data Fetching:**
  - Use hooks from `app/services/` for interacting with Firestore.
  - Define data models in `app/models/` using TypeScript interfaces.
- **Styling:**
  - Use Tailwind CSS utility classes.
  - Follow the Shadcn/Radix UI patterns for accessible components.
- **Firebase:**
  - Client-side Firebase: `app/firebase.client.ts`.
  - Server-side Firebase: `app/server/firebase.server.ts`.
  - Use `AuthProvider` from `~/services/auth-provider` for authentication context.
  - Core Collections: `trainings`, `techniques`, `users` (available via `Collections` enum in `app/services/firebase-data-service.ts`).
- **Date Handling:**
  - Use `luxon` for date and time manipulations.
  - Firestore Timestamps should be converted to/from `luxon.DateTime` in data converters.

## Common Tasks
- **Creating a New Route:** Add a new `.tsx` file in `app/routes/`.
- **Adding UI Components:** Use `npx shadcn-ui@latest add [component]` or manually create them in `app/components/ui/`.
- **Adding a New Service:** Create a new hook or service file in `app/services/` to encapsulate Firestore logic.
- **Updating Data Models:** Modify or add interfaces in `app/models/`.
