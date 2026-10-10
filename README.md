# Shared Glob2 design system verification

The shared package is published at `acd277710acfebf528e1fc6f653d55fdf75de4b2`. Consumer changes are [online PR #1078](https://github.com/Globulation2/glob2/pull/1078) and [marketing PR #46](https://github.com/Globulation2/glob2-online-website/pull/46). See `revisions.json` for product/base identities and toolchains. This evidence branch is separate from distributable main.

## Shared package

- Generation consistency, portable token types, AA text contrast, all chart/status tokens, asset hashes and licenses: passed.
- Fourteen unit tests cover theme migration, persistence failures, controller cleanup, media preferences, colony pause/resume, HTML/React tab keyboard behavior and field/icon accessibility.
- Chromium, Firefox and WebKit secure parent-domain cookie tests: 3 passed. Tests use routed HTTPS origins to exercise browser cookie Domain/Secure behavior and self-only CSP; no production service was contacted.
- Independent fresh Git installations with dependency scripts disabled build plain HTML, Astro without React, and React. Each emits the expected theme SHA; no theme definitions are copied. The examples also exercise the packaged build installer.
- [Hosted shared CI passed](https://github.com/Globulation2/glob2-design-system/actions/runs/38077932662).
- `package-size.json` records the archive size and file inventory (7,950,873 bytes compressed, 8,115,419 unpacked, 108 files). No runtime dependencies; React is an optional peer. Optional artwork/video account for most package bytes and are only included in consumer web output when used.

Commands: `npm ci --ignore-scripts`, `npm run check`, `npm test`, `npm run test:browser`, `GLOB2_DESIGN_SYSTEM_SHA=acd277710acfebf528e1fc6f653d55fdf75de4b2 npm run test:install`, `npm pack --json`.

## Marketing website

Final candidate: static Astro build, check (0 errors/warnings/hints), 50-page link/media validation and all 9 Chromium/Firefox/WebKit theme tests pass. The previous complete 267-browser-check suite passed on website merge revision `87674de`, using shared `260edcc70b9212c8b9e3b2dcf2cb8c94af37e2cf` (full identities below). Subsequent shared changes add unused chart tokens, plain-HTML tabs and build tooling, and fix nested React text direction; existing website visual rules, colony code and token values are unchanged. The final candidate has focused theme/build checks rather than an unnecessary repeat of all content journeys.

Required JavaScript scripts: 38 passed. Python scripts: 23 passed. Populated-download fixture/browser tests: 18 passed. Canonical legal synchronization passes. Playback checks cover pause/resume, reduced motion, poster fallback, autoplay cancellation and byte ranges in all three browsers.

Two rendered rounds cover home, downloads, guide, privacy and community at 360, 768 and 1440 widths in both themes: 30 captures per round with no reported overflow or axe violations. Eighteen enlarged-text cases also pass. `screenshots/website` includes representative captures and full reports from both rounds and the final review. Those renders use shared `260edcc70b9212c8b9e3b2dcf2cb8c94af37e2cf`, with website final-review capture source `87674de`; they are deliberately identified as earlier visual captures rather than relabeled as the final SHA. Independent content, design, accessibility and integration review found and rechecked fixes to the hero scrim, native hidden controls, license links, privacy rendering and auth controls.

Commands: `GLOB2_DESIGN_SYSTEM_SHA=<candidate> npm run build`, `npm run check`, `node scripts/check-links.mjs`, `SITE_URL=http://127.0.0.1:4322 npm test`, `node --test scripts/test_*.mjs`, Python unittest discovery, legal sync check and populated-download fixture scripts. Final focused browser command: `SITE_URL=http://127.0.0.1:4322 npx playwright test tests/theme.spec.ts`.

## Online platform

Final candidate clean installation succeeds with scripts disabled. Full web build (including its unchanged pinned music decoder prerequisite) succeeds. Final focused unit/integration run: **327 passed, 2 skipped, 44 files** (web tests, API pages/rooms and the upstream building-worker pipeline). TypeScript, ESLint/Prettier and translation checks are recorded in the attached logs.

The broad earlier online run at shared `820dabb730df463e2867d8ee5285769e4efd7b0c` had 1,116 unit/integration passes and two failures. The invite assertion was updated for the shared CSP/controls, then rechecked. The form failure reproduces on base `6ff1ebed476f2a055ccdbe16abd737f541ffcb44` and passes in the final focused run. The earlier broad browser run had **71 passes, 30 failures, 17 skips**. Failure logs and original-checkout comparisons are retained, not discarded.

Baseline comparisons show identical map-upload and studio revision-error assertions, collapsed-sidebar expectations and the optional screenshot log-height ratio (`0.5872303748231966`, below 0.6 on both). Clean original-checkout skin library and leaderboard cases pass; broad-run failures suggest shared fixture-state interference. Final focused cases are recorded separately; this inference is not presented as a proven cause. The multi-page phone axe scan initially exceeded its 120-second limit; its final limit is 300 seconds. The home hit-test now scrolls each control into view before measuring.

The final focused browser run and two rendered online rounds are recorded separately below. Browser-game Watch checks remain skipped because no game build was supplied; native simulation, native UI, mobile platforms and game shell are outside this refactor.

Commands: `npm ci --ignore-scripts`, `GLOB2_DESIGN_SYSTEM_SHA=<candidate> npm run build -w @glob2/web`, `npm run typecheck`, `npm run lint`, `npm run i18n:check`, `npx vitest run apps/web/test apps/api/test/pages.test.ts apps/api/test/rooms.test.ts apps/ai-building-worker/test/pipeline.test.ts`; Playwright grep commands are preserved in browser logs. The API harness uses temporary PostgreSQL databases.

## Packaging and integration

Production `platform` and development `node-deps` Docker images have the same shared SHA and identical installed-file fingerprint. The old Fontsource package is absent from runtime output. Compose validates and update-host/blob-mount tests pass (12 + 1); the integration fixes duplicate blob-directory configuration and an unreachable legal-doc index link already introduced upstream.

Docker commands: `docker build --build-arg GLOB2_DESIGN_SYSTEM_SHA=<candidate> --target platform -f deploy/Dockerfile .`, corresponding `node-deps` and `caddy` targets; image labels and metadata are recorded in `logs/online-docker-revisions.log`. Full engine/relay/AI image rebuilding is omitted because their native behavior is unchanged; shared Node stages and Compose supply the same exact theme SHA to all consumers.

## Independent review and coverage limits

A separate read-only reviewer examined content preservation, tokens/components, optional React, privacy, auth CSP/assets, build resolution, keyboard behavior and two rendered website rounds. Review findings were fixed and rechecked; final implementation review reported no blocker at shared `acd2777`. Final online captures are reviewed separately.

Automated contrast and axe checks are evidence of the tested rules, not a claim that all possible contrast checks completed. Real hardware, screen readers and actual production cross-subdomain deployment were not tested. Cookie integration tests simulate real HTTPS domains in browser routing. There has been no live deployment or consumer merge. Finished document, slide, email and social templates remain deferred as specified.
