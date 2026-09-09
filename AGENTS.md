# AGENTS.md — Co-Watcher Working Contract & Operational Invariants

Welcome to the Co-Watcher codebase. This document defines the operating rules, execution bounds, and governance invariants for all autonomous and pair-programming agents (including Antigravity) working inside this repository.

---

## 1. Execution Bounds & Scope Control
- **Strictly Execute the Current Numbered Task:** Agents must execute *only* the specific deliverables defined in the currently assigned task.
- **No Speculative Anticipation:** Do not anticipate upcoming tasks, jump ahead to later phases, or invent missing product behavior before it is formally requested and specified.
- **No Premature Feature Implementation:** Do not create feature code, exploratory endpoints, or partial components ahead of the sequence.

---

## 2. Invariance of Requirements & Non-Degradation
- **Fixed Requirements are Strict Invariants:** Product requirements, constraints, and architecture guidelines established in task prompts and approved design documents are invariants—not loose suggestions.
- **No Scope Reduction or Degradation:** Agents must not reduce functional scope, dilute precision via fuzzy summaries, omit explicit edge cases, or replace specified features with simplified approximations.
- **No Unauthorized Framework/Library Substitutions:** Use the repository's established toolchain (Vite, React, TypeScript, Bun/npm, Vanilla CSS / Design Tokens). Do not swap libraries or introduce external frameworks (e.g., Tailwind CSS, Redux, alternative UI kits) without explicit, documented user instruction.
- **Preserve Approved UI Layouts:** Approved screen layouts, proportions, and information hierarchies must be faithfully preserved, not redesigned or casually altered.

---

## 3. Append & Patch Discipline for Governance & Docs
- **Targeted Modifications Only:** When updating documentation, checklists, status trackers, or governance documents, agents must apply surgical append or patch operations to specifically targeted sections.
- **Never Rewrite or Clobber Wholesale:** Do not wipe, recreate, or replace entire specification documents.
- **Preserve Specifics:** Retain all existing concrete conditions, numerical targets, file references, exclusions, and historical context.

---

## 4. Design vs. Production Data Separation
- **Visual & Layout Authority Only:** Approved Google Stitch screenshots, Figma frames, and UI exports define visual appearance, typography, color palettes, spacing, and structural layout.
- **Mock Data is Not Domain Fact:** Text snippets, sample entity names, mock timestamps, example comments, and hardcoded metric values appearing in visual mockups must never be treated as production evidence or domain ground truth.
- **Explicit Domain Modeling:** Real domain facts, schemas, and API contracts must be defined and validated independently from visual placeholders.

---

## 5. Provenance, Authorship & Code Sourcing
- **Native Authorship:** All implementation must be authored natively within this workspace by Antigravity and the project collaborators.
- **No Borrowed Code:** Do not import, copy-paste, or adapt code snippets from prior external hackathon repositories or legacy side projects.
- **Traceable Attribution:** Maintain clarity on what code was generated natively versus verified external library code.

---

## 6. API, Integration & Architecture Integrity
- **No Speculative Assumptions:** Never guess or fabricate model identifiers (e.g., non-existent Gemini model variants), undocumented parameters, or unsupported SDK endpoints.
- **Grounding Against Official Docs:** Every external API integration (e.g., Google Gen AI SDK, Gemini Live / WebRTC / WebSocket APIs, video players) must be grounded in and verified against official developer documentation.
- **Explicit Flagging of Unverified Facts:** Unresolved integration details or external dependencies must be flagged explicitly as unverified in `docs/CO_WATCHER_STATUS.md` rather than masked with plausible-sounding assumptions. Settled architectural decisions may not be reopened without explicit user instruction.

---

## 7. Security & Quality Gates
- **Zero Secrets / Zero Token Leaks:** Never print, log, hardcode, or commit credentials, API keys, service account tokens, or confidential environment variables. Always rely on local `.env` files matching `.env.example`.
- **Enforce Strict Quality Standards:** Never soften, comment out, or bypass TypeScript compiler checks (`tsc`), linters (ESLint), build steps, or testing hooks to force progress.
- **Type Safety:** Preserve strict TypeScript types; avoid arbitrary `any` or untyped escape hatches.

---

## 8. Truthful Status Reporting Standard
All task completion messages, walkthroughs, and progress reports must distinctly categorize:
1. **Completed Work:** Concrete deliverables completed and committed/staged in the current step.
2. **Verified Evidence:** Direct verification results (e.g., `tsc` passing, build outputs, test logs, file inspections).
3. **Unverified Items & Hypotheses:** Known unknowns, unverified external assumptions, and stubbed contracts awaiting upstream details.
4. **Blockers & Impediments:** Real impediments requiring user input, external keys, or missing assets.

*Claiming that mock data or unit test stubs prove live API integration is strictly forbidden.*
