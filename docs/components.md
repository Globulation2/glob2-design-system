# Components and accessibility

All component examples require a `.g2-ui` ancestor. Tokens/fonts and base styles are
separate imports; components do not import global defaults. React components and HTML
recipes use the same classes. Application labels, routes, data fetching and translations
remain the consumer's responsibility.

| Pattern | HTML recipe | React export |
| --- | --- | --- |
| Action | `<button class="btn primary">Play</button>`; anchors may use `.btn` | `Button` (`variant`, `size`, native props) |
| Field | `<label class="field">Name<input></label>`; associate errors with `aria-describedby` | `Field` (`label`, `hint`, `error`, native input props) |
| Surface | `<div class="card">…</div>` | `Card` |
| Status | `<span class="badge ok">Verified</span>` | `Badge` (`tone`: gold/ok/warn/bad) |
| Feedback | `<div class="notice error" role="alert">…</div>` | `Notice` |
| Loading | `<p class="loading" role="status"><span class="glob-spin" aria-hidden="true"></span>Loading…</p>` | `Loading` (translated children) |
| Table | named `.table-wrap[role=region][tabindex=0]`; `.stack` with cell `data-label` for narrow cards | `TableWrap` |
| Tabs | `.seg` with tablist/tab roles, selected state, roving focus and named panels | `Tabs` (`items` with panelId, controlled value/onChange) |
| Mark | `.wordmark`, named with role=img or decorative with aria-hidden | `Wordmark` |
| Icons | inline SVG from the pinned catalog, currentColor stroke | `Icon` (name/size/label) |
| Theme | native button wired by `mountThemeToggle` | `ThemeProvider`, `ThemeToggle`, `useTheme` |

React `Tabs` generates tab IDs. Label each panel using the rendered tab's ID, or give
panels their own accessible label. Support left/right/Home/End keys, keep source text
LTR in RTL interfaces, and preserve a visible focus ring. Do not use visual-only tabs.
Controls use native semantics, disabled state and a 44px coarse-pointer target.
Keep icon-only actions named; decorative icons are hidden from screen readers.

Check WCAG 2.2 AA, keyboard use, forced colors, reduced motion and 200% text reflow.
Use primary and secondary ink for text; tertiary ink is decorative and is not an AA
body-text color. The component gallery supplies both themes and common states.

`mountColony(video, button, {pause, resume, container, onPlaying})` owns visibility,
reduced motion, pause/resume and playback errors. Put the URL in `data-src` rather
than `src` so reduced-motion pages do not request video. Keep a poster visible until
playback succeeds; a cancelled play promise must preserve the resume button.
