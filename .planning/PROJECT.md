# TeamUp Platform

## Core Value
A web platform that helps students and developers find teammates for projects and provides a workspace to collaborate, with AI-driven matching to ensure compatibility and reliability scores to prevent "ghosting".

## What This Is
TeamUp is an all-in-one team finding and project management workspace. Users build profiles with skills and "vibes". Project owners post ideas. An AI algorithm matches users based on skills and teamwork styles. Each project gets a dedicated workspace with Kanban, Chat, and GitHub integration.

## Context
- **Target Audience**: Students and developers looking for project teammates.
- **Problem**: Many have ideas but lack the right team; random teams often fail due to mismatched goals or commitment ("ghosting").
- **Solution**: AI matching based on more than just skills (vibe, availability, seriousness) + reliability scores + integrated workspace.
- **Tech Stack**: Next.js, Supabase, Vanilla CSS, custom AI matching algorithm.

## Requirements

### Validated
(None yet — ship to validate)

### Active
- [ ] Authentication (Login / Register).
- [ ] User Profiles (Skills, timezone, free time, work style, reliability score).
- [ ] Project Board (Post project ideas, roles needed, tech stack).
- [ ] Custom AI Matching Algorithm (Calculate match score based on profiles and project needs).
- [ ] Project Workspace (Kanban Board for tasks).
- [ ] Project Workspace (Team Chat using Supabase Realtime).
- [ ] Project Workspace (GitHub integration for tracking actual commit progress).
- [ ] Reliability Score System (Points based on tasks done, commits, and peer reviews).

### Out of Scope
- [Mobile App] — Focus on responsive web app first for MVP.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js + Supabase | Robust SSR and built-in Auth/Realtime DB ideal for Chat and Workspaces. | Pending |
| Vanilla CSS | Maximum flexibility for unique UI/UX. | Pending |
| Custom AI Algorithm | Start with self-written algorithm before relying entirely on third-party APIs. | Pending |

---
*Last updated: 2026-05-09 after initialization*
