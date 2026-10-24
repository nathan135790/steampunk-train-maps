# steampunk train carts — Foundry v13 / D&D 5e

By **Nathan Martinez** · Module **v1.2.0** · module ID `steampunk-train-scenes`

## What's included

- **15 editable scenes**: 5 original carriages + 10 expanded train cars, each 3000×1500, WebP, with walls, one connecting door at each end (except locomotive's sealed front), brass lanterns, and soft train ambience.
- **40 D&D 5e NPC actors** spanning every train carriage, with AC, HP, movement, ability scores, Challenge Rating, flavorful descriptions, a written signature action, and matching illustrated heraldic token badges.
- **One-click Foundry importer** that offers to import missing NPCs/scenes when your GM next loads the game, and places NPC tokens in their assigned carriage.

### Install / update an existing v1.0 or v1.1 installation

1. Back up your Foundry world. **Stop your Foundry server** before replacing files.
2. Extract this ZIP so `module.json` lives in `FoundryVTT/Data/modules/steampunk-train-scenes/module.json`.
3. Restart Foundry v13. In your **D&D 5e world**, enable **steampunk train carts** under **Manage Modules** (if already enabled, leave enabled).
4. When the GM opens the world, approve **Import Missing Scenes + NPCs**. This will add only missing actors and scenes, plus the new actors' tokens to scenes already imported.
5. NPCs will appear in the **Steampunk Train — NPCs** folder in the Actor Directory. Scenes remain in **Steampunk Train Carriages**.

The updater looks for module flags on existing scenes (`mapId`) and NPCs (`npcId`) to avoid duplicates. It does **not** overwrite scene drawings, walls, audio, lighting, existing tokens or player edits. New NPC tokens may need to be moved to better starting locations if you have rearranged your world scenes.

### If you dismissed the prompt

As GM, press F12 and paste:

```js
game.modules.get("steampunk-train-scenes").api.showImportDialog()
```

Or import only NPCs without adding any tokens:

```js
await game.modules.get("steampunk-train-scenes").api.importActors()
```

Or add missing NPC tokens later:

```js
await game.modules.get("steampunk-train-scenes").api.populateScenesWithNPCs()
```

### Notes

- This pack imports **world Actors** rather than a compiled LevelDB Actor compendium; the actor templates are included as individual files in `actors/`, so the module can be distributed easily as a ZIP.
- Actor skills are represented by general ability scores and CR-appropriate AC/HP. Signature attacks are documented as text on the sheet and a basic feature item, **not automated combat activities**; customize action automation for your installed D&D 5e system if desired.
- Token art is a heraldic emblem identifying each role, not a full-body portrait.
- Train scenes remain separate; automatic transfers between carriages are not set up.
- This pack was statically validated for Foundry v13 document shapes but not executed in your particular Foundry installation. Test one NPC's sheet and token in a duplicate world first.
- Updating the module in its filesystem does not require pushing to GitHub. The `download` URL in `module.json` points to the latest generated ZIP committed by the GitHub Actions workflow; bump the version for Foundry to detect updates.

## Directory layout

```text
steampunk-train-scenes/
  module.json
  scripts/importer.mjs
  scenes/*.json            (15)
  actors/index.json
  actors/*.json            (40)
  art/tokens/*.webp        (40)
  maps/*.webp              (15)
  audio/moving-train-loop.ogg
```
