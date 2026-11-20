# Project memory

## Product intent & audience

- Project is a **poker tracker app** (inferred from assistant context).
- User appears to be relatively new to React/web development fundamentals (asks clarifying questions about bundled file comments/license headers).
- Goal per `.bolt/prompt`: production-worthy, fully featured app with auth, user profiles, and a clear build roadmap.

## Brand personality & voice

- Tone is educational and approachable; explanations should be plain-language and beginner-friendly while still architecturally sound.

## Visual design & UX direction

- Stack: Vite + React (JSX), Tailwind CSS, Lucide React icons.
- Aesthetic goal (per `.bolt/prompt`): beautiful, non-cookie-cutter, production-grade.
- No extra UI/theme/icon packages unless explicitly requested or unavoidable.

## Decisions, constraints & rationale

- Framework fixed as **vite-react**.
- `.bolt/prompt` defines authoritative global instructions (design quality, stack limits, senior-architect persona, blueprint expectations) — not restated here.
- React is bundled under MIT; no action needed by the user.

## Open questions & assumptions

- **Assumption:** "poker tracker" means tracking poker session results/stats (hands, winnings, sessions) — exact feature scope not yet confirmed.
- **Open:** Backend/auth choice (e.g., Supabase vs Firebase) not yet decided.
- **Open:** Database schema for user profiles not yet defined.
- **Open:** Whether this is a single-user local app or multi-user with accounts/sessions.