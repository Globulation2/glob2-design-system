# Glob2 design system

The reusable visual language of Globulation 2 Online: Meadow and Night colony,
Glob2 Sans headings, Nunito text, glob-like shapes, gold actions and the game's art.
The online app is the visual reference. This repository owns the reusable foundations;
consumers own their content, layouts, application state and translations.

## Install and use

```sh
npm install --ignore-scripts @glob2/design-system@git+https://github.com/Globulation2/glob2-design-system.git#FULL_COMMIT_SHA
```

```js
import '@glob2/design-system/css/tokens.css';
import '@glob2/design-system/css/fonts.css';
import '@glob2/design-system/css/base.css'; // opt-in element defaults
import '@glob2/design-system/css/components.css';
import '@glob2/design-system/css/brand.css';
```

Place reusable component markup inside a `.g2-ui` container (normally the body).
Component styles are scoped to this container. Import only the needed styles/assets.
CSS custom properties retain the online app's public names, including `--bg`, `--ink`,
`--accent`, `--sp-4` and `--r-md`. No app routing, account service or translation
runtime is required. React is an optional peer and only the `/react` export imports it.

Copy `/bootstrap` to a same-origin URL and load it as an ordinary external script
in the document head before styles/body paint. Import the default entry for
`getThemeController()` and `mountThemeToggle()`. The controller shares a functional
preference cookie across glob2online.com subdomains; other origins use localStorage.
Labels belong to the consumer. `/node` supplies `assetPath()` and `cssText()` for
static builds and server-rendered pages. `/colony` supplies the decoration lifecycle.

## Build identity

Downstream builds resolve this repository's `main` once, install that immutable SHA,
and record it with their artifact. Already-deployed sites do not fetch theme code.
`GLOB2_DESIGN_SYSTEM_SHA` selects an exact revision for reproduction or candidate
verification. Consumer bootstrap scripts preserve their normal manifests and lockfiles
while installing the selected shared package. Always run checks against that installation.

## Develop

Use Node 24.14+ and `npm ci`. `npm run generate` regenerates the checked-in CSS,
JavaScript and declarations; `npm test` tests persistence, contrast, source provenance,
components and asset boundaries. `npm run check` rejects stale generated output.
There is deliberately no `build`, `prepare`, installation or packing lifecycle script:
Git installation uses committed outputs and works with scripts disabled.
`npm run gallery` shows the plain-HTML component gallery. See [downstream examples](docs/downstream.md).

## Documentation

- [Design principles and writing](docs/design.md)
- [Components and accessibility](docs/components.md)
- [Tokens and content formats](docs/tokens.md)
- [Assets and provenance](docs/assets.md)
- [Downstream projects](docs/downstream.md)

Code and game artwork: GPL-3.0-or-later. Fonts and Tabler icons retain their separate
licenses in `assets/`. See [asset attribution](docs/assets.md).
