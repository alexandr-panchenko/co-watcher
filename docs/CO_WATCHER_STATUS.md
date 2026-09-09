# Co-Watcher Status & Requirement Index

This document tracks implementation status, requirement locations, unresolved boundaries, and provenance across all development tasks for the **Co-Watcher** project.

---

## 1. Numbered Task Checklist

- [x] **Task 00 — Preserve the existing project and establish the working contract**
- [x] **Task 01 — Record product purpose and exact scope**
- [x] **Task 02 — Record accepted screens, landing and recommendations**
- [x] **Task 03 — Record the single conversation surface**
- [x] **Task 04 — Record Watch layout, synchronization and gem rail**
- [x] **Task 05 — Record editorial behavior, reaction recording, feed integration, and assembly scope**
- [x] **Task 06 — Record architecture, authoritative state, semantic tools, triggers, and background work**
- [x] **Task 07 — Record platform/API verification and mechanical quality gates**
- [x] **Task 08 — Record evaluation, visual verification, security, costs, and persistence**
- [x] **Task 09 — Record development workflow, competition rules, and deliverables specification**
- [x] **Task 10 — Technical investigation and decision summary for architecture & integrations**
- [x] **Task 11 — Author the comprehensive evaluation & verification plan**
- [x] **Task 12 — Author the deployment, infrastructure, and CI/CD specification**
- [x] **Task 13 — Author the master execution task manifest (CO_WATCHER_AGENT_TASK.md)**

*(Phase 1 Documentation & Specification is 100% complete. Phase 2 Implementation roadmap tracked below:)*

- [x] **Task 14 — Tooling & mechanical quality gates setup**
- [x] **Task 15 — Integration spikes & high-risk boundaries (Gemini + Parallel)**
- [x] **Task 16 — Authoritative state, backend API & semantic tool handlers**
- [x] **Task 17 — Watch workspace layout & YouTube IFrame synchronization**
- [x] **Task 18 — Autonomous research pipeline & commentary slice**
- [x] **Task 19 — In-browser reaction recording engine**
- [x] **Task 20 — Timeline composition, conversational edits & FFmpeg rendering**
- [x] **Task 21 — Full verification, Playwright DOM geometry & semantic grader**
- [x] **Task 22 — Production Cloud Run deployment & contest submission packaging**

---

## 2. Requirement & Asset Location Index

| Domain / Resource | Repository Location | Description & Notes |
| :--- | :--- | :--- |
| **Operating Contract** | [`AGENTS.md`](file:///home/alex/github/co-watcher/AGENTS.md) | Operational invariants, agent rules, non-degradation rules, and reporting standards. |
| **Master Execution Task Manifest** | [`docs/CO_WATCHER_AGENT_TASK.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_AGENT_TASK.md) | Master autonomous execution roadmap: mission statement, precedence order, governing document roles, Tasks 14–22 breakdown, and Definition of Done. |
| **Architectural Decision Summary & Integration Resolution** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L3-L255) | Official decisions on Gemini `gemini-2.5-flash` YouTube ingestion, Parallel Search REST API (`/v1/search`), YouTube IFrame postMessage & oEmbed metadata, MediaRecorder Opus/VP9 recording, Cloud Run Job FFmpeg rendering, 5 semantic agent tools, Firestore/GCS layout, and token auth. |
| **Comprehensive Evaluation & Verification Plan** | [`docs/CO_WATCHER_EVAL_PLAN.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_EVAL_PLAN.md) | Multi-tier test architecture: deterministic unit tests (Bun), DOM geometry & desktop lock (Playwright), 5-dimension semantic rubric (Google model), and live integration verification protocols. |
| **Deployment, Infrastructure & CI/CD Specification** | [`docs/CO_WATCHER_DEPLOYMENT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_DEPLOYMENT.md) | Local development (Bun), production runtime (Node.js on Cloud Run), GCP service provisioning (Firestore, GCS, Secret Manager), FFmpeg container worker, CI/CD quality gates, and rollback runbooks. |
| **Product Purpose & One-Sentence Definition** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md) | Co-Watcher as a knowledgeable viewing companion; core loop: *Find or choose → Watch → Discover context → Record a human reaction → Assemble and review*. |
| **User Motivation & Parallel Search Rationale** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L11-L23) | Why someone would use it; Parallel Search as runtime research tool producing source evidence and excerpts ([S3](https://docs.parallel.ai/search/search-quickstart)). |
| **Scope Inclusions (11 features)** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L27-L40) | Persistent viewing room, real embedded YouTube player, single conversational input, video recommendations, timestamped AI comments with expandable evidence, gem-style comment rail, voice/cam reactions, unified chronological feed, simple assembly, small conversational edits, composition preview/export. |
| **Scope Exclusions** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L42-L46) | Explicitly excluded: AI narration, AI-generated voice reactions replacing user, voice cloning, music generation, multi-track editor, auto highlight montages, social networks, extensions, subscriptions, extra partner tracks, template bloat. |
| **Design Precedence & Fidelity Rules** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L50-L64) | 3-tier precedence: (1) owner-approved behavioral decisions, (2) final selected Stitch screens, (3) necessary implementation details. Strict styling coherence; screenshots are visual, not factual data. |
| **Screen/State Inventory (6 principal states)** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L66-L77) | (1) Landing / no video selected, (2) Video recommendations in chat, (3) Watch workspace (ordinary/image comments, expanded, crowded rail), (4) Recording reaction, (5) Recorded reaction in feed/rail, (6) Simple assembled reaction video preview/review. |
| **Unified Conversation Surface** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L79-L97) | Single bottom composer for YouTube links, recommendations, viewer purpose/knowledge, source questions, comment questions, preferences, editing requests. Expands upward; preserves drafts, video selection, playback position, and selected comments across views; attaches selection context on submit (not delayed). |
| ↳ *Follow-up Prompts* | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L99-L106) | Short non-blocking guidance near composer; prepared small set rotated locally without extra model roundtrips; no mandatory onboarding questionnaires. |
| ↳ *Dictation vs. Reaction Boundary* | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L108-L113) | Strict boundary: composer microphone transcribes editable chat text before submission (never silently auto-sends); reaction recorder produces a media asset for playback/export. Unambiguous visual indicators and permissions. |
| **Landing State & 5 Capability Cards** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L115-L135) | Heading: "Watch with someone who can look anything up". 5 cards: Watch with context, Fact-check while watching, Make it personal, Find something worth watching, Turn reactions into videos. Suggested prompts insert into composer without auto-sending. |
| **In-Chat Recommendations** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L137-L145) | Chat assistant response showing 4 compact choices (thumbnail, title, creator, duration, personalized reason; subtle "Best match"). Selecting opens in Watch workspace retaining user purpose. Never fabricate metadata. |
| **Watch Workspace: Structural Invariants** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L147-L186) | Real YouTube IFrame Player API [S4–S5]; player timeline unaltered; all UI outside player. Desktop 2-column layout: left column alone determines section height; right commentary scrolls internally and cannot enlarge section. Theater/mobile moves comments below without carrying desktop absolute heights. |
| ↳ *Chronology & Synchronization* | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L174-L186) | Strict sorting by source-video timestamp (oldest at top). Marker click seeks source and reveals item; feed click seeks source. Manual selection stays pinned during passive playback. Comments do not auto-pause playback; explicit recording/preview actions may pause. |
| **Gem Rail & Comment Content** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L188-L216) | Thin app strip beneath player merged with title/metadata. Preserved gem shapes/colors (shape + text labels, not color alone). Spatial marker clustering with count/member popover; tooltips/popovers must never overlap YouTube iframe. Comments have timestamp, compact label, short title, concise text, optional traceable images, expandable sources within feed. |
| **Editorial Behavior & Agent Utility** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L218-L242) | Research comments anchored to content, additive, relevant, concise, evidenced. Strict distinction between facts vs opinions, contradiction vs missing evidence; time-context evaluation for historical claims. Grounded highlights without fake citations; honest search failure states. Bounded research strategy (cost/caching limits; no analysis on playback ticks or repaints). |
| **Human Reaction Recording** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L244-L260) | Explicit user trigger on moment/comment; shows source range & research context as notes (no AI impersonation/narration). Adjustable source range (no cutting mid-sentence). Default path prevents source audio mixing into mic. Explicit user gestures for permissions; clean track release on exit. |
| **Recorded Reactions in Watch Feed** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L262-L278) | Kept recording becomes timestamped feed item with "My Reaction" badge, duration, audio/camera thumbnail, explicit play/pause, optional transcript, link to inspiring comment. Distinct gem on rail clusters with AI items. Clicking navigates source; playback is explicit. Local take preserved on upload error. |
| **Assembly & Preview Scope** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L280-L325) | Fundamental unit: 1 source moment + 1 human reaction + optional visual (or voice-over). Joining existing scenes in order (no general-purpose editor or autonomous clip hunters). Dedicated composed preview with semantic sequence blocks. Chat-driven edits (trim, reorder, adjust bounds). Vertical framing as preset only. Human voice remains narration (no TTS/music). |
| ↳ *Critical Source-Media Constraint* | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L307-L325) | Watching != Analyzing != Derivative export rights. Real rendering requires owner-provided authorized file associated with source timebase. No YouTube downloaders, iframe scraping, or stream ripping. Clear explanation if source file unavailable [S6–S7]. |
| **Architectural Decisions Accepted** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L327-L352) | Standalone repo, React+TS+Vite, Bun build/test, Node.js production runtime, Google ADK & GenAI SDK, Cloud Run + Hono, Firestore structured state, Cloud Storage media, Secret Manager credentials, HTTP + SSE updates, Google Node buildpacks [S8]. No premature multi-agent or platform bloat. |
| **Authoritative State, Tools, Triggers & Background Work** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L354-L394) | Room state is authoritative over chat; inspectable history & recoverable revisions. Small semantic tool surface (context, Parallel search, video/room info, commentary publish/revise, reaction composition). Deterministic system handles persistence, permissions, seeking, recording, clustering. Background work on Cloud Run must survive disconnects/restarts [S9]. Timebase distinctions maintained. |
| **Platform/API Verification Checklist** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L330-L342) | 6 verification domains: (1) Gemini video understanding & YouTube endpoint [S10], (2) Parallel Search API/SDK [S3], (3) YouTube IFrame API [S4-S5], (4) authorized supporting images, (5) browser recording/rendering decode matrix, (6) Google ADK TypeScript & Cloud Run buildpack compatibility [S8, S11]. |
| **Mechanical Quality Requirements & Zero Escapes** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L343-L375) | Strict TS, type-aware ESLint [S12], Stylelint, mandatory Knip (standard + strict production) [S13], Bun unit/integration, Playwright E2E, Node smoke tests. Limits: components <=220 LOC, others <=340 LOC, funcs <=100 LOC, cyclomatic complexity <=12, nesting <=4, params <=4. Absolute ban on suppressions (`eslint-disable`, `@ts-ignore`, Knip ignores). Pin Bun, frozen lockfile, pre-commit quality gate. |
| **Evaluation & Visual Verification** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L376-L403) | Deterministic tests for state/ordering/clustering/DOM geometry (measured height constraints, horizontal gap, internal scrolling). Google-model semantic rubric grader (additive, grounded, interest, density, uncertainty). Live integration evidence (real Gemini, real Parallel, real recording + render). Demo isolation (held-out demo inputs, sanitized room record). |
| **Security, Costs and Persistence** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L404-L413) | Minimal room access via secret-link/token pattern; no token leaks. Server-side credentials; video speech/excerpts treated as untrusted evidence. Enforceable limits on requests, search fan-out, render duration, and uploads. Firestore structured references; Cloud Storage media retention without accidental deletion on failure. |
| **Autonomous Development & Deployment Workflow** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L414-L434) | 10 implementation stages toward one deliverable. CLI/API automation for cloud and GitHub resources; respectful of permissions. Owner-only requests restricted to exact URLs, buttons, and values when unavoidable. |
| **Competition & Publication Checks** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L435-L444) | Devpost Agentic Cinema rules [S1] (3-minute evaluated video, real runtime Google/Parallel, hosted URL, open-source repo). Clarification [S14]: published demo/screenshots use fictional/mock source material while live hosted app shows real search. No removing YouTube branding; authorized demo media. |
| **Deliverables Specification & Decision Summary** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L445-L467) | 4 required documents: Implementation Handout, Agent Task, Eval Plan, Deployment Guide. Brief decision summary covering 7 core architecture choices before documentation. |
| **Definition of Usable Product Outcomes** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L468-L485) | Concrete usability criteria for final completion: layout invariants preserved, real recommendations via chat, real Gemini & Parallel research, browseable non-hijacking comments, reaction recording/saving/playback, real preview/export with eligible media, failure preservation, and quality verification. |
| **Official Reference Citations** | [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L486-L504) | Full verified reference citations: [S1] Competition rules, [S2] Conceptual strategy clarification, [S3] Parallel Search, [S4-S5] YouTube IFrame & embedded rules, [S6-S7] YouTube developer policies & captions permissions, [S8] Google Node buildpacks, [S9] Cloud Run contract, [S10] Gemini video understanding, [S11] Google ADK, [S12] ESLint, [S13] Knip, [S14] Parallel demo vs live clarification. |
| **Design System & Tokens** | [`DESIGN.md`](file:///home/alex/github/co-watcher/DESIGN.md) | Curated color palette (surfaces, primary/secondary/tertiary tints), typography (Geist, Inter, JetBrains Mono), elevation, layout spacing tokens. |
| **Core Stylesheets** | [`src/index.css`](file:///home/alex/github/co-watcher/src/index.css), [`src/styles/`](file:///home/alex/github/co-watcher/src/styles) | Global resets, CSS custom properties mapped from `DESIGN.md`, base typography classes. |
| **Stitch Visual Exports** | [`stitch_co_watcher_ai_video_workspace/`](file:///home/alex/github/co-watcher/stitch_co_watcher_ai_video_workspace) | Approved reference screens and reference HTML exports for layout and visual styling: |
| ↳ *Landing (No Video)* | `.../co_watcher_landing_no_video_selected_5_capabilities/` | Discovery landing state displaying the 5 core capability cards. |
| ↳ *Active Video Session* | `.../co_watcher_active_video_session_aligned_heights/` | Split view: video player alongside aligned companion dock. |
| ↳ *Theater Mode* | `.../co_watcher_theater_mode_active_cluster/` | Cinema / theater mode with active discussion clusters. |
| ↳ *Mobile Theater Mode* | `.../co_watcher_mobile_theater_mode_constrained_comments/` | Constrained viewport mobile responsive layout for theater view. |
| ↳ *In-Chat Recommendations* | `.../co_watcher_in_chat_video_recommendations/` | Companion chat view rendering inline video recommendation cards. |
| ↳ *Record Reaction to Moment* | `.../co_watcher_record_reaction_to_moment/` | Modal / workflow overlay for timestamped reaction recording. |
| ↳ *Reaction in Watch Workspace* | `.../co_watcher_recorded_reaction_in_watch_workspace/` | Post-capture preview showing pinned user reaction in workspace. |
| ↳ *Review Assembled Reaction* | `.../co_watcher_review_assembled_reaction_video/` | Final review screen for cut / assembled reaction video. |
| ↳ *Webcam Preview Reference* | `.../webcam_preview_selfie_of_a_thoughtful_user_in_their_late_20s_wearing_audio/` | Asset reference for avatar / webcam feed mock. |
| **Active Frontend Codebase** | [`src/`](file:///home/alex/github/co-watcher/src) | Existing Vite + React + TypeScript application structure (`App.tsx`, `components/`, `data/`, `i18n/`). |
| **Environment Configuration** | [`.env.example`](file:///home/alex/github/co-watcher/.env.example) | Template for local environment variables (API keys, ports). |

---

---

## 3. Settled Architectural Decisions & Integration Resolutions (Task 10)

The following boundaries have been authoritatively resolved against official developer documentation ([S1–S14]) and recorded in Section 0 of [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md#L3-L255):

1. **Gemini Video Understanding Path:**
   - *Resolution:* `gemini-3.8-flash` via `@google/genai` (Google AI Studio / Gemini Developer API [S10]). Accepts public YouTube URLs directly in `generateContent` `contents.fileData`. Temporal grounding performed on discrete lifecycle boundaries (video load, user inquiry, chapter boundary); never on playback ticks. Model transcripts are treated as semantic context, not verbatim subtitles.
2. **Parallel Search Integration Contract:**
   - *Resolution:* Official REST endpoint `POST https://api.parallel.ai/v1/search` with header `x-api-key: $PARALLEL_API_KEY` and SDK `parallel-web` [S3]. Accepts natural language `objective` and array of `search_queries`. Returns ranked web results with textual `excerpts`. Maximum fan-out 3 queries per analysis; 30 queries/hour per room ceiling; SHA-256 result caching. Parallel does not supply images or video metadata.
3. **YouTube Player & Source Metadata:**
   - *Resolution:* Official YouTube IFrame Player API [S4–S5] via `window.YT.Player`. Playback position synchronized via postMessage timer active only when playing. Player timeline remains completely unaltered; no overlays over iframe. Public video metadata acquired via YouTube oEmbed API (`/oembed?url=...&format=json`) and Data API v3 `videos.list` for duration/embeddability. No synthetic metadata permitted. Captions API requires channel owner auth [S6–S7]; public transcripts not scraped.
4. **Recording & Rendering Export Pipeline:**
   - *Resolution:* In-browser reaction capture via `MediaRecorder` targeting `video/webm;codecs=vp9,opus` (fallback `vp8,opus` or `mp4/avc1`). Echo cancellation and audio isolation configured via `getUserMedia` constraints. Cloud Run standard Node buildpacks lack FFmpeg [S8]; server-side rendering is isolated into a **Cloud Run Job** with custom multi-stage Docker container (`node:22-bookworm-slim` + `ffmpeg`) [S9]. Composite rendering strictly requires owner-supplied source media file; if absent, exports isolated human reactions + EDL JSON [S6–S7, S14].
5. **Small Semantic Agent Tool Surface:**
   - *Resolution:* 5 typed, validated tools: (1) `set_viewing_context` (viewer background, objectives, density), (2) `search_parallel_evidence` (objective, queries, source timestamp, claim type), (3) `publish_commentary` (timestamp, comment type, title, text, evidence excerpts, optional image), (4) `assemble_reaction_composition` (cut sequence intervals, reaction takes, layout, aspect ratio), (5) `get_room_state` (inspect video, comments, reactions count).
6. **Authoritative State & Storage Layout:**
   - *Resolution:* Firestore collections `/rooms/{roomId}`, subcollections `/comments`, `/reactions`, `/composition/current`. GCS bucket `gs://${PROJECT_ID}-cowatcher-media/` structured by `rooms/{roomId}/{reactions,source,exports}/` with 14-day lifecycle purge for orphaned takes. Secret-link token authentication (`crypto.randomBytes(16)` hex) hashed with SHA-256 in Firestore; mutations require `Authorization: Bearer <token>`.

---

## 4. Remaining Operational & Deployment Boundaries

*The following items remain open for future implementation, deployment, and live grading tasks:*

1. **Authorized Demo Video Material Plan [S14]:**
   - *Status:* `OPERATIONAL_SETUP`
   - *Detail:* Final selection of public domain / CC0 educational video files for the evaluated 3-minute video submission [S1, S14] to guarantee zero copyright issues.
2. **Public Deployment Domain & Cloud Run Service Setup:**
   - *Status:* `SPECIFICATION_COMPLETE / PROVISIONING_PENDING`
   - *Detail:* Architecture, gcloud commands, service accounts, and CI/CD pipelines specified in [`docs/CO_WATCHER_DEPLOYMENT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_DEPLOYMENT.md); live cloud resource execution to be triggered upon deployment command.
3. **Automated Google-Model Semantic Evaluation Rubric & Harness:**
   - *Status:* `SPECIFICATION_COMPLETE / HARNESS_PENDING`
   - *Detail:* Concrete grading prompt and 5-dimension scoring rubric specified in [`docs/CO_WATCHER_EVAL_PLAN.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_EVAL_PLAN.md#L187-L239); execution script `scripts/run-semantic-eval.ts` to be implemented during code phase.
4. **Authorized Provenance Path for Supporting Images:**
   - *Status:* `ASSET_POLICY`
   - *Detail:* In-room image attachments strictly limited to user-uploaded files or verified public domain repositories with stored attribution metadata; AI image generation remains prohibited.
5. **Voice Dictation Web Speech API vs Audio Transcription:**
   - *Status:* `FRONTEND_SELECTION`
   - *Detail:* Implementation choice between native browser `webkitSpeechRecognition` for zero-latency client dictation vs server-side audio transcription via Gemini audio API. Dictated text must always land in the composer as editable draft before sending.

---

## 5. Project Provenance & Eligibility Statement

- **Development Independence:** This repository and its development workflows are independent technical implementations authored natively within this workspace by Antigravity and the project contributors.
- **No External Certification Claim:** The operational records, checklists, and documentation kept in this repository reflect internal project management and do not constitute external certification, endorsement, or validation of hackathon or contest eligibility by any organizing body.
- **Code Provenance:** All source code and artifacts in this repository are created directly in this workspace without borrowed code from prior projects or external repositories.
