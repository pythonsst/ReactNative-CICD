# Contributing

Thanks for your interest in improving this project! This is an open-source
React Native portfolio app with a production-grade EAS + GitHub Actions CI/CD
pipeline. Contributions of all sizes are welcome.

## Getting started

```bash
yarn install        # install dependencies
yarn start          # start the Metro bundler
yarn ios:dev        # build + run the dev variant on the iOS simulator
yarn android:dev    # build + run the dev variant on an Android emulator
```

> Scripts follow a `<action>:<profile>:<platform>` convention (e.g.
> `eas:build:prod:ios`). Run `yarn run` to see the full list.

Before opening a pull request, make sure the checks pass:

```bash
yarn lint           # ESLint
npx tsc --noEmit    # TypeScript type-check
yarn test           # Jest
```

## Project structure

The app is intentionally small and layered. Everything portfolio-related lives
in one self-contained **feature folder**, `src/portfolio/`, so it's easy to find
your way around and the whole feature is portable.

```
.
├── App.tsx                  # Thin entry shell — just renders <PortfolioScreen />
├── index.js                 # App registry entry point
├── src/
│   └── portfolio/           # The entire portfolio feature
│       ├── PortfolioScreen.tsx     # Scroll container, sticky header, section order
│       ├── index.ts                # Feature public API (exports PortfolioScreen)
│       ├── components/
│       │   ├── ui/          # Reusable, content-agnostic primitives
│       │   │   ├── Section.tsx          # Titled section wrapper (eyebrow + gradient bar)
│       │   │   ├── GlassCard.tsx        # Frosted-glass surface
│       │   │   ├── Reveal.tsx           # Fade + slide-up entrance animation
│       │   │   ├── PressableScale.tsx   # Press scale + haptic feedback
│       │   │   ├── StickyHeader.tsx     # Scroll-aware top bar
│       │   │   └── index.ts             # Barrel export
│       │   ├── sections/    # Full-width page sections (read from data/)
│       │   │   ├── HeroSection.tsx
│       │   │   ├── AboutSection.tsx
│       │   │   ├── SkillsSection.tsx
│       │   │   ├── ProjectsSection.tsx
│       │   │   ├── ExperienceSection.tsx
│       │   │   ├── ContactSection.tsx
│       │   │   ├── Footer.tsx
│       │   │   └── index.ts             # Barrel export
│       │   └── index.ts     # Re-exports ui + sections
│       ├── data/
│       │   └── portfolio.ts # Single source of truth for all content + its types
│       ├── theme/
│       │   └── theme.ts     # Design tokens: colors, spacing, radius, type, gradients
│       └── utils/
│           ├── openUrl.ts   # Safe external-link opener
│           └── haptics.ts   # Haptic feedback helpers (optional native module)
├── .github/workflows/       # CI + EAS build/submit/update pipelines
├── docs/                    # EAS, release, and screenshot guides
└── android/  ios/           # Native projects
```

### Where things go

- **Content** (your name, projects, experience, links) lives only in
  `src/portfolio/data/portfolio.ts`. You should be able to fully personalize the
  app by editing that one file.
- **Look and feel** lives in `src/portfolio/theme/theme.ts`. Change the palette
  or spacing there and it propagates everywhere.
- **A new reusable widget** goes in `src/portfolio/components/ui/` and gets
  exported from its `index.ts`. It should take props and stay unaware of content.
- **A new page section** goes in `src/portfolio/components/sections/`, reads from
  `data/`, composes `ui/` primitives, and is added to `PortfolioScreen.tsx`.

## Pull requests

- Keep PRs focused; one logical change per PR.
- Match the existing code style (Prettier + ESLint are enforced).
- Include a clear description of what changed and why.
- Make sure `lint`, `tsc`, and `test` all pass.

## Code of conduct

Be kind and constructive. We want this to be a welcoming project for
contributors of all experience levels.
