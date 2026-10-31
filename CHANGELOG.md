# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versions follow
[Semantic Versioning](https://semver.org/).

## [0.2.0] - 2026-10-31

### Added
- Stadium broadcast design tokens for light and dark themes, checked against WCAG AA.
- Motion foundation: GSAP with ScrollTrigger, SplitText and Flip, shared motion tokens,
  and a formal/playful motion register. Reduced motion is respected throughout.
- Splash screen, route skeleton, and Button, Spinner, Skeleton, RollingNumber and
  DecorQr atoms.
- Landing page: split-flap headline, playable kick-off round, scroll-pinned match
  broadcast with a lazy-loaded 3D podium, how it works, audience tabs, feature tour,
  free demo limits and FAQ.
- Staggered page entrances keyed to each assessment's presentation mode.

### Changed
- Product renamed from Untitled to QUEICE.
- Burgundy palette replaced by semantic token utilities across every page.
- Footer credit now reads "Crafted with <3 by dap_ · a MODULA Project".

### Fixed
- `animate-fadeIn` was never defined; replaced by the `animate-fade-in` token.
- Theme no longer flashes dark before switching to a saved light preference.
- Icon props typed as `ComponentType` so they keep `className` after React Three
  Fiber extends the JSX intrinsic elements.

## [0.1.0]

- Initial frontend: landing, login, dashboard, builder, live host lobby, participant
  flow, leaderboard, stats and settings, backed by localStorage.
