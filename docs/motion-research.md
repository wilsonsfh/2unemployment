# Web motion research

Scope: Astro + React implementation with Cloudflare D1; see `progress.md` for release status. The app is a job board with search, filters, result lists, saved roles and comparison. This is a bounded recommendation, not a request to install a package or redesign the interface.

## Recommendation

Start with CSS transitions and keyframes for small, state-driven feedback. They add no JavaScript dependency and work in both React and Astro. Keep motion brief and purposeful: e.g. fade/translate a result region a few pixels when its contents update, or transition focus/hover affordances. Avoid animating every job row on each keystroke; preserve stable layout and let search remain immediate.

If later interactions need coordinated layout changes, gestures, or enter/exit sequencing, evaluate **Motion for React** (`motion` package; formerly Framer Motion). It is MIT licensed and actively maintained (GitHub API reported last push 2026-11-22; repository [motiondivision/motion](https://github.com/motiondivision/motion)). Its React accessibility guide documents `useReducedMotion` and the `MotionConfig` reduced-motion policy: [Motion accessibility](https://motion.dev/docs/react-accessibility), [reduced motion](https://motion.dev/docs/react-motion-config). It adds a runtime and package bytes; use its documented `LazyMotion`/`m` path to defer features and reduce the initial payload rather than importing the full feature set everywhere: [reduce bundle size](https://motion.dev/docs/react-reduce-bundle-size). Exact shipped size depends on imported features, build output, and compression; measure the production bundle if adopted. Motion is a strong fit for React islands, not a reason to hydrate an entire future Astro page.

**AutoAnimate** ([FormKit/AutoAnimate](https://github.com/formkit/auto-animate)) is a smaller-scope MIT alternative for automatically animating list insertions/removals. GitHub API reported last push 2026-11-23. Its simplicity is useful where automatic FLIP-style list changes are actually wanted, but gives less precise control over interaction choreography and reduced-motion policy; explicitly test and disable/short-circuit animation under reduced motion. For this app’s current search results, CSS is simpler and more predictable.

| Option | License / upkeep evidence | Accessibility | Cost / fit |
|---|---|---|---|
| CSS transitions/keyframes | Browser platform; no third-party license or project upkeep | Use `prefers-reduced-motion`; avoid essential information conveyed only by motion | Zero added JS/runtime; recommended default |
| Motion for React | MIT; active repository and maintained docs/changelog | Built-in reduced-motion hooks/config; still choose appropriate behavior per animation | Additional JS/runtime, with lazy feature loading; best for complex React interaction |
| AutoAnimate | MIT; active repository | Respect reduced-motion preference explicitly; test the resulting movement | Additional small utility/runtime; focused on automatic DOM layout changes |

## Apple-style and native boundary

“Apple-style” is a visual direction, not a web library or a single official timing recipe. Borrow restraint, continuity, hierarchy and purposeful feedback; do not copy platform-specific gestures or imply that a web page is a native Apple interface. Apple’s [Human Interface Guidelines: Motion](https://developer.apple.com/design/human-interface-guidelines/motion) are written for Apple platforms and native UI conventions. SwiftUI/UIKit animation APIs, spring defaults, system transitions, and their lifecycle/accessibility integrations do not run in React/Astro; web implementations must use CSS or web animation APIs/libraries and separately honor browser/user reduced-motion preferences. Apple guidance can inform design judgment, but it is not directly reusable implementation guidance for this project.

The web baseline is the platform preference `prefers-reduced-motion` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)) and WCAG 2.3.3 Animation from Interactions, a Level AAA criterion ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)).

## Bounded example

For a results-region content update, use a subtle CSS transition and turn it off when reduced motion is requested. Keep this local to the results container; do not animate all rows on each filter keystroke.

```css
.results-region {
  transition: opacity 160ms ease, transform 160ms ease;
}

@media (prefers-reduced-motion: reduce) {
  .results-region {
    transition: none;
  }
}
```

Apply an `is-updating` class only for a deliberate short transition; preserve the current instant result-update behavior unless the transition is shown to improve clarity. For transform/opacity motion, avoid animating layout properties such as `height` or `top` without a demonstrated need.

## Reusable agent skill

The project currently has only `.codex/skills/levels-fyi-setup/SKILL.md`; no Apple/web animation skill is present. Research did not identify an authoritative, maintained, project-ready agent skill that is better than these primary platform/library docs. The skill trigger is therefore not met for installing one. Keep this research note as the reusable guidance; revisit a dedicated skill only if the project begins repeated motion design/implementation work.

## Sources and evidence limits

- [Motion docs](https://motion.dev/docs/react), [accessibility](https://motion.dev/docs/react-accessibility), and [bundle guidance](https://motion.dev/docs/react-reduce-bundle-size).
- [Motion GitHub repository](https://github.com/motiondivision/motion) and [AutoAnimate GitHub repository](https://github.com/formkit/auto-animate); repository metadata and declared licenses were checked through GitHub’s public API on 2026-11-23. Push dates indicate recent repository activity, not a guarantee of support or release cadence.
- [Apple Human Interface Guidelines: Motion](https://developer.apple.com/design/human-interface-guidelines/motion).
- [MDN reduced-motion media query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion); [WCAG 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).

No dependencies, skills, or UI code were changed as part of this research.
