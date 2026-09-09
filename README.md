# Verdant Engine 3.0 — The Little Wild

Extract the full desktop download and open **Verdant Engine.exe**. Keep all bundled files together. No browser or installation required.

## New in version 3
Six cartoon companions: Pip the seedling scout, Luma the moth, Bram the beetle, Zig the storm sprite, Nori the rain frog, and Roo the rocket mouse.

Sixteen workshop blueprints develop to level 6, with behavior-changing evolutions at levels 3 and 6: landing explosions, crew rallies, excavation shockwaves, flower patches, and lightning webs. Base production also increases during development.

Prestige is now a collection of sixteen expedition-changing keepsakes. Full restorations offer a free choice. Equip three between runs: try portals, mushroom trampolines, a hatchable egg, picnics, a pocket orchestra, or friendly meteors. Early returns earn seeds to discover more keepsakes.

240 Hz simulation, hardware acceleration, selectable 30/60/120/144/240 FPS target, and a live frame counter. Actual frames depend on your monitor and hardware. Gameplay speed is independent of rendering speed.

Ability explanations, character hover tips, evolution descriptions, original generative ethereal music, and shorter runs. Automated starter scenarios finish in about 101–159 seconds with frequent purchases; human pacing varies.

## Controls
Hold and sweep salvage. Click characters to activate their special power and overcharge them. Space provides aim assist. Q strikes every target with a root pulse; E turns salvage into flowers and harvests them. Click eggs, mushrooms and lanterns when their keepsakes are packed.

Restore five districts, draft relics, and break the final heart seal. Complete the run to bring home a free discovery. Music and effects have independent volume controls in Settings.

## Saves and updates
Three groves, autosave, manual save, disk backups, JSON import/export, and optional offline growth. Saves live in the **VerdantEngine-saves** folder BESIDE the extracted game folder. Keep it when updating. Put the new game folder beside the same saves folder, or export and import a backup when moving elsewhere.

Version 3 reads groves-v2.json and original groves.json. Former root-network purchases are refunded in full as ancient seeds. Existing runs remain; workshop development is capped at six. Original files are retained. Version 3 writes groves-v3.json with a backup. Version 3 saves cannot be opened in older versions.

Settings → Check for updates reads https://github.com/lolz629-ship-it/game-test/releases. Downloads are explicit and saves remain separate.

## Development
JavaScript modules, Canvas 2D, Web Audio, Electron 44.3.0. Run `node --test tests.mjs`. No npm dependencies needed for gameplay tests.

For packaging, download the official Electron 44.3.0 Windows x64 runtime and verify its SHA256 against official SHASUMS256.txt. Set ELECTRON_RUNTIME to its extracted folder, VERDANT_BUILD_DIR to the desired output, then run `node build.mjs`.

The Windows workflow runs tests, builds, launches a desktop smoke test with separate saves, and packages the game. Renderer isolation and sandboxing remain enabled, with no Node integration and a narrow save bridge.

Characters are original Canvas artwork; music is an original generative score. Sanctuary background generated for this project. Electron and Chromium licenses accompany the runtime. Inspiration: tactile interaction in Gamblers Table, progression rhythm in Nodebuster and Digseum, and build choices in roguelites. No assets or music from those games are used.
