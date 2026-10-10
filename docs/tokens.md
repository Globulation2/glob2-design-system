# Tokens

`tokens/foundation.json`, `light.json` and `dark.json` are portable DTCG 2025.10 token
files using explicit types. Color values include sRGB components and a hex value;
dimensions and durations include units. `tokens/web.json` contains CSS-specific
expressions (fluid sizes, gradients, compound shadows and asymmetric blob corners).
These expressions are deliberately outside the portable format.

Run `npm run generate` after editing either source. It produces `dist/css/tokens.css`
and `/tokens` JavaScript exports. The `tokens` export contains foundation/light/dark
CSS values; `chartBackground` derives directly from the surface colors. Change palette
values here rather than in downstream styles or chart scripts.

Preserve semantic pairs: page/surface with ink, primary actions with accent-ink,
and danger/success/warning foregrounds with their corresponding backgrounds.
Automated tests check normal text at 4.5:1 and controls/focus at 3:1. Additional
consumer-specific overlays require rendered contrast review.

For slides, documents and images, use portable palette values and typography guidance,
then map dimensions to the output's units. CSS pixels, points and image pixels are
not interchangeable. Choose light or dark deliberately; a print document does not
follow its reader's device theme. Use sufficiently large text, safe contrast, and
clear hierarchy. Production templates for those formats are outside the first release.
