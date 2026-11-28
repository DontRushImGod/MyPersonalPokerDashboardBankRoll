# Project memory

## Product intent & audience

- Poker tracker app for logging sessions, results, and stats.
- User is newer to React/web fundamentals; wants educational, plain-language guidance.
- Goal: production-worthy, fully featured app with auth, user profiles, and a build roadmap.
- User wants a big, differentiating feature set that makes the app stand out from other poker trackers.

## Brand personality & voice

- Educational, approachable, beginner-friendly but architecturally sound.

## Visual design & UX direction

- Stack: Vite + React (JSX), Tailwind CSS, Lucide React icons.
- Aesthetic: beautiful, non-cookie-cutter, production-grade.
- No extra UI/theme/icon packages unless explicitly requested.

## Decisions, constraints & rationale

- Framework fixed as **vite-react**.
- `.bolt/prompt` holds authoritative global instructions (design quality, stack limits, senior-architect persona, blueprint expectations) — not restated here.
- Proposed differentiators: (1) gamified progression — ELO-style Poker Rank, XP/levels, unlockable badges, daily/weekly challenges; (2) AI Coach insights — rule-based pattern detection with plain-English recommendations (must be honest, not fake "AI"); (3) session story/timeline — visual narrative feed of milestones/streaks.
- Recommendation: gamified progression as primary differentiator; builds on existing session data and drives retention.

## Open questions & assumptions

- **Assumption:** tracker = session-level results/stats (hands, winnings, sessions) — exact scope unconfirmed.
- **Open:** Which differentiator(s) to pursue — user hasn't confirmed yet.
- **Open:** Backend/auth choice (Supabase vs Firebase) undecided.
- **Open:** Database schema for user profiles undefined.
- **Open:** Single-user local app vs multi-user with accounts/sessions.