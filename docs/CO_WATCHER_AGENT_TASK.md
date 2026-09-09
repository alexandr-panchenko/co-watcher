# Co-Watcher Master Execution Task Manifest (`CO_WATCHER_AGENT_TASK.md`)

This document serves as the master autonomous execution plan and implementation manifest for **Antigravity** and pair-programming collaborators. It governs Phase 2 (Code Implementation, Tasks 14 through 22) for the **Co-Watcher** project.

---

## 1. Mission Statement & Working Context

### 1.1 Core Product Thesis
**Co-Watcher is a knowledgeable viewing companion that independently researches what is happening in a video, adds the context the viewer did not know to ask for, and helps the viewer turn their own recorded reactions into a simple finished reaction video.**

The core loop is:
$$\\text{Find or choose} \\longrightarrow \\text{Watch} \\longrightarrow \\text{Discover context} \\longrightarrow \\text{Record a human reaction} \\longrightarrow \\text{Assemble and review}$$

### 1.2 Strict Precedence Hierarchy
When resolving implementation questions, agents must strictly follow this order of precedence:
1. **Behavioral Decisions & Constraints:** The latest owner-approved specifications in [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md).
2. **Visual Appearance & Spacing:** The final Google Stitch screen designs and design tokens in [`DESIGN.md`](file:///home/alex/github/co-watcher/DESIGN.md).
3. **Technical Architecture & Evaluation Invariants:** The concrete technical specifications in [`docs/CO_WATCHER_DEPLOYMENT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_DEPLOYMENT.md) and [`docs/CO_WATCHER_EVAL_PLAN.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_EVAL_PLAN.md).

### 1.3 Operational Invariants
- **Execute Only the Currently Assigned Task:** Never jump ahead or build speculative features.
- **Zero Suppression Escapes:** Absolutely no `eslint-disable`, `@ts-ignore`, `@ts-nocheck`, or Knip ignores. All checks must pass mechanically.
- **Strict Size Limits:** Components $\\le 220$ LOC, other source files $\\le 340$ LOC, functions $\\le 100$ LOC, cyclomatic complexity $\\le 12$, nesting $\\le 4$, parameters $\\le 4$.
- **Environment Discipline:** Bun for local development and tests; standard Node.js 22 for Cloud Run production runtime.
- **Zero Token/Secret Leaks:** Never hardcode, print, or commit API keys or credentials.
- **Provenance Transparency:** Native workspace authorship only; no borrowed code from legacy hackathons.

---

## 2. Governing Specifications & Repository Index

Every agent working on Co-Watcher must understand the specific role of each specification file:

| Document | File Path | Role & Operational Authority |
| :--- | :--- | :--- |
| **Operating Contract** | [`AGENTS.md`](file:///home/alex/github/co-watcher/AGENTS.md) | Supreme repository contract: non-degradation rules, execution bounds, quality gates, and truthful reporting standards. |
| **Implementation Handout** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md) | Primary product specification: Section 0 (Architectural Decisions), scope inclusions/exclusions, layout invariants, tool schemas, and editorial criteria. |
| **Evaluation Plan** | [`docs/CO_WATCHER_EVAL_PLAN.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_EVAL_PLAN.md) | Multi-tier test definitions: Bun deterministic unit tests, Playwright DOM geometry layout measurements, Google-model semantic rubric, and live integration protocols. |
| **Deployment Specification** | [`docs/CO_WATCHER_DEPLOYMENT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_DEPLOYMENT.md) | Cloud infrastructure: Cloud Run services, Firestore Native schema, GCS bucket layout, Dockerfile.renderer (FFmpeg), and GitHub Actions CI/CD. |
| **Status Registry** | [`docs/CO_WATCHER_STATUS.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_STATUS.md) | Single source of truth for task completion checklists, settled architectural decisions, and requirement-location mappings. |
| **Design System & Tokens** | [`DESIGN.md`](file:///home/alex/github/co-watcher/DESIGN.md) | Curated color palettes, typography scales, spacing tokens, and elevation tokens. |
| **Approved Stitch Screens** | [`stitch_co_watcher_ai_video_workspace/`](file:///home/alex/github/co-watcher/stitch_co_watcher_ai_video_workspace) | Authoritative visual exports for landing, split workspace, theater mode, modal recording, feed items, and composition review. |

---

## 3. Autonomous Execution Roadmap (Tasks 14 – 22)

Phase 2 implementation must proceed in strict numerical sequence. Each numbered task is an isolated, verifiable work unit.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Phase 2 Implementation Roadmap                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ Task 14: Tooling & Mechanical Quality Gates Setup                           │
│ Task 15: Integration Spikes & High-Risk Boundaries (Gemini + Parallel)       │
│ Task 16: Authoritative State, Backend API & Semantic Tool Handlers          │
│ Task 17: Watch Workspace Layout & YouTube IFrame Synchronization            │
│ Task 18: Autonomous Research Pipeline & Commentary Slice                   │
│ Task 19: In-Browser Reaction Recording Engine                               │
│ Task 20: Timeline Composition, Conversational Edits & FFmpeg Rendering      │
│ Task 21: Full Verification, Playwright DOM Geometry & Semantic Grader       │
│ Task 22: Production Cloud Run Deployment & Contest Submission Packaging     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Task 14 — Tooling & Mechanical Quality Gates Setup (COMPLETED)
- **Scope:** Configure and enforce all automated quality gates before writing feature code.
- **Deliverables:**
  - Strict `tsconfig.json` (no implicit any, strict null checks, unchecked indexed access, exact optional property types).
  - ESLint configuration with strict type-aware rules, react-hooks, accessibility, and complexity/depth limits.
  - Knip configuration (`knip.jsonc`) with standard and production strict scans (`bun run knip`, `bun run knip:prod`).
  - Suppression checker script (`scripts/check-suppressions.ts`) blocking `@ts-ignore`, `eslint-disable`, etc.
  - Architectural metrics checker script (`scripts/check-metrics.ts`).
  - Pre-commit hook configuration (`.git/hooks/pre-commit`) executing `bun run check:all`.
  - Canonical scripts in `package.json` (`typecheck`, `lint`, `knip`, `knip:prod`, `check:suppressions`, `check:metrics`, `check:all`, `ci`).

### Task 15 — Integration Spikes & High-Risk Boundaries
- **Scope:** Validate the highest-risk cloud integrations in isolation using real API keys without building full UI yet.
- **Deliverables:**
  - Standalone spike `scripts/spike-gemini-video.ts` ingesting a real YouTube URL into `gemini-2.5-flash` via `@google/genai` and verifying timestamped marker generation.
  - Standalone spike `scripts/spike-parallel-search.ts` querying `https://api.parallel.ai/v1/search` with `PARALLEL_API_KEY`, verifying dense excerpt extraction and schema compliance.
  - Standalone spike `scripts/spike-ffmpeg-assembly.ts` verifying FFmpeg command string generation for joining video fragments + audio takes.

### Task 16 — Authoritative State, Backend API & Semantic Tool Handlers
- **Scope:** Build the serverless backend service and data layer.
- **Deliverables:**
  - Node.js 22 + Hono HTTP server (`src/server/index.ts`) serving REST endpoints and SSE updates.
  - Firestore Native integration: schemas for `/rooms/{roomId}`, `/comments`, `/reactions`, and `/composition/current`.
  - Secret-link capability token generator and SHA-256 validator middleware (`Authorization: Bearer <token>`).
  - Implement the 5 typed semantic agent tools with Zod schema validation:
    1. `set_viewing_context`
    2. `search_parallel_evidence`
    3. `publish_commentary`
    4. `assemble_reaction_composition`
    5. `get_room_state`

### Task 17 — Watch Workspace Layout & YouTube IFrame Synchronization
- **Scope:** Implement the foundational watch interface adhering to the approved Stitch design.
- **Deliverables:**
  - Real YouTube IFrame Player API integration (`window.YT.Player`) with postMessage timing bridge (250ms interval while playing). Zero controls alteration.
  - Two-column desktop layout strictly enforcing height locking: left stage sets section height; right commentary aligns top/bottom and scrolls internally.
  - Thin gem rail strip integrated into player metadata container with dynamic marker clustering on viewport resize.
  - Chronological feed sorted strictly by `sourceTimestampSeconds` with active playback highlighting and manual-scroll protection.

### Task 18 — Autonomous Research Pipeline & Commentary Slice
- **Scope:** Wire Gemini video comprehension and Parallel Search runtime research into the live watch flow.
- **Deliverables:**
  - Discrete lifecycle triggers (initial video load, chapter approach, user inquiry) executing chunked Gemini analysis.
  - Runtime research engine: claim detection ➔ Parallel Search dispatch (max 3 fan-out, SHA-256 caching) ➔ structured `EvidenceSource` extraction.
  - Publication of timestamped commentary cards with expandable evidence citations and optional verified supporting images.
  - Conversational composer integration: asking questions about video context, updating viewing preferences, and receiving personalized recommendations.

### Task 19 — In-Browser Reaction Recording Engine
- **Scope:** Implement the human reaction capture workflow.
- **Deliverables:**
  - Explicit recording modal triggered from source moments or commentary cards.
  - `MediaRecorder` audio/video capture targeting `video/webm;codecs=vp9,opus` (with fallback matrix).
  - Audio track isolation via `getUserMedia` echo-cancellation constraints to prevent YouTube speaker echo.
  - Immediate `MediaStreamTrack` stop/cleanup on recording exit to turn off device lights.
  - Take state machine: Review ➔ Re-record ➔ Keep. Kept takes upload to GCS (`gs://${BUCKET}/rooms/{id}/reactions/{takeId}.webm`) with local Blob fallback on network failure.
  - Saved reactions appear seamlessly in the chronological feed and on the gem rail.

### Task 20 — Timeline Composition, Conversational Edits & FFmpeg Rendering
- **Scope:** Implement reaction video assembly, chat-based fine-tuning, and server-side MP4 rendering.
- **Deliverables:**
  - State machine for reaction compositions: assembling 1 source moment + 1 human reaction take + return to source.
  - Conversational editing commands via unified composer: trimming boundaries, reordering scenes, choosing layouts (PiP, split-screen, cutaway).
  - Dedicated composed preview screen.
  - Export gating logic: if owner source media file is present, dispatches Cloud Run Job running FFmpeg container; if absent, exports isolated human reaction takes + JSON EDL with clear legal messaging.

### Task 21 — Full Verification, Playwright DOM Geometry & Semantic Grader
- **Scope:** Execute the complete verification battery defined in `CO_WATCHER_EVAL_PLAN.md`.
- **Deliverables:**
  - Pass 100% of Bun deterministic unit & component tests.
  - Run Playwright E2E tests verifying computed bounding client rects (left column height lock, zero iframe overlap, clustering on resize).
  - Execute automated Google-model semantic evaluation script (`scripts/run-semantic-eval.ts`) asserting composite score $\\ge 4.0/5.0$ and zero hallucinations.
  - Run Knip dead-code elimination; remove all unused files, exports, and dependencies.

### Task 22 — Production Cloud Run Deployment & Contest Submission Packaging
- **Scope:** Deploy the live service to Google Cloud and package contest submission assets.
- **Deliverables:**
  - Provision and deploy Cloud Run primary web service and renderer Cloud Run Job.
  - Verify live health check (`/health`) and real end-to-end integration run.
  - Record live telemetry evidence report (`eval-live-evidence.json`).
  - Author concise, reproducible testing instructions in `README.md`.
  - Final review against Devpost Agentic Cinema competition rules [S1, S14].

---

## 4. Definition of Done (Final Acceptance Gate)

Before the project is declared complete and ready for public evaluation, all of the following binary conditions must be met:

- [ ] **1. Mechanical Quality Clean:** `bun run lint`, `bun run typecheck`, `bun run knip`, and `bun test` pass with 0 errors and 0 warnings.
- [ ] **2. Zero Suppression Directives:** Suppression checker confirms zero `@ts-ignore`, `eslint-disable`, or Knip exclusions in the codebase.
- [ ] **3. Code Complexity Standards:** Every component file $\\le 220$ LOC, other source files $\\le 340$ LOC, functions $\\le 100$ LOC, complexity $\\le 12$.
- [ ] **4. Layout Geometry Invariants:** Playwright tests confirm desktop two-column height lock, internal overflow scrolling, and zero intersection with YouTube iframe.
- [ ] **5. Real External Integrations:** Live runtime uses genuine Google GenAI (`gemini-2.5-flash`) for video comprehension and Parallel Search API for web evidence (no mock stubs in production).
- [ ] **6. Invariant Chronology & Non-Hijacking:** Feed is sorted strictly by source-video time; passive playback does not force-scroll users inspecting older comments.
- [ ] **7. Reliable Reaction Recording:** Audio/video takes capture cleanly with echo cancellation and immediate device track release.
- [ ] **8. Export Gating & Rendering:** Verified MP4 rendering works with owner-supplied media; clean reaction export + EDL provided when source video is absent.
- [ ] **9. Cloud Run Live Deployment:** Application is live and accessible over HTTPS on Google Cloud Run with Secret Manager configuration.
- [ ] **10. Zero Token Leaks & Native Provenance:** No API keys committed or logged; all code authored natively in this repository without legacy hackathon borrowings.

---
