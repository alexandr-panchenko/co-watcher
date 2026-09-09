# Co-Watcher Implementation Handout

## 0. Architectural Decision Summary & Integration Resolution

This section records the authoritative, verified technical investigation and architectural decisions resolving all integration boundaries and known unknowns prior to implementation. All external API contracts, SDK identifiers, endpoint parameters, and pipeline designs are grounded in official documentation ([S1–S14]).

---

### 0.1 Video Understanding Path: Google GenAI / Gemini

1. **Model Identifier & SDK Binding:**
   - **Primary Model ID:** `gemini-2.5-flash` (via official `@google/genai` SDK / Gemini Developer API [S10]). Fallback for heavy multimodal reasoning: `gemini-2.5-pro`.
   - **API Ecosystem Selection:** **Google AI Studio / Gemini Developer API** is selected over Vertex AI for this hackathon build. The Gemini Developer API directly accepts public YouTube video URLs in the `contents` payload (`fileData: { fileUri: 'https://www.youtube.com/watch?v=...' }`) without requiring upfront video downloads, custom GCS bucket staging, or complex GCP IAM service account credential provisioning.
2. **Video Ingestion & Context Boundary:**
   - Public YouTube URLs are submitted directly to the Gemini `generateContent` API for contextual comprehension, topic extraction, and temporal marker identification [S10].
   - **Transcript Grounding & Subtitle Non-Equivalence:** Audio/visual features and model-generated captions from Gemini are understood to be probabilistic representations rather than legal verbatim transcripts. Therefore, factual assertions, claims, and terminology extracted from video moments must be cross-referenced and verified against external web evidence using Parallel Search [S3] before publishing commentary.
3. **Temporal Grounding, Chunking & Bounded Sampling:**
   - Video analysis is performed in discrete, non-overlapping segments (e.g. 2-to-5 minute semantic blocks or chapter intervals).
   - **No Repetitive Tick Ingestion:** To prevent runaway latency and cost, video understanding is triggered **only** on explicit lifecycle events:
     - Initial video load (room creation / video selection).
     - Explicit user request ("what is happening here?", "fact-check this segment").
     - Background pre-computation for the next chapter when playback approaches a boundary.
   - Playback ticks, time updates (`onTimeUpdate`), and UI repaints strictly execute local DOM synchronization and never dispatch remote Gemini inference calls.

---

### 0.2 Parallel Search Integration Contract

1. **API Endpoint, Headers & Authentication:**
   - **Official REST Endpoint:** `POST https://api.parallel.ai/v1/search` (and TypeScript SDK `parallel-web` [S3]).
   - **Headers:**
     - `Content-Type: application/json`
     - `x-api-key: $PARALLEL_API_KEY`
   - **Request Payload Structure:**
     ```json
     {
       "objective": "Detailed natural language research goal derived from video claim or context",
       "search_queries": [
         "targeted query 1",
         "targeted query 2"
       ]
     }
     ```
2. **Structured Evidence & Excerpt Extraction:**
   - Parallel Search returns a ranked list of web results with URLs, document titles, published timestamps, and dense textual `excerpts`.
   - **Evidence Transformation Contract:** Each retrieved excerpt is mapped directly into an immutable evidence reference attached to the published AI commentary:
     ```typescript
     interface EvidenceSource {
       url: string;
       title: string;
       domain: string;
       publishedDate?: string;
       excerpts: string[];
     }
     ```
   - Parallel Search provides web document retrieval and excerpts; it does **not** provide images, video streams, or YouTube player metadata.
3. **Rate Limiting, Quotas & Execution Budget:**
   - Maximum fan-out per video analysis pass: **3 Parallel Search queries**.
   - Per-room session ceiling: **30 search queries / hour**.
   - Identical or semantically equivalent research queries within the same room session are cached in Firestore / in-memory cache keyed by SHA-256 hash of `objective + search_queries`.
   - Search requests are never initiated on playback ticks, mouse hovers, or marker clicks.

---

### 0.3 YouTube Player & Verified Source Metadata

1. **Player Integration Contract (YouTube IFrame Player API [S4–S5]):**
   - Embedded via `window.YT.Player` inside a dedicated player container.
   - **postMessage Synchronization:** Playback position is synchronized via an active playback timer (250ms polling loop active *only* when player state is `YT.PlayerState.PLAYING`).
   - Player timeline remains completely unaltered; no custom overlays, injected controls, or obscured YouTube chrome. All Co-Watcher UI elements (gem rail, comments feed, reaction controls) reside strictly outside the iframe container.
2. **Verified Video Metadata Acquisition:**
   - Video metadata (title, channel/creator, duration, thumbnail URL, and embeddability) is acquired reliably using:
     - **Primary:** YouTube oEmbed API (`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={videoId}&format=json`) for instant, unauthenticated public verification of title, author name, and thumbnail.
     - **Secondary / Duration Verification:** Standard YouTube Data API v3 (`videos.list?part=snippet,contentDetails,status&id={videoId}&key=$YOUTUBE_API_KEY`) when a server-side API key is present.
   - **Zero Synthetic Metadata:** The application strictly forbids fabricating synthetic titles, fake channels, or randomized video IDs. If a YouTube URL is invalid, private, or not embeddable, the system surfaces a clear validation message to the user in the conversation surface.
3. **Caption & Stream Permission Boundaries [S6–S7]:**
   - Co-Watcher respects YouTube developer policies: raw media streams are never ripped, proxied, or downloaded from YouTube servers.
   - Video captions are not scraped from unauthorized private endpoints. Third-party video understanding relies exclusively on the official Google GenAI multimodal YouTube ingestion capability [S10].

---

### 0.4 Recording & Video Rendering (Export Pipeline)

1. **In-Browser Reaction Recording (`MediaRecorder` API):**
   - **Target Container & Codec Priority:**
     - Primary: `video/webm;codecs=vp9,opus` (supported across modern Chromium and Firefox).
     - Fallback: `video/webm;codecs=vp8,opus` or `video/mp4;codecs=avc1,mp4a.40.2` (Safari 14.1+).
     - Voice-Only Reactions: `audio/webm;codecs=opus` or `audio/mp4`.
   - **Audio Track Isolation (Preventing YouTube Echo):**
     - YouTube player audio is emitted through system output (speakers/headphones).
     - Microphone capture uses strict constraint configuration:
       ```javascript
       navigator.mediaDevices.getUserMedia({
         audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
         video: cameraEnabled ? { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } } : false
       });
       ```
     - Headphones are recommended via non-blocking UI tips during recording setup.
   - **Resource Lifecycle:** Camera and microphone streams (`MediaStreamTrack`) are explicitly stopped and nullified immediately upon recording completion, cancellation, or component unmount.
2. **Video Assembly & Server-Side Rendering (Cloud Run / FFmpeg):**
   - **Buildpack Limitation [S8]:** The standard Google Cloud Node.js buildpack (`google-22`) does not bundle FFmpeg binaries.
   - **Production Architecture Decision:** Video assembly is deployed as a **Cloud Run Job** running a lightweight custom container based on `node:22-bookworm-slim` with `ffmpeg` installed via `apt-get install -y --no-install-recommends ffmpeg`.
   - **Durable Job Execution [S9]:**
     - Long-running composition renders are dispatched asynchronously to Cloud Run Jobs or an asynchronous worker queue.
     - Render status is tracked in Firestore (`queued` → `processing` → `completed` | `failed`).
     - State updates are broadcast back to the client via Server-Sent Events (SSE).
   - **Legal & Source Media Invariant [S6–S7, S14]:**
     - Final composite MP4 rendering (joining source moments + human reaction recordings) **requires** an owner-supplied, authorized original media file (uploaded directly or provided via accessible Cloud Storage URL) associated with the source video's timebase.
     - If no authorized source media file is provided by the room owner, the export pipeline cleanly compiles and downloads the **isolated human reaction take(s)** with an accompanying JSON edit decision list (EDL), explaining clearly that YouTube streaming terms prohibit exporting third-party source video bytes.

---

### 0.5 Small Semantic Agent Tool Surface

The agent's interactive reasoning is strictly bounded to five small, typed semantic tools with runtime schema validation (e.g. via Zod):

1. **`set_viewing_context`**
   - **Purpose:** Records or updates viewer background knowledge, study goals, topic interests, or commentary density preferences.
   - **Arguments:**
     ```typescript
     {
       viewerBackground?: string; // e.g. "Mechanical engineer, beginner in economics"
       learningObjective?: string; // e.g. "Focus on trade agreements and supply chain facts"
       densityPreference?: 'minimal' | 'balanced' | 'comprehensive';
     }
     ```
   - **Returns:** `{ success: boolean; activeContextSummary: string }`
2. **`search_parallel_evidence`**
   - **Purpose:** Executes live, targeted external research on claims, figures, or concepts identified in the video using Parallel Search [S3].
   - **Arguments:**
     ```typescript
     {
       objective: string; // The core research hypothesis or question
       searchQueries: string[]; // 1 to 3 focused search queries
       sourceTimestampSeconds: number; // Video moment being investigated
       claimType: 'factual_claim' | 'historical_context' | 'technical_term' | 'entity_reference';
     }
     ```
   - **Returns:** `{ sources: EvidenceSource[]; queryTimestamp: string; evidenceSummary: string }`
3. **`publish_commentary`**
   - **Purpose:** Creates or edits an authoritative timestamped commentary card in the room feed and gem rail.
   - **Arguments:**
     ```typescript
     {
       sourceTimestampSeconds: number; // Anchor timestamp in video (seconds)
       commentType: 'fact_check' | 'context' | 'highlight' | 'viewpoint';
       shortTitle: string; // Max 60 characters
       conciseText: string; // Max 280 characters
       evidenceReferences: Array<{ url: string; title: string; excerpt: string }>;
       supportingImage?: { url: string; attribution: string; license: string };
     }
     ```
   - **Returns:** `{ commentId: string; publishedAt: string; gemRailIndex: number }`
4. **`assemble_reaction_composition`**
   - **Purpose:** Modifies the room's reaction composition sequence, adjusting source video cut intervals, associated human reaction takes, and playback ordering.
   - **Arguments:**
     ```typescript
     {
       sequence: Array<{
         sceneId: string;
         sourceInterval?: { startSeconds: number; endSeconds: number };
         reactionTakeId?: string;
         layout: 'picture_in_picture' | 'split_screen' | 'cutaway_reaction' | 'voiceover';
       }>;
       targetAspectRatio?: '16:9' | '9:16';
     }
     ```
   - **Returns:** `{ compositionId: string; totalDurationSeconds: number; sceneCount: number }`
5. **`get_room_state`**
   - **Purpose:** Read-only inspection of active video metadata, existing published commentary, and recorded reaction takes to prevent duplicate work.
   - **Arguments:** `{ roomToken: string }`
   - **Returns:** `{ videoId: string; duration: number; commentsCount: number; reactionsCount: number }`

---

### 0.6 Authoritative State & Storage Strategy

1. **Firestore Data Model & Document Schemas:**
   - `/rooms/{roomId}`: Authoritative room configuration, video metadata, viewer preferences, and creation timestamp.
     ```typescript
     interface RoomDocument {
       roomId: string;
       secretTokenHash: string; // SHA-256 hash of room secret token
       videoId: string;
       videoSource: 'youtube' | 'uploaded';
       videoMetadata: { title: string; channel: string; duration: number; thumbnailUrl: string };
       viewingContext: { background?: string; objective?: string; density: string };
       authorizedSourceMediaUrl?: string; // Optional user-supplied source video for export
       createdAt: string;
       updatedAt: string;
     }
     ```
   - `/rooms/{roomId}/comments/{commentId}`: Published commentary feed items.
     ```typescript
     interface CommentDocument {
       commentId: string;
       sourceTimestamp: number;
       commentType: 'fact_check' | 'context' | 'highlight' | 'viewpoint';
       title: string;
       text: string;
       evidence: EvidenceSource[];
       supportingImage?: { url: string; attribution: string };
       author: 'agent' | 'user';
       createdAt: string;
     }
     ```
   - `/rooms/{roomId}/reactions/{reactionId}`: Recorded human reaction takes.
     ```typescript
     interface ReactionDocument {
       reactionId: string;
       sourceAnchorTimestamp: number;
       sourceRange: { startSeconds: number; endSeconds: number };
       durationSeconds: number;
       mediaType: 'video_webcam' | 'audio_voice';
       storageUri: string; // Cloud Storage gs:// URI
       publicPlaybackUrl: string; // Signed or public CDN URL
       transcript?: string;
       inspiringCommentId?: string;
       createdAt: string;
     }
     ```
   - `/rooms/{roomId}/composition/current`: Assembled reaction video sequence and render jobs.
     ```typescript
     interface CompositionDocument {
       scenes: Array<{
         sceneId: string;
         sourceInterval: { start: number; end: number };
         reactionId?: string;
         layout: string;
       }>;
       renderStatus: 'idle' | 'queued' | 'rendering' | 'completed' | 'failed';
       exportMediaUrl?: string;
       renderError?: string;
       updatedAt: string;
     }
     ```
2. **Cloud Storage Bucket Layout:**
   - `gs://${PROJECT_ID}-cowatcher-media/`:
     - `rooms/{roomId}/reactions/{reactionId}.webm`: Raw user reaction takes uploaded directly from browser.
     - `rooms/{roomId}/source/original.{mp4,webm}`: Owner-provided source media for authorized rendering.
     - `rooms/{roomId}/exports/{compositionId}.mp4`: Final assembled reaction video rendered by Cloud Run FFmpeg worker.
   - **Lifecycle Management:** Raw orphaned reaction takes not incorporated into a composition are purged after 14 days via GCS Object Lifecycle rules. Final exported compositions and approved reaction takes retain indefinite storage unless deleted by the room owner.
3. **Secret-Link / Room Access Token Mechanics:**
   - When a room is created, a cryptographically secure 128-bit random token is generated client-side or server-side (`crypto.randomBytes(16).toString('hex')`).
   - The room URL is formatted as `https://<domain>/watch/<roomId>?token=<secretToken>`.
   - The server stores only the SHA-256 hash of the token (`secretTokenHash`) in Firestore.
   - All client mutation requests (publishing comments, uploading takes, saving compositions) require an `Authorization: Bearer <secretToken>` header. Read requests without token allow read-only viewing of publicly marked rooms; write operations strictly require token validation.
   - This provides lightweight, zero-friction security without mandatory account creation or OAuth login friction.

---



## 1. The product in one sentence

**Co-Watcher is a knowledgeable viewing companion that independently researches what is happening in a video, adds the context the viewer did not know to ask for, and helps the viewer turn their own recorded reactions into a simple finished reaction video.**

The core loop is:

**Find or choose → Watch → Discover context → Record a human reaction → Assemble and review.**

The primary product is co-watching. The reaction-production extension is deliberately small. Neither part should turn into a general-purpose editor or an AI research dashboard.

### Why someone would use it

A viewer often does not know which questions to ask. A lecturer mentions a person, shows an old machine, briefly references a debate, or makes a factual claim. Co-Watcher notices that opportunity, researches it, and adds one worthwhile observation at the right moment.

It is closer to watching with an informed friend than to reading automatically generated dictionary definitions. The owner would personally use it to watch lectures, interviews and educational videos.

### Why Parallel belongs here

Parallel Search is a real runtime research tool. Its retrieved sources and excerpts become evidence attached to particular comments, rather than disappearing inside a generic answer. The agent selects what to investigate and decides which findings merit a comment. The official Search API accepts a research objective/search queries and returns source results with excerpts [S3].

Do not replace Parallel with Google Search while retaining Parallel only in the README. Conversely, do not add a pointless search to every simple translation or UI operation just to increase API usage. The substantive external research behind the commentary must genuinely use Parallel.

## 2. Scope: what is included and what is not

### Included

- A persistent viewing room with one selected source video at a time.
- A real embedded YouTube player for supported YouTube sources.
- A single conversational input for choosing videos, preferences, questions and editing requests.
- Video recommendations requested in that conversation.
- Timestamped AI research comments, optional supporting images, expandable evidence and useful highlights.
- A separate gem-style comment rail below the player.
- Human voice-only or camera-and-voice reactions tied to source moments.
- Saved reactions displayed in the same chronological feed and on the rail.
- Simple assembly of selected source fragments and the user's own reaction recordings.
- Small conversational edits: trimming, adjusting source boundaries, choosing supporting visuals and ordering already-recorded reaction scenes.
- Preview and export of the composition when the required source media is available and usable.

### Excluded

Do not add AI narration, AI-written-and-spoken reactions replacing the user, voice cloning, generated music, an unrestricted multi-track editor, arbitrary automatic highlight montages, a social network, browser extension, subscription system, unrelated dashboards or another partner track.

Do not introduce new main screens or controls merely because a design template has space available. This is one independent repository; do not import code from the owner's previous hackathon applications.

### Reference links
- [S3] Parallel Search API: https://docs.parallel.ai/search/search-quickstart

## 3. Approved design and precedence

The owner spent multiple iterations correcting the Stitch design. Preserve it rather than "improving" it.

Precedence:

1. The latest owner-approved behavioral decisions in this brief.
2. The final selected Stitch screens for appearance and layout.
3. Necessary implementation details, only where the first two leave a gap; do not change an agreed decision.

Request the final exports/screens if they are missing. Do not treat an older screenshot or intermediate HTML as the final version. The screenshots illustrate appearance, not verified facts or permission to reuse pictured media. Do not copy factual assertions from sample comment text into the actual product dataset.

Use exactly the accepted typography, spacing, palette, surfaces, borders, icon family and icon treatment. Keep one coherent interface across all states. Do not replace it with default component-library styling.

### Screen/state inventory

There are six principal states, not six unrelated products:

1. Landing / no video selected.
2. Video recommendations inside the full chat.
3. Watch workspace, including ordinary/image comments, an expanded comment and a crowded rail.
4. Recording a reaction to a selected source moment.
5. A recorded reaction shown in the Watch feed and rail.
6. Preview/review of a simply assembled human reaction video.

The crowded rail and an image-bearing comment are already demonstrated inside the canonical Watch design. They do not require separate pages.

## 4. The unified conversation surface

The app is a workspace plus one chat, not three separate assistants.

There is one bottom composer for:

- a YouTube link;
- a request for a suitable video;
- why the viewer is watching and what they already know;
- a question about the source video;
- a question about a selected comment;
- a change in commentary preferences;
- a request to assemble or revise their recorded reaction.

It starts approximately one line high and expands upward as text grows. Preserve the accepted voice and send controls. Voice dictation records, transcribes and returns editable text before submission. Do not silently send unfinished dictation.

A compact region above the composer can show the latest user message and latest assistant response, and can be collapsed. A history control opens the full conversation in the same application; the composer remains in the same place with its draft preserved. Returning to the workspace must not lose the selected video, playback position, selected comment or unsent text.

Do not add separate inputs for preferences, comment questions, recommendations or editing. Attach selection context to a submitted message so "explain this" can refer to the selected item. Capture that context when the user sends, not later when playback has moved.

### Follow-up prompts

Use short, non-blocking suggestions near the composer. They are guidance, not an interrogation and not synthetic chat messages. The user may ignore them and say something unrelated. Prepare a small set of relevant follow-ups when the agent runs; local selection/rotation should not require a model request for every display change.

Publicly discoverable information should be researched when appropriate. Personal goals or genuinely ambiguous preferences may require one useful question. Do not force an onboarding questionnaire before allowing useful work.

### Dictation is not a reaction take

The composer microphone supplies a message to the agent. The reaction-recording control creates a media asset intended for playback/export. Keep those intentions and their permission/status indicators unambiguous, even if they use related browser capabilities.

## 5. Landing and in-chat recommendations

### Landing

Keep the existing header and composer. Use the approved heading:

**Watch with someone who can look anything up.**

The short description explains both personalized research commentary and turning the viewer's own reactions into video.

Exactly five capability cards were agreed:

1. **Watch with context** — timestamped background, people, events, concepts and connections absent from the video itself.
2. **Fact-check while watching** — investigate checkable claims and show relevant supporting or contradicting evidence.
3. **Make it personal** — the viewer's knowledge, interests and viewing purpose change the agent's editorial choices.
4. **Find something worth watching** — ask for videos matching a topic or goal.
5. **Turn reactions into videos** — record your own voice/camera reaction and assemble it with source moments and supporting visuals.

Use the final Stitch wording where it already expresses these ideas accurately. Suggested prompts insert into the composer, without immediately sending. Do not add another URL field or manual session-save action.

### Recommendations

Recommendations are part of an assistant chat response. The design shows four compact choices with thumbnail, title, creator, duration and a personalized reason; one is subtly marked **Best match**. In live use, return fewer rather than inventing unavailable results.

Selecting a recommendation opens that source in the Watch workspace while retaining the user's expressed purpose. Refinements such as "shorter", "more technical" or "university lectures" use the same chat.

The exact metadata acquisition method is not fixed in this source. Record that narrow integration detail as unresolved, while preserving the requirement to obtain verified YouTube metadata and handle availability/embedding. Never fabricate titles, durations, channels, thumbnails or video IDs.

## 6. Watch workspace: structural invariants

### The source player

Use the real YouTube IFrame Player API, not an imitation built from a screenshot and custom controls. Do not alter the native YouTube timeline. All Co-Watcher UI must stay outside the player [S4–S5].

The player API exposes timing and seeking, not an editable source media file. That distinction is fundamental to the export design.

### Standard desktop layout

The main viewing section has two columns:

- **Left:** video player, then a single combined title/metadata + gem-rail section.
- **Right:** internally scrollable commentary.

The left column alone determines the section's height. The comments cannot enlarge it. Align the comments' top with the player's top and their bottom with the combined title/rail section's bottom. Keep a real horizontal gap: no overlap beneath the video or rail and no artificial dead space under the left column.

Do not merge the native YouTube controls with the gem rail. Merge only the app-owned title/metadata and app-owned rail into one visual section.

The chat area starts immediately below the viewing section with the accepted spacing. Expanding a comment or loading an image must not break the right-column height constraint. The comment list scrolls internally; headings/controls follow the accepted mockup.

### Theater and narrow layouts

In wide/theater mode, and when a side-by-side layout no longer fits, comments move below the video. Do not carry desktop absolute-height assumptions into a stacked layout. Distinguish theater layout from the native iframe fullscreen mode; do not promise app comments inside YouTube's native fullscreen.

### Chronology and synchronization

Sort feed items by their source-video timestamp, oldest at the top. Generation time is not the sorting key. Human reactions join that same source-time chronology.

Allow browsing all available comments, including future and past moments. Highlight the comment associated with the current playback position. Keep manual selection separate from playback activity so a user can inspect an older item without losing it.

A marker click seeks to its source time and reveals its feed item. A timestamp click in the feed seeks the source video. Passive playback does not forcibly scroll someone away from a manually inspected comment. Reuse any approved follow-playback control rather than inventing another toolbar.

Ordinary AI comments do not automatically pause playback. Explicit recording/preview actions may pause it to avoid audio conflicts, and that change must be understandable to the user.

## 7. Gem rail and comment content

The rail is a thin app-owned strip beneath the player, inside the shared title/metadata section. It is not a second transport control or playback progress bar.

Small colorful shapes suggest where worthwhile comments occur. Preserve the approved gem shapes/colors. Use both shape and text labels where needed; do not rely solely on color.

Nearby markers cluster according to available display space. A cluster can show a count and reveal its members. A tooltip/popover shows timestamp, type and title. No separate legend is needed.

Touch and keyboard users must be able to reveal and select the same information. Tooltips, expanded clusters and other Co-Watcher elements must not overlap the YouTube iframe. Recalculate clustering on resize without changing the underlying comments.

A normal comment contains a timestamp, compact type label, short title and concise text. It may include a small relevant image and expandable sources or "Why this matters" content. Expanded comments stay within the feed, not a new research dashboard.

Images are optional. Use relevant, traceable visual material with appropriate permissions; a found web image is not automatically cleared for export. Store attribution/provenance. A missing image must not invalidate a text comment.

## 8. Editorial behavior: what makes the agent useful

The agent should independently notice opportunities, research them, and decide whether to publish commentary. It is not required to annotate every term or produce a quota of comments.

A worthwhile research comment is:

- anchored to something actually said or shown;
- additive rather than a paraphrase;
- relevant to this viewer;
- concise enough to skim;
- supported by appropriate evidence.

The viewer may want history, technical context, unfamiliar people, connections, fact-checking or language help. These are conversational goals, not separate products with separate input forms.

Fact-checking must distinguish factual claims from opinions, and distinguish contradiction from missing evidence, uncertainty or simplification. Historical claims should be evaluated in their stated time context. Do not turn a confident-looking label into a substitute for evidence.

Highlights are allowed as a distinct source-grounded category: an important explanation or moment worth revisiting can be useful without external research. Mark such a comment honestly rather than attaching unrelated search citations.

Search failures should leave the video usable. Show a truthful partial/error state; do not fill missing research with fabricated sources. Do not identify a person from an unexplained facial guess; use video metadata, spoken introductions, visible names/credits and corroborating sources.

Gemini must determine a bounded research strategy: sensible comment density, batching, caching, concurrency, cancellation and explicit cost limits. The app must not re-analyze the full video or query Parallel on every playback tick, hover or UI repaint.

## 9. Human reaction recording

The viewer selects a source moment or AI comment and explicitly starts a recording.

Show the source timestamp/range and the selected research context. The user records their own voice, optionally with camera. Preserve the existing minimal controls: record/stop, timer, recording activity, camera toggle and review/re-record/keep behavior.

Keep the relevant comment, supporting image and sources readable as research notes. The AI does not narrate, impersonate or automatically read them aloud.

A proposed source range is a suggestion, not an irreversible AI decision. The viewer can adjust it. Do not cut the speaker mid-sentence merely to satisfy a default duration.

The default recording path should avoid unintentionally mixing source audio into the microphone recording. An explicit voice-over flow may be supported if implemented reliably; it is not a license to capture arbitrary YouTube audiovisual data.

Handle permission denial and unavailable microphone/camera with a clear recoverable state. Recording begins only after a user gesture and permission. Stop media tracks when recording ends or the user leaves that flow.

## 10. Recorded reaction inside the Watch feed

A kept recording becomes a timestamped feed item, visually distinct from AI comments but within the same design.

Include:

- source-video anchor, not merely the recording creation time;
- **My Reaction** label;
- recording duration;
- compact audio preview or camera thumbnail;
- play/pause;
- optional transcript excerpt;
- optional link to the AI comment that inspired it.

Its distinctive gem appears on the existing rail. It can cluster with nearby AI comments. Clicking it navigates to the source moment and reveals the reaction card. Playing the recording is a separate explicit action; do not accidentally play source video and reaction audio over each other.

A failed upload must not pretend that the recording was saved. The user needs a clear retry path without losing the usable local take where possible.

## 11. Assembly and preview: keep the scope narrow

### Fundamental unit

**One selected source moment + one human-recorded reaction + optional supporting visual.**

The basic result is a short source segment, the user's reaction, and optionally a return to the source. A supported alternative is the user's own voice over a permitted source segment or supporting visual.

Several already-recorded reaction scenes can be joined in a chosen order. Do not expand this into autonomous discovery of arbitrary new clips or a general-purpose video editor.

### Preview screen

The preview is the newly composed output, not the original YouTube iframe. It needs to agree with the eventual export.

Below it, show the accepted simple semantic sequence. Source blocks refer to source timestamps; reaction blocks refer to the user's recording. A supporting image displayed during the user's reaction is nested within that interval, not an accidental additional block that lengthens the video or introduces an AI voice.

Most changes are requested through the same chat. Supported examples: start the source earlier, trim the first two seconds of a reaction, show an available image while the user speaks, return to the source after the reaction, use only half of a take, or join existing reaction scenes.

Short-form/vertical output, if included in the approved design, should be a bounded framing/export preset. It is not a promise of a new autonomous Shorts-writing pipeline.

The user's actual recorded words remain the narration. Do not add TTS, synthetic commentary, voice cloning or generated music.

### Critical source-media constraint

Separate these capabilities:

1. Watching an embedded YouTube video.
2. Analyzing a supported video through a Google API.
3. Having the source media bytes and permissions necessary to create an exported derivative video.

The first two do not establish the third. The YouTube captions download endpoint also requires edit permission; it is not a general public transcript download API [S6–S7].

Use an owner-provided original media file or another explicitly authorized direct-media source for real rendering. The agreed option is to associate that file with the viewed source and its timebase. Gemini must specify how to validate that the file and selected timestamps actually match.

Do not build a YouTube downloader, extract iframe pixels/audio, proxy restricted content or treat a reaction label as automatic permission to reuse footage. Without an eligible source file, watching, research and recording can still work, but the app must clearly explain why source-inclusive export is unavailable. Do not label a fake concatenation of embeds as an exported MP4.

Plan the production demo with media the owner can actually supply and is authorized to use. Confirm this before promising end-to-end export.

## 12. Architectural decisions already accepted

Carry these principles forward, but independently specify their implementation:

- One standalone repository with no shared application code from the three earlier projects.
- React, TypeScript and Vite for the accepted UI.
- Bun for dependency management, script execution, builds and fast TypeScript tests.
- Node.js production runtime is explicitly acceptable; Bun runtime is not required.
- Google ADK and Google GenAI SDK are the intended agent/model foundation.
- Google Cloud Run for the app backend; Hono is the established lightweight server preference.
- Firestore for persistent structured room state/history, not a required SQL server.
- Cloud Storage for owned uploads, reaction media and generated exports.
- Secret Manager/service identities for server-side credentials.
- HTTP plus SSE for user actions and observable agent/workspace updates.
- Prefer Google Node buildpacks for the web service when compatible; Bun dependency installation is documented [S8].

The actual renderer, system binaries and durable background execution are not yet decided. A separate container/job is justified only by a demonstrated rendering requirement. Do not claim the normal Node buildpack automatically contains FFmpeg. Check build and runtime dependencies before choosing the deployment path.

Do not add SQL, Kubernetes, Redis, a vector database or a generic multi-agent framework without a concrete need. Do not create a separate abstraction platform for this one application.

## 13. State, agent tools, effects and triggers

### Authoritative state

Conversation is input/history; structured room state is authoritative. An assistant saying "I saved the reaction" or "I changed the edit" does not make it true without a successful domain change.

Maintain inspectable history and recoverable revisions. Store current projections for fast loading and record meaningful operations. Debug replay/undo must not repeat external API calls or re-record/upload media. New edits must not silently destroy previous takes or successful exports.

The agent-visible memory includes viewing purpose/preferences, analyzed video context, research/comment history and selected media. Scope preferences deliberately; do not infer a global preference from an instruction explicitly limited to one video.

### Small semantic tool surface

Independently design the final tool contracts. Do not invent one tool for every database operation, but do not hide unrelated operations inside a universal action enum or arbitrary JSON patch tool.

Reason in terms of a few clear responsibilities: choose/update the viewing context, research through Parallel, access relevant video/room information, publish or revise commentary, and create or revise a bounded reaction composition.

For each final tool specify when to use it, when not to use it, arguments, validation, returned evidence/state, recoverable errors and expected agent behavior after failure. Allow useful batches where they are one semantic operation. The model should not manage storage paths, credentials or cloud service administration.

### Deterministic system responsibilities

Persistence, permissions, version checks, marker clustering, active-comment highlighting, playback seeking, browser recording, upload bookkeeping, job retries and execution of a validated render plan are application responsibilities.

The agent makes editorial/research/edit decisions. It does not calculate UI pixel coordinates, keep asking whether playback advanced, or manually duplicate a domain update into every downstream service.

Define explicit triggers: user message, selected source change, requested research, completed analysis/search, kept reaction, requested assembly and render completion/failure. Repeated events must not duplicate commentary, charge twice or publish stale output.

A camera permission prompt and starting a recording are user/browser actions, not something an LLM can do silently.

### Background work

Gemini must choose a reliable way for unfinished research/render work to survive disconnects and service restarts. Do not rely on an unawaited promise continuing after an HTTP response. Cloud Run has specific request, CPU and lifecycle behavior that must be considered [S9].

Keep source-video time, reaction-recording time, output-composition time and wall-clock/job time distinct. Seeking a video does not mean advancing a room's real-world date.

## 14. Platform/API verification before finalizing the handout

Investigate these now, using official documentation. Put the selected approach and any limitations in the final handout rather than leaving a menu of options for Antigravity.

1. **Video understanding:** exact supported Gemini endpoint/model for YouTube input and owned uploads. Direct YouTube input is documented with limitations and preview status [S10]; confirm the chosen Developer API versus Vertex AI path instead of assuming feature parity. Select an available model, keep it configurable and verify timestamp behavior. Model-generated transcripts are not guaranteed verbatim subtitles.
2. **Parallel:** current supported Search API/SDK, source/excerpt response, authentication, quotas, retries and evidence handling [S3]. Do not assume it includes an image-search API or video metadata that the response does not provide.
3. **Player and source metadata:** embedding availability/errors, native controls, origin/referrer, timing/seek behavior, theater layout and inaccessible/private sources [S4–S5].
4. **Supporting images:** a concrete authorized acquisition/attribution path; otherwise use verified user-supplied/demo visuals. No fabricated image URLs or hidden dependency on another AI provider.
5. **Recording/rendering:** supported recording formats in target browsers, actual audio/video decode support, source availability, mixing/trimming and an export format tested outside the app.
6. **Google stack:** current ADK TypeScript compatibility, Node runtime, buildpack behavior and any renderer binary/container needs. Confirm that the proposed SDK choice satisfies the contest's runtime requirement [S1, S8, S11].

Do not copy model IDs, pricing or capability claims from old discussion messages as facts. A successful stub test is not proof of a live integration.

## 15. Quality requirements: mechanical, not aspirational

The owner's clean-code requirements apply from the first implementation commit, including tests, integration adapters and infrastructure scripts. Gemini must turn these requirements into valid, independently authored configuration and instructions.

### Required checks

- TypeScript strict checking, including unchecked-index/optional-property/unknown-error safeguards, and no unused locals/parameters.
- Type-aware ESLint, zero warnings, correct React hooks and accessibility checks.
- Formatter and Stylelint for maintained styles.
- **Knip is mandatory:** unused files, exports, types and dependencies must be removed rather than ignored. Include a normal scan and a production strict scan, configured for real project entry points [S12–S13].
- Bun unit/integration tests; appropriate browser/React tests; Playwright end-to-end tests.
- A Node-runtime smoke test, because production runs Node even though development uses Bun.
- Production build verification.
- Mechanical checks for oversized files/functions and banned suppressions.

Retain the previous agreed limits for owned source: React component files at most 220 nonblank/noncomment lines, other source files at most 340, functions at most 100, complexity at most 12, nesting at most 4 and at most 4 parameters. Split responsibilities; do not minify or scatter meaningless fragments to game the limits. Do not raise thresholds to accommodate a monolith.

No explicit `any`, unsafe coercions or floating promises as shortcuts. External data must be validated. Check dependency cycles with an appropriate import/dependency tool, not by assuming Knip alone catches everything.

### No suppression escapes

Disable ESLint inline configuration and fail on warnings. Do not use ESLint-disable comments, TypeScript-ignore/expect-error/nocheck directives, formatter/stylelint/coverage suppression comments, Knip ignore annotations, skipped/focused tests or broad exclusions to hide failures.

A suppression checker must distinguish executable directives from harmless quoted examples in documentation or its own tests; do not exempt all source/tests/configuration to make it pass. Configure actual tool entry points instead of ignoring unused code. Dependencies/generated outputs need clearly bounded treatment, not a loophole for maintained code.

### Enforced workflow

Pin Bun and dependencies; commit `bun.lock` and use frozen installs. Do not introduce npm/yarn/pnpm lockfiles or make the user switch package managers.

Provide one complete quality command and one CI quality command. The pre-commit hook must block ordinary commits until checks pass. Agents may not use `--no-verify` or disable hooks to proceed.

A local hook can be bypassed; do not claim it provides an absolute server-side guarantee. Require CI checks before deployment and configure protected-branch/ruleset checks when the repository permissions allow it. Deployment must not proceed on a red check.

## 16. Evaluation and visual verification

Prepare both deterministic tests and live semantic evaluation. Do not make one exact prompt, search result or tool sequence the only route through the app.

### Deterministic behavior

Test state/permissions, operation ordering, versioning, source time ranges, source/output-time distinction, clustering, navigation, no duplicate writes, stale-job rejection, retained recordings/exports and failure recovery.

Test the specific hard-won layout invariant with measured DOM geometry: in standard layout the comments panel stays within the left stage's top/bottom boundaries, the horizontal gap remains, long comments/images do not grow the parent, and overflow scrolls internally. Test stacked layouts separately.

Test one composer, preserved drafts, full-chat return, recommendation selection, source/marker/feed navigation, manual-scroll protection, reaction save/playback and missing-media export gating. Include narrow screens and keyboard/touch behavior.

### Semantic grader

Use a Google-model grader to assess whether commentary is genuinely additive, grounded in source/video context, interesting for the stated viewer, not excessively dense, and appropriately uncertain. Include commentary that should be omitted; more comments is not automatically better.

Test preference changes, sensible research choices, source support, faithful reaction trimming, and whether the assistant asks only useful questions. Grade explanations and resulting state with a rubric, not matching exact wording.

### Live integration evidence

Run real Gemini video analysis, real Parallel research and at least one real browser recording plus real eligible-source render. Open the exported file to verify picture, sound, timing and duration. Report latency/failures honestly. A green mock eval is not a successful live demo.

### Demo isolation

The repository contains synthetic/authorized eval cases. The owner's final demonstration inputs are held separately, not copied into fixtures or hardcoded agent instructions. Capability structure may match the eval; exact people, stories, requests and results should differ. Do not secretly improve on a held-out demo and still describe it as unseen.

Keep an exportable, sanitized room record for debugging: input references, operations, tool results, evidence references, model/run metadata and resulting state. Do not export secrets or private media indiscriminately. Do not request or present hidden model chain-of-thought; use observable activity and tool results.

## 17. Security, costs and persistence

A persistent room must not become a publicly writable API merely because it has an ID. Define a minimal room access mechanism using the established secret-link/token pattern; full account management is not a prerequisite. Avoid leaking capability tokens to external links, analytics or logs.

Keep model and Parallel credentials server-side. Treat video speech, subtitles, web excerpts and uploaded files as untrusted evidence, not instructions authorized to change system policy or run tools.

Set enforceable limits for analysis length, requests, search fan-out, parallel jobs, recording/upload size, render duration and retries. Cache reusable work where the relevant API terms permit it. Do not present budget alerts as a spending cap.

Firestore holds structured records/references, not giant audio/video blobs or one unbounded room document. Cloud Storage holds appropriate private media and generated exports. Specify retention/cleanup without deleting the last successful user recording or rendition as a side effect of failure.

## 18. Autonomous development and deployment workflow

The owner is the reviewer and product decision-maker, not a cloud-console operator.

1. Inspect the final Stitch materials and any existing project tree. Do not assume an implementation already exists or copy a previous app.
2. Independently author the final handout and concise Antigravity task.
3. Establish the quality checks before feature work.
4. Verify the highest-risk boundaries first: real video analysis, real Parallel evidence, and actual eligible media for export.
5. Build the accepted interface and the real watch/research vertical slice. Temporary mocks are isolated adapters/tests, not the normal product path.
6. Implement the already agreed recording and small assembly flow without changing the accepted design.
7. Run local checks, then deploy and run live checks. Iterate on observed failures.
8. Have the owner actually watch a video, record a reaction and review the resulting export.
9. Consolidate docs and remove obsolete mock adapters/dead fixtures. Do not remove essential testing/deployment instructions or erase provenance merely to tidy the repo.
10. Prepare the public repository, reproducible testing instructions, architecture diagram, hosted URL and honest demo evidence. No second hackathon track is started until this submission is genuinely ready and sent.

These are implementation stages toward one agreed deliverable, not permission to postpone accepted capabilities into a speculative later version.

Where authorized credentials/tools are available, Antigravity should use CLI/API automation for cloud resources and GitHub configuration. Never assume access just because earlier agents had it. Inspect the environment, respect permissions and leave unrelated projects/billing/credentials alone.

When an owner-only action is unavoidable, request only that action with the exact URL, button and value. Do not ask the owner to perform dashboard work that the authorized agent can perform safely.

## 19. Competition and publication checks

Gemini must verify the current rules rather than inheriting requirements from the missed All Things Agentic event. This event requires real Google/Parallel runtime use, hosted access, an open-source repository and a public English/subtitled demo; the stated evaluated video length is three minutes [S1]. Do not assume an earlier event's four-minute or unedited-video rules apply here.

There is a specific organizer clarification for the Parallel track: published demo/screenshots should use fictional/mock source material, while the live hosted app can show real search results [S14]. Resolve the presentation plan against that clarification before filming. Keep any fixture/demo material clearly labeled. Do not falsify a source URL or a fake API response as if it were live evidence; do not remove mandatory YouTube branding to sanitize a recording.

Use owner-created or authorized demonstration media and a documented approach to source names/images. Do not assume an arbitrary university lecture or a web image is automatically acceptable in a published contest video.

Any claimed capability must have been exercised for real or explicitly identified as limited/unimplemented. Do not claim that this brief guarantees eligibility.

## 20. What Gemini must produce next

Produce independently authored, repository-ready English documentation and a short Antigravity instruction. A suitable compact deliverable set is:

- **CO_WATCHER_IMPLEMENTATION_HANDOUT.md** — complete product contract, screen mapping, chosen architecture, small semantic tool contracts, authoritative state, agent/effect boundaries, rendering/source policy, engineering gates and definition of done.
- **CO_WATCHER_AGENT_TASK.md** — short autonomous execution task, referencing the handout and approved Stitch assets.
- **CO_WATCHER_EVAL_PLAN.md** — repository scenarios, deterministic checks, semantic grader rubric and live-integration checks, excluding the owner's held-out demo script.
- **CO_WATCHER_DEPLOYMENT.md** — precise local/cloud configuration and reproducible deploy/rollback/verification instructions, using actual supported tools and placeholders for unknown account values rather than invented resources.

Do not split into more documents unless it removes genuine duplication. Keep agent-facing instructions short; place detail in the appropriate document.

Before the documents, give a brief decision summary covering:

- the selected video-analysis path;
- how Parallel research becomes evidence-backed comments;
- which agent tools exist and why;
- how watch-source access differs from export-source access;
- the chosen deterministic recording/rendering path;
- the smallest reliable Google Cloud deployment;
- remaining owner decisions, if any.

Do not ask the owner to restate requirements already fixed here. Ask only about a real blocker, such as missing final Stitch exports or lack of an eligible original media file. Do not enlarge the scope to avoid a narrow integration problem.

## 21. Completion must mean a usable product

The final handout must make these outcomes explicit:

- The final Stitch interface is recognizable and its layout constraints remain correct.
- A user can choose a video or request relevant recommendations through one chat.
- Gemini understands a supported source and Parallel genuinely supplies the external research.
- Useful comments appear at valid source times, can include suitable images, and remain browsable without hijacking playback.
- The viewer's goal changes the comments; not every moment needs one.
- A human reaction can be recorded, saved, played, and found in the feed/rail.
- With eligible source media, a simple source/reaction/source composition really previews and exports.
- Without it, the limitation is explicit and existing viewing/recording work is preserved.
- Small chat-based edits change a real composition rather than just an assistant message.
- There is no AI narrator, fake live research, invented media URL or unsupported YouTube capture path.
- Persistence, reconnects and failures do not lose user work or produce duplicate renders.
- Quality checks and representative real integrations have actually been run.
- The owner receives concise evidence and only genuinely unavoidable manual actions.

## Official references for Gemini to verify

Checked during preparation on 2026-09-09; features and rules must still be checked at implementation time. These links support external constraints, not claims that the application is already implemented.

- **[S1] Competition rules:** https://agentic-cinema.devpost.com/rules
- **[S2] Organizer clarification: conceptual strategy vs implementation artifacts:** https://agentic-cinema.devpost.com/forum_topics/44739-ai-tools
- **[S3] Parallel Search API:** https://docs.parallel.ai/search/search-quickstart
- **[S4] YouTube IFrame Player API:** https://developers.google.com/youtube/iframe_api_reference
- **[S5] YouTube embedded-player requirements:** https://developers.google.com/youtube/terms/required-minimum-functionality
- **[S6] YouTube audiovisual-content developer policies:** https://developers.google.com/youtube/terms/developer-policies
- **[S7] YouTube captions download permissions:** https://developers.google.com/youtube/v3/docs/captions/download
- **[S8] Google Node.js buildpacks, including Bun:** https://docs.cloud.google.com/docs/buildpacks/nodejs
- **[S9] Cloud Run runtime contract:** https://docs.cloud.google.com/run/docs/container-contract
- **[S10] Gemini video understanding / YouTube inputs:** https://ai.google.dev/gemini-api/docs/video-understanding
- **[S11] Google ADK documentation:** https://google.github.io/adk-docs/
- **[S12] ESLint configuration:** https://eslint.org/docs/latest/use/configure/configuration-files
- **[S13] Knip CLI and production/strict modes:** https://knip.dev/reference/cli
- **[S14] Organizer clarification on Parallel source material in public demo vs live app:** https://agentic-cinema.devpost.com/forum_topics/44673-demo-video-may-we-show-real-third-party-names-urls-returned-by-live-web-search-parallel-track


