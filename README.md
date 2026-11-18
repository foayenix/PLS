# Fieldwork — Felix’s AI Learning Studio

A personal learning portal for applied AI engineering.

## What works

- A seven-checkpoint applied AI path with a curated Udemy watch list, practical projects, and a guide to overlapping courses. The original 32 lessons are available as reference chapters.
- A searchable library of the complete 542-lesson source curriculum.
- Source lesson reader with code, tables, original source links and personal practice.
- Source quizzes for the path lessons where the upstream repository provides one.
- Bookmarks, lesson completion, notes and reflections.
- A 12-checkpoint security foundations track with original guides, exercises, recall questions, bookmarks, notes and progress.
- Twenty project briefs, including ten original builds designed around Felix’s work: invoice reconciliation, Sanko corrections, booking changes, code-change test mapping, evidence freshness and agent permissions.
- The original builds have four practical sessions each, explicit finish criteria, follow-on milestones, skills and a value test. Session completion and observed value/feedback are stored in the existing project record.
- New-project evidence bundles (repository, demo, report and case-study notes), one active project, Markdown case-study export and copyable post drafts. Original builds also require value-test notes before the evidence bundle is marked ready.
- A reference shelf linking all five user-selected security and AI repositories, with guidance on how to use each.
- Career Studio with a six-week applied AI roadmap, Azure and business analysis resources, timed interview drills, a reusable job requirement board with optional role templates, and an eleven-course schedule calculator. The AI automation track includes a UK role skills matrix, three project briefs and downloadable synthetic practice cases. Career records use the existing authenticated storage and backup format.
- Five personally supplied Udemy outlines with searchable lecture titles and timings, per-lecture progress, a guided route linked to Fieldwork lessons and project briefs, and optional schedule progress updates.
- Focus timer, real study-session log and an editable weekly study intention.
- User-scoped Cloudflare D1 records, with a browser queue for interrupted saves.
- JSON backup/restore and Markdown note export.

Course completion and project checks are self-reported. The portal does not execute learner code. Tutor assistance copies a prompt for use in an external AI assistant; it is not a built-in model integration.

## Source attribution

Source curriculum: https://github.com/rohitg00/ai-engineering-from-scratch
Author: Rohit Ghumare and contributors.
Pinned revision: 71dc48bff5c73c995a169edc8796d6cabbc787e1.
Imported on 23 October 2026. Original MIT copyright and license notice: COURSE-LICENSE.txt.

The personal route, practice briefs and notebook are separate from the source curriculum. Published lesson timings are estimates from the source; practice and project work take additional time. Diagrams and interactive figures have links to the original presentation where required.

Security guides in `lib/security.ts` and the original project briefs in `lib/practice.ts` are original Fieldwork content, with links to source repositories and official documentation. They do not reproduce third-party course material. Resource links were reviewed on 23 October 2026; individual reference implementations have not all been executed or audited. The security track uses `lesson:security/<id>` records so it participates in the existing user-scoped notes, backup and sync system. Existing record IDs are preserved.

## Development

This source export includes the learning material and project briefs. Local configuration is provided in .openai/hosting.json. For a new hosted Site, supply your own Site project ID and bind Cloudflare D1 as DB. User progress starts fresh in this checkout.

Use the supplied Sites workflow. Dependencies are managed with pnpm. Run `npm run dev` for a local development server, `npm run db:generate` after a schema change, and `npm run build` for the deployable Worker. D1 migrations are under `drizzle/`.

The host supplies authenticated identity. `/api/records` requires that identity, scopes each query by user ID, checks mutation origins and limits record size. Never add a production identity bypass. Local browser preview may show a device copy when hosted identity is unavailable.

Source course files are static assets under `public/course-content/`. `lib/course.json` contains the source catalog and personal route. No runtime request to GitHub is needed to read lessons.
