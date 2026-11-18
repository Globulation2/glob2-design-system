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

The silent colony recording was refreshed on 18 November 2026 from the public
0.11.6.1 macOS arm64 release, source `1b6051421821`. It shows the real live
menu-colony simulation. A declared crop removes the menus; native unit/building
status bars remain visible. The 1600 × 900 MP4 lasts 15 seconds with a one-second
dissolve joining the end to the opening. Both posters use its exact first decoded
frame. `colonyCapture` in the provenance manifest records the package/binary/video
hashes, source interval and crop, separately from the older sprite import revision.
Keep the MP4 and its two posters together. The upstream `tools/record_menu_colony.py`
also supports capture through a source-built harness; this refresh instead uses the
released client's embedded recorder and a declared crop to preserve release identity.
Do not request video for reduced-motion visitors. Self-host the selected assets
with the consuming application; no runtime GitHub or font-provider fetch is needed.
