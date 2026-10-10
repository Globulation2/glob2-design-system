# Create a downstream project

Install the package from an immutable Git revision; copy the relevant example from
`examples/`. Plain HTML and Astro need no React installation. React consumers import
`@glob2/design-system/react` and wrap theme-aware content in `ThemeProvider`.
The examples are independent projects with their own manifests; the theme package
has no npm workspaces and no Git-install build hooks.

1. Import tokens and fonts, then opt into base/component/brand styles as needed.
2. Add `.g2-ui` to the body or a contained UI region.
3. Copy the package's external bootstrap script to a same-origin URL before paint.
4. Wire a theme button with consumer-owned labels. Use existing system/light/dark semantics.
5. Import brand assets by package path; static consumers may copy selected assets at build time.
6. Keep business logic and layouts local. Reuse component recipes instead of copying their CSS.
7. Record the source theme SHA with each build and test both themes before publishing.

The online app and marketing site show production bootstrap integration. Their
`design:sync` commands resolve current main once, install that SHA without altering
committed manifests/lockfiles, and record `.cache/design-system.json`. Set
`GLOB2_DESIGN_SYSTEM_SHA` to reproduce a build. Builds fail if resolution or installation
fails; they never silently switch to stale cached themes. A theme update affects each
site the next time that site builds.

For local package development, use a Git candidate commit via the same override after
pushing it. This exercises actual Git packaging rather than a source-only alias.
A functional cookie shares preferences only on glob2online.com and its HTTPS subdomains.
Localhost and third-party previews use origin-local storage.
