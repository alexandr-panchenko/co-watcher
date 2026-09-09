# Inspiration

Occasionally you find great explanations or important context in a video's comment section. What if the entire comment section consisted only of timestamped comments created personally for the viewer?

Do you often hear references that you don't recognize? Maybe claims that you can't trust blindly? Or are you exploring a topic that is entirely new to you, or just watching in a foreign language that you are not fluent in?

Whatever you watch, you can make it richer with comments made specifically for you. A personal agent built on Google Cloud AI Agent Builder and Parallel Search can do just that.

# What it does

Co-Watcher makes videos more informative, personal, and interactive.

A viewer can paste a YouTube link or ask Co-Watcher to recommend something worth watching. Through a single conversation, they can explain their interests, background, viewing purpose, and current focus. Co-Watcher uses that information to decide which moments deserve attention and what kind of commentary will be most valuable.

As the video plays, Gemini analyzes its content and identifies opportunities for further research. Co-Watcher then uses Parallel Search to investigate those moments and presents concise, timestamped comments supported by real sources. 

Comments are tailored to the individual viewer rather than generated as a fixed summary. Someone new to a subject receives an accessible explanation, while an experienced viewer gets deeper connections or specialized observations.

Each comment is anchored to the relevant point in the video, appearing in both a chronological feed and a visual "gem" rail below the player. Viewers can explore sources, ask follow-up questions, shift the commentary focus, or jump directly to any referenced moment.

When the viewer is inspired by a moment, they can record a voice or camera reaction linked directly to that timestamp. Co-Watcher saves the reaction alongside the research notes and helps assemble selected source clips, recorded takes, and supporting visuals into a finished reaction video. Simple edits can be handled directly through the chat.

# How we built it

Development began in Google Stitch. After prototyping the core user flows, the designs were exported to Google AI Studio to create a working mock prototype, then Google Antigravity was used to drive the web application to completion.

Co-Watcher is built around a persistent viewing room combining a shared conversation with structured application state:

- Intelligence: Gemini handles video understanding, reasoning, personalization, and editorial decisions. The Google GenAI SDK and ADK power the agent workflow and its dedicated tools (inspecting context, initiating research, publishing cited commentary, and assembling reaction compositions).

- Research: Parallel Search serves as the external retrieval engine. Sources and excerpts are attached directly to comments as verifiable evidence rather than unsupported assertions.

- Frontend: Built with React, TypeScript, and Vite. It integrates the YouTube IFrame Player API for synchronized playback, seeking, and timestamp tracking while keeping commentary and controls native to our UI.

- Backend & Storage: Hosted on Cloud Run using a lightweight Hono server. Cloud Firestore manages viewing rooms, chat histories, comments, user preferences, and reaction timelines.

- Media Pipeline: Browser Media APIs handle in-app webcam and audio capture, while a deterministic media pipeline handles rendering and export.

# Challenges we ran into

The hardest challenge was teaching Co-Watcher restraint—knowing when commentary is actually helpful. A flood of generic comments quickly ruins the viewing experience. High value comes from pacing: delivering only high-signal insights at precisely the right moments.

# Accomplishments that we're proud of

We successfully merged conversational AI with a purpose-built workspace—bringing together the video player, contextual comment feed, and reaction recording flow into a seamless, intuitive user experience.

# What we learned

Relevance, timing, restraint, and personalization matter far more than the raw volume of generated insights.

# What's next for Co-Watcher

What began as a research experiment has grown into a tool I genuinely rely on every day. Next steps involve refining the video composition engine, adding support for more video platforms, and continuing to sharpen the agent's editorial judgment.
