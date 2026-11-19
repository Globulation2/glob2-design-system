# Assets and attribution

Reusable game artwork, wordmark masks, icon, favicon, fonts, resource/building sprites
and real colony footage live in `assets/`. `assets/provenance.json` records the imported
Globulation2/glob2 revision and file SHA-256 values. The source exporter is
`platform/apps/web/art/build_art.py`; run it with `--design-system <checkout>` when
refreshing assets in the theme repository. Review generated changes and update provenance.
Studio reference screenshots and user content remain owned by their consumers.

The artwork belongs to Globulation 2 and is GPL-3.0-or-later. Preserve attribution
and the project's license. Glob2 Sans is a Latin subset of DejaVu Sans; its license
is in `LICENSE-DejaVu.txt`. Nunito uses the SIL Open Font License in
`LICENSE-Nunito.txt`. Tabler icons are MIT-licensed, pinned by the source catalog's
manifest (including source/license information); see `assets/icons/manifest.json`.

The wordmark uses two alpha masks colored by CSS, so it remains legible in both
themes and forced colors. Do not flatten it onto a fixed background for web use.
Use decorative game sprites with empty alt text; write meaningful alt text for
screenshots or images used as evidence.

The silent colony recording was refreshed on 19 November 2026 so the colony's sea
and beach are visible. The earlier release-client capture had to crop the main-menu
panel away, which pushed the shoreline to the frame edge. This capture instead uses
the upstream `tools/MenuColonyHarness` `record-colony` mode, which draws the same live
menu colony with no menu and from the menu's own camera (colony centre at two-thirds
of the width), at the same 1470 × 828 window and 2× pixel density, so no crop is
needed. It ran on the active SDL GPU renderer with unit/building status bars and
reads back each presented 2940 × 1656 frame. High-resolution artwork came from the
default Auto setting on Apple silicon; a side-by-side crop against the superseded
release capture shows the same camera position and artwork detail. This is a source
build of Globulation2/glob2 at `9598555f` (Globulation2/glob2#1868), not a released package.
That harness advances water, shorelines and clouds by the same 40 ms per recorded
frame as the simulation; an earlier capture that used capture wall time played them
about three times too fast and is kept as superseded.
The 1600 × 900 MP4 lasts 15 seconds at the simulation's 25 fps with a one-second
dissolve joining the end to the opening. Both posters use its exact first decoded
frame. `colonyCapture` in the provenance manifest records the source, renderer,
interval, encode and hashes; earlier captures remain in `supersededColonyCaptures`.
Keep the MP4 and its two posters together.
Do not request video for reduced-motion visitors. Self-host the selected assets
with the consuming application; no runtime GitHub or font-provider fetch is needed.
