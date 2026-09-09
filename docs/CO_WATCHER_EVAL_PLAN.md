# Co-Watcher Comprehensive Evaluation & Verification Plan

This document defines the repository-ready testing, verification, and evaluation specification for the **Co-Watcher** system, strictly grounded in Sections 15, 16, and 21 of [`docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md`](file:///home/alex/github/co-watcher/docs/CO_WATCHER_IMPLEMENTATION_HANDOUT.md) and governed by the invariants in [`AGENTS.md`](file:///home/alex/github/co-watcher/AGENTS.md).

---

## 1. Overview & Evaluation Strategy

### 1.1 Multi-Tier Testing Architecture

Co-Watcher employs a 5-tier verification architecture designed to guarantee mechanical correctness, visual fidelity, semantic utility, and real runtime integration without relying on superficial mock assertions:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Co-Watcher Quality Gates                        │
├────────────────────────────────┬───────────────────────────────────────┤
│ Tier 1: Deterministic Engine   │ Bun Test (State, ordering, bounds)    │
│ Tier 2: Component Interactions │ React Testing Library (DOM & UX flows)│
│ Tier 3: DOM Geometry & Layout  │ Playwright (Computed bounds, lock)    │
│ Tier 4: Semantic Intelligence  │ Google-Model Grader (Rubric 1–5)      │
│ Tier 5: Live Integration Proof │ Real Gemini, Parallel, MediaRecorder  │
└────────────────────────────────┴───────────────────────────────────────┘
```

1. **Tier 1 — Deterministic Unit & Engine Tests (Bun test):** Verifies pure state transitions, version increments, timeline monotonic sorting, clustering algorithms, tool schemas, and cache keys.
2. **Tier 2 — Component & Workflow Tests (React Testing Library):** Verifies draft preservation across views, context snapshotting on submission, recording state machines, and permission recovery.
3. **Tier 3 — DOM Geometry & Layout Invariant Tests (Playwright):** Measures computed styles and `getBoundingClientRect()` to strictly verify the desktop two-column lock, horizontal gaps, internal overflow scrolling, and zero iframe intersection.
4. **Tier 4 — Semantic Evaluation (Google-Model Grader):** Automated LLM-as-a-judge scoring agent commentary on a 1–5 scale across relevance, additiveness, uncertainty calibration, density restraint, and personalization.
5. **Tier 5 — Live Integration & Demonstration Evidence:** Executes genuine end-to-end runs with live API keys (`GEMINI_API_KEY`, `PARALLEL_API_KEY`), real camera/mic capture, and actual FFmpeg video assembly, recording latency and output metrics.

### 1.2 Demo Data Isolation & Clean Room Governance

To safeguard contest evaluation integrity:
- **Synthetic Test Fixtures Only in Repo:** All repository test fixtures use synthetic, licensed, or public-domain educational video identifiers and mocked web responses.
- **Held-Out Demonstration Separation:** The project owner's private held-out demonstration script, private URLs, and evaluated demonstration topics must **never** be checked into the repository, copied into test mocks, or leaked into prompt defaults.
- **No Overfitting to Mocks:** Passing synthetic unit tests never substitutes for live external API verification.

---

## 2. Deterministic Automated Tests

Automated test suites must run deterministically in Bun test (`bun test`) without external network dependencies.

### 2.1 State, Concurrency & Timeline Ordering

- **Test Suite:** `tests/unit/room-state.test.ts`
  1. **Monotonic Source-Video Ordering:**
     - Feed items (both AI commentary and human reaction takes) must sort strictly by `sourceTimestampSeconds` ascending (oldest at the top).
     - Items with identical timestamps must preserve deterministic sub-ordering based on creation timestamp (`createdAt`).
     - Generation time / arrival time must **never** be used as the feed sorting key.
  2. **Optimistic Mutation & Stale-Write Rejection:**
     - Room state documents maintain an incrementing `version` number.
     - Updates specifying an outdated base version must be rejected (`409 Conflict`), preserving authoritative state integrity.
  3. **Trigger Idempotency:**
     - Submitting identical analysis requests for the same source video interval (`[start, end]`) must return cached results without re-dispatching remote tasks.
     - SHA-256 hash of `videoId + startSeconds + endSeconds + objective` serves as the idempotent cache key.

### 2.2 Unified Composer & Context Capture

- **Test Suite:** `tests/unit/composer-context.test.ts`
  1. **Draft Preservation Across Navigation:**
     - Text entered into the unified composer draft must be retained when switching between Landing, Watch Workspace, Recommendations, and History views.
     - Composer expansion/collapse states must not wipe unsubmitted drafts.
  2. **Send-Time Context Snapshotting:**
     - The video context (current `playbackTime`, active chapter, highlighted comments) attached to a user message must be captured at the exact millisecond the user presses Send / hits Enter.
     - Playback progression while the request is in flight must **not** drift or overwrite the captured timestamp.
  3. **Local Follow-Up Prompt Rotation:**
     - Composer follow-up suggestions must rotate locally from a pre-defined static pool without making extra model roundtrips.
     - Suggested prompt clicks must populate the composer draft without silently auto-sending.
  4. **Dictation vs. Reaction Strict Separation:**
     - Activating composer microphone input must stream transcribed text directly into the editable textarea.
     - Composer dictation must never trigger the reaction recorder, create a media asset, or auto-submit the message.

### 2.3 Feed Chronology, Synchronization & Non-Hijacking

- **Test Suite:** `tests/unit/feed-sync.test.ts`
  1. **Marker & Feed Seeking:**
     - Clicking a gem marker on the rail must dispatch a seek command to the YouTube player with the exact source timestamp and highlight the corresponding feed item.
     - Clicking a timestamp pill within a feed comment must dispatch a seek command to the player.
  2. **Active Playback Highlight:**
     - As playback advances, the feed item closest to `currentPlaybackTime` (within a defined tolerance window) receives the active highlight class.
  3. **Manual Inspection Protection (No Scroll Hijacking):**
     - When a user manually scrolls the commentary feed or focuses an older/future comment, passive playback must **not** force-scroll the user back to the current playback position.
     - Explicit user interaction sets `userIsBrowsing = true`, disabling automatic follow-playback scrolling until the user clicks a "Resume sync" control or plays past a major chapter.
  4. **Non-Pausing AI Comments:**
     - AI commentary publication events must never automatically pause YouTube video playback.

### 2.4 Reaction Recording Lifecycle

- **Test Suite:** `tests/unit/reaction-lifecycle.test.ts`
  1. **Permission Denial Recovery:**
     - If the user denies camera or microphone permissions via `getUserMedia`, the UI must transition to a clean, non-blocking fallback state explaining the requirement without crashing.
  2. **MediaStreamTrack Release:**
     - When the user cancels recording, closes the modal, or completes a take, all `MediaStreamTrack` instances (audio and video) must invoke `.stop()` immediately to extinguish hardware indicator lights.
  3. **Review, Re-record & Keep State Transitions:**
     - State machine transitions must follow: `idle` → `recording` → `reviewing` → (`rerecord` → `recording` | `keep` → `uploading` → `saved`).
     - Kept recordings must immediately insert an item into the local feed and rail with a "My Reaction" badge and `sourceAnchorTimestamp`.
  4. **Offline / Upload Error Preservation:**
     - If the network upload to Cloud Storage fails, the recorded raw `Blob` must be preserved in IndexedDB / local memory with a retry control, ensuring zero lost user recordings.

### 2.5 Export Gating & Media Eligibility

- **Test Suite:** `tests/unit/export-gating.test.ts`
  1. **Missing Source Media Blocking:**
     - When a composition references a YouTube video without an owner-supplied original source media file (`authorizedSourceMediaUrl == null`), the full composite MP4 render button must be disabled.
  2. **Isolated Reaction Fallback:**
     - In the absence of owner source media, the export workflow must offer a 1-click download of the user's **isolated reaction take(s)** with an accompanying JSON Edit Decision List (EDL).
     - Clear, honest messaging must inform the user that YouTube terms [S6–S7] prohibit third-party video stream extraction.
  3. **Preservation of Core Workspace:**
     - Ineligible export media must never disable or degrade the watching, research, commenting, or reaction recording capabilities.

---

## 3. DOM Geometry & Layout Invariant Verification (Playwright)

Automated end-to-end tests using Playwright (`playwright test`) must inspect the live browser DOM, computed CSS properties, and bounding boxes (`BoundingBox`) to strictly enforce the approved Stitch design specifications.

### 3.1 Two-Column Desktop Lock

- **Test Spec:** `tests/e2e/desktop-layout-lock.spec.ts`
- **Viewport:** Desktop 1440x900px
- **Verification Invariants:**
  1. **Left Column Height Authority:**
     - The combined bounding rect height of the Left Column (`#video-player-container` + `#metadata-gem-rail-container`) defines the exact container height.
     - `height(right_column) == height(left_column)` within a 1px rounding tolerance.
  2. **Top and Bottom Edge Alignment:**
     ```typescript
     const leftRect = await page.locator("#stage-left-column").boundingBox();
     const rightRect = await page.locator("#stage-right-column").boundingBox();

     expect(Math.abs(leftRect.y - rightRect.y)).toBeLessThanOrEqual(1.5);
     expect(Math.abs((leftRect.y + leftRect.height) - (rightRect.y + rightRect.height))).toBeLessThanOrEqual(1.5);
     ```
  3. **Strict Internal Overflow Scrolling:**
     - Injecting 50 lengthy commentary cards or expanding multiple image attachments into `#stage-right-column` must **not** increase `leftRect.height` or cause the parent viewing section to expand vertically.
     - The comments container must exhibit `overflow-y: auto` (or `scroll`), with `scrollHeight > clientHeight`.
  4. **Strict Horizontal Column Separation:**
     - The right column `x` coordinate must be strictly greater than `leftRect.x + leftRect.width`.
     - A horizontal gap matching design tokens (`gap >= 16px` and `gap <= 32px`) must be maintained. Zero visual overlapping.

### 3.2 YouTube Iframe Non-Intersection & Spatial Safety

- **Test Spec:** `tests/e2e/iframe-safety.spec.ts`
- **Verification Invariants:**
  1. **Zero Overlap on Hover / Popover:**
     - Hovering or clicking every gem marker on the rail spawns tooltips/popovers.
     - The bounding rect of every tooltip, cluster popover, and context menu must be strictly disjoint from the YouTube iframe bounding rect:
     ```typescript
     const iframeRect = await page.locator("#youtube-player-iframe").boundingBox();
     const popoverRect = await page.locator(".gem-rail-popover").boundingBox();

     const hasOverlap = !(
       popoverRect.x + popoverRect.width <= iframeRect.x ||
       popoverRect.x >= iframeRect.x + iframeRect.width ||
       popoverRect.y + popoverRect.height <= iframeRect.y ||
       popoverRect.y >= iframeRect.y + iframeRect.height
     );
     expect(hasOverlap).toBe(false);
     ```
  2. **Iframe Chrome Integrity:**
     - No custom HTML overlay or pseudo-element may be positioned over the internal surface of the YouTube player iframe.

### 3.3 Dynamic Marker Clustering on Viewport Resize

- **Test Spec:** `tests/e2e/gem-rail-clustering.spec.ts`
- **Verification Invariants:**
  1. **Cluster Merging on Viewport Narrowing:**
     - Inject markers at timestamps `t = 10s`, `14s`, and `18s`.
     - At 1440px width, markers appear as individual gems.
     - Resize browser viewport to 1024px.
     - Playwright asserts that the markers merge into a single clustered marker displaying a badge count of `3`.
  2. **Underlying Data Invariance:**
     - Clustering recalculations must operate purely on visual projection coordinates without mutating or consolidating the underlying comment records in state.

### 3.4 Responsive Theater & Stacked Layouts

- **Test Spec:** `tests/e2e/responsive-theater.spec.ts`
- **Verification Invariants:**
  1. **Theater View Breakpoint (<1024px or Mobile):**
     - Resize viewport to 768px (tablet) and 375px (mobile).
     - The layout must transition from side-by-side to a vertical stack.
     - `#stage-right-column` must be positioned directly below `#stage-left-column` (`rightRect.y >= leftRect.y + leftRect.height`).
  2. **No Carried Absolute Heights:**
     - In stacked view, `#stage-right-column` must release desktop absolute height constraints, allowing natural, document-level responsive scrolling.

---

## 4. Semantic Evaluation Rubric (Google-Model Grader)

To evaluate the quality of agent commentary without fragile exact-string matching, Co-Watcher implements an automated LLM-as-a-judge evaluation harness powered by `gemini-2.5-flash` or `gemini-2.5-pro`.

### 4.1 Evaluation Prompt Harness

The grading harness executes against synthesized video test scenarios (composed of video metadata, ground truth transcript segments, and user viewing context).

```markdown
You are an expert editorial judge evaluating an AI viewing companion called Co-Watcher.
Co-Watcher watches educational/interview videos with a user, investigates claims via Parallel Search, and publishes concise, timestamped commentary cards.

Evaluate the agent commentary below based on the Video Moment, User Context, and Retrieved Evidence.
Score each dimension from 1 (poor) to 5 (excellent) according to the rubric.

[User Context]: {viewerBackground}, Objective: {learningObjective}, Density: {densityPreference}
[Video Moment]: Timestamp: {timestampSeconds}s | Speaker text: "{transcriptSnippet}"
[Parallel Search Evidence]: "{retrievedExcerpts}"
[Agent Published Commentary]:
- Title: "{commentTitle}"
- Type: "{commentType}"
- Text: "{commentText}"
- Evidence Citation: "{citationUrl}"
```

### 4.2 Five-Dimension Scoring Rubric (1–5 Scale)

| Dimension | Weight | 1 — Unacceptable | 3 — Competent | 5 — Exemplary |
| :--- | :---: | :--- | :--- | :--- |
| **1. Relevance & Grounding** | 25% | Hallucinated claim; comment references topics absent from the video; fabricates facial expressions or emotions. | Comment is related to the video topic, but loosely timed or points to general background rather than the specific moment. | Perfectly anchored to a specific concept, entity, or claim spoken or shown at that exact timestamp. |
| **2. Additiveness** | 25% | Merely paraphrases or summarizes what the speaker just said without providing any new information. | Provides common dictionary definition or widely known context that does not substantially deepen understanding. | Supplies crucial context, historical connection, underlying mechanism, or aftermath absent from the video that enriches viewing. |
| **3. Uncertainty & Fact-Checking** | 20% | Treats opinions as debunked facts; displays false certainty; claims proof where search evidence is contradictory or absent. | Notes that a claim is debated but fails to cite specific evidence or nuances in the retrieved sources. | Distinguishes fact from opinion; clarifies consensus vs disagreement; honestly expresses uncertainty if evidence is inconclusive. |
| **4. Density & Restraint** | 15% | Floods the feed with relentless trivia every 10 seconds; interrupts flow; ignores stated density preference. | Mostly well-paced, but occasionally publishes comments on trivial details during intense narrative moments. | Highly judicious; remains silent during self-explanatory moments; publishes only when genuinely valuable; honors density preferences. |
| **5. Personalization** | 15% | Completely generic; ignores user background (e.g. explains basic physics to a physicist or uses jargon for a novice). | Slightly reflects the topic, but tone and complexity do not distinctly adapt to user goals. | Tailors depth, vocabulary, and relevance directly to the user's declared knowledge level and specific learning objective. |

### 4.3 Passing Thresholds

- **Composite Weighted Score:** Must achieve $\ge 4.0 / 5.0$ across a standard evaluation suite of 10 synthesized scenarios.
- **Critical Failure Gate:** Any instance scoring $1$ in *Relevance & Grounding* (hallucination) or *Uncertainty & Fact-Checking* (false debunking) constitutes an immediate test run failure.
- **Negative Omission Testing:** The test suite must include negative test cases where an event occurs but warrants **no comment** (e.g. speaker tells a personal joke, or explains an obvious introductory concept). The agent passes if it correctly decides **not** to publish commentary.

---

## 5. Live Integration & Demonstration Evidence Protocol

To satisfy contest requirements and prove genuine runtime capabilities [S1, S14], live integration verification must be executed against real cloud backends.

### 5.1 Step-by-Step Live Verification Protocol

```
┌───────────────────────────────────────────────────────────────────────────┐
│                    Live Integration Verification Steps                    │
├───────────────────────────────────────────────────────────────────────────┤
│ Step 1: Video Ingestion     │ Submit real YouTube URL to Gemini 2.5       │
│ Step 2: Parallel Search     │ Dispatch real query to api.parallel.ai/v1   │
│ Step 3: Audio/Video Record  │ Capture 10s webcam/mic take via browser     │
│ Step 4: Video Assembly      │ Execute Cloud Run FFmpeg render job         │
│ Step 5: Media Audit         │ Play exported MP4; verify A/V synchrony     │
└───────────────────────────────────────────────────────────────────────────┘
```

1. **Step 1: Real Gemini Video Understanding:**
   - Execute a live test script (`bun run scripts/verify-gemini-live.ts`) passing a public YouTube URL (e.g. standard NASA/MIT open educational video).
   - Verify that the Gemini Developer API returns valid temporal markers, topic segments, and identifiable entities with valid seconds-based timestamps.
   - Assert that response time and token metrics are logged.
2. **Step 2: Real Parallel Search Ingestion:**
   - Take an entity or factual assertion discovered in Step 1.
   - Execute a live query against `https://api.parallel.ai/v1/search` with header `x-api-key: $PARALLEL_API_KEY`.
   - Verify that the returned payload contains ranked results with live URLs, valid domain names, and dense text `excerpts`.
   - Validate that excerpts map cleanly to the typed `EvidenceSource` schema.
3. **Step 3: Real Browser Reaction Recording:**
   - Launch an interactive browser session.
   - Record a 10-second camera + microphone reaction take.
   - Verify that the resulting `Blob` is created with MIME type `video/webm;codecs=vp9,opus` (or supported fallback) and plays back cleanly inside the custom player with synchronized audio.
4. **Step 4: Real FFmpeg Server-Side Assembly:**
   - Upload the user reaction take and an authorized owner source video segment to Cloud Storage.
   - Trigger the Cloud Run assembly job via service dispatch.
   - Verify that FFmpeg compiles the composite MP4 (e.g. picture-in-picture or sequential cut) with matching audio tracks and zero frame corruption.
5. **Step 5: Media & Artifact Inspection:**
   - Download the rendered MP4 artifact from Cloud Storage.
   - Inspect duration, resolution (1080p/720p), video bitrate, and audio channel integrity.
   - Verify that the exported file plays smoothly in standard external media players (QuickTime, VLC, Chrome).

### 5.2 Verification Telemetry & Reporting Format

Every live integration verification run must output a structured, sanitized JSON evidence report:

```json
{
  "testRunId": "eval-live-20260909-001",
  "timestamp": "2026-09-09T15:25:00Z",
  "geminiVerification": {
    "model": "gemini-2.5-flash",
    "endpoint": "Google AI Studio Developer API",
    "sourceVideo": "https://www.youtube.com/watch?v=...",
    "status": "PASS",
    "markersIdentified": 6,
    "latencyMs": 2340
  },
  "parallelVerification": {
    "endpoint": "https://api.parallel.ai/v1/search",
    "status": "PASS",
    "query": "James Webb Space Telescope primary mirror beryllium coating",
    "sourcesRetrieved": 4,
    "excerptsValidated": true,
    "latencyMs": 850
  },
  "recordingVerification": {
    "mimeType": "video/webm;codecs=vp9,opus",
    "durationSeconds": 10.4,
    "byteSize": 1845200,
    "status": "PASS"
  },
  "renderVerification": {
    "engine": "Cloud Run Job / FFmpeg container",
    "compositionId": "comp-77491",
    "outputFormat": "video/mp4",
    "totalDurationSeconds": 24.2,
    "status": "PASS",
    "renderLatencySeconds": 14.8
  }
}
```

---

## 6. Execution Command Matrix

| Test Domain | Command | Environment Requirements |
| :--- | :--- | :--- |
| **Unit & State Tests** | `bun test tests/unit` | Local Bun runtime; zero network keys required. |
| **Component UX Tests** | `bun test tests/components` | Local Bun runtime + happy-dom / jsdom. |
| **DOM Geometry Tests** | `bunx playwright test tests/e2e` | Headless Chromium; local Vite dev server on `http://localhost:5173`. |
| **Semantic LLM Grader** | `bun run scripts/run-semantic-eval.ts` | `GEMINI_API_KEY` configured. |
| **Live Integration Verification** | `bun run scripts/verify-live-integrations.ts` | `GEMINI_API_KEY`, `PARALLEL_API_KEY`, GCP staging credentials. |
| **Complete Mechanical Gate** | `bun run quality-gate.ts` | Complete pre-commit check (Lint, Knip, Typecheck, Unit Tests, Metrics). |
