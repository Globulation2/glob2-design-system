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

The silent colony recording comes from the game's real menu simulation, with no UI.
Keep the MP4 and its two posters together. Rebuild upstream using
`tools/record_menu_colony.py` and import all three outputs in a reviewed theme update.
Do not request video for reduced-motion visitors. Self-host the selected assets
with the consuming application; no runtime GitHub or font-provider fetch is needed.
