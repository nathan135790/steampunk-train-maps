# Steampunk Train Carts — Foundry VTT v13

By Nathan Martinez · Module ID `steampunk-train-scenes` · Current version **1.2.0**.

This repository contains the editable **source** for 15 fantasy-steampunk train scenes and 40 D&D 5e NPC actors with token badges. The canonical module files live in [`steampunk-train-scenes/`](steampunk-train-scenes/): scenes, maps, actors, tokens, audio and the importer. The root [`module.json`](module.json) is the public install/update manifest.

## Installation

In Foundry's **Add-on Modules → Install Module**, paste the manifest URL:

`https://raw.githubusercontent.com/nathan135790/steampunk-train-maps/main/module.json`

When the GitHub Actions build finishes, the same workflow commits the installation archive as [`steampunk_train_foundry_v13.zip`](steampunk_train_foundry_v13.zip). Enable **steampunk train carts** in a D&D 5e world, then the GM can import missing scenes and NPCs. Existing world scene walls and actor edits are not deliberately replaced.

## Build workflow

[`.github/workflows/build-module-zip.yml`](.github/workflows/build-module-zip.yml) runs on **push to main**. It validates that all 15 maps, 15 scene JSON files, 40 actor JSON files, 40 token icons and the train audio exist, packages just the module contents with `module.json` at the ZIP root, uploads the ZIP as a workflow artifact, and commits the refreshed `steampunk_train_foundry_v13.zip` to `main`. The workflow uses `contents: write` and will skip commits when the ZIP is unchanged. No secrets beyond the built-in `GITHUB_TOKEN` are required.

The directory [`steampunk_train_foundry_v13/`](steampunk_train_foundry_v13/) was an earlier pack and is retained for history; **do not edit it** for new releases. Work in `steampunk-train-scenes/` instead.

For future updates, bump `version` in **both** `module.json` files so Foundry recognizes the new version. The ZIP is also rebuilt when scene or actor assets are pushed without a version change, but existing installations generally need the version increased to see an update.

## Current NPCs and scenes

See [`steampunk-train-scenes/README.md`](steampunk-train-scenes/README.md) and [`steampunk-train-scenes/actors/index.json`](steampunk-train-scenes/actors/index.json). NPC actions are descriptive D&D 5e items, not fully automated activities. The assets and importer were statically checked but have not been tested in a live Foundry v13 world. Back up your world before updating.
