# Verdant Engine

A local, offline roguelite incremental game about a magical forest reclaiming an abandoned industrial world.

## Play

On Windows, extract the download and double-click **Play.cmd** inside the VerdantEngine folder. The portable Windows release includes Node.js; the source-only edition requires Node.js 18 or newer. On other systems, run `node server.mjs` in the game folder and open http://127.0.0.1:47831.

Play in one browser tab at a time. The local server listens only on your computer. No internet is needed except to check or download updates. Keep using the same address and browser for browser backups.

## Your journey

- Three independent save slots and three freely changeable playstyles.
- Five districts per expedition, four randomized relic drafts, and a final restoration reward.
- Four repeatable expedition upgrades; rhythmic clicks build up to a 35% bonus.
- 48 permanent skill nodes with three ranks each, prerequisites, and free refunds between runs.
- Increasing prestige difficulty and seed rewards, an expedition journal, and up to eight hours of offline passive production.
- Manual saves, configurable autosaving, backup import/export, sound, motion, text size, and contrast settings.

Harvest using the central button or Space. Spend aether frequently. Your restoration total never decreases when you spend. Restore each district to select a relic. Return after the first milestone to bank seeds, or complete all five for a larger reward. Invest seeds in the root network before beginning again.

## Saves and updates

The server saves all groves to **VerdantEngine-saves/groves.json beside the game folder**, plus a previous-copy backup. Browser storage provides a second copy. Save schema 1 is versioned independently from game releases. The game selects the newest valid browser or disk archive at startup.

Before updating, use Settings → Export all groves. Save, close the game tab, and run **Stop.cmd** to stop its local server, replace only the **VerdantEngine** folder, and leave **VerdantEngine-saves** in place. Reopen Play.cmd. If you move to a different parent folder or device, import your exported backup. Never include your save folder in a public repository.

Settings checks the latest public GitHub release in **lolz629-ship-it/game-test** and offers its download when newer. Updates are downloaded with your approval and installed by replacing the game folder; the game never executes downloaded code automatically.

## Development

Dependency-free ES modules: `engine.mjs` contains all deterministic economy rules, `app.mjs` the interface, `style.css` presentation, and `server.mjs` local storage and static serving. Run `node --test tests.mjs server-tests.mjs` for regression tests and balance simulations. Run `node build.mjs` to validate syntax and assemble `dist/VerdantEngine`.

Release: update the version in engine.mjs and package.json, test, build, package VerdantEngine.zip, and publish a matching GitHub release tag. The updater uses the latest release API and the asset name VerdantEngine.zip. Keep save schema stable or implement a migration before changing it.

Initial balance is simulation-tested; long-term balance still benefits from real play feedback. Original game art was generated for this project. No analytics or third-party fonts are loaded.

