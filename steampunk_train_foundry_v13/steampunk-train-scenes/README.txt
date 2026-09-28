STEAMPUNK TRAIN: FIVE READY-TO-PLAY SCENES | FOUNDRY VTT v13
=================================================================
INCLUDED MAPS (ALL 3-ROW / TWO-AISLE WIDE VERSIONS)
 - Economy Passenger Car
 - Economy Sleeper Car
 - Economy Dining Car
 - Freight and Storage Car
 - Armored Vault Car

RECOMMENDED: ONE-CLICK MODULE INSTALL (LOCAL / SELF-HOSTED FOUNDRY)
1. Shut down Foundry.
2. From inside this ZIP, extract the folder named "steampunk-train-scenes"
   (the one CONTAINING module.json) to:
      <Foundry User Data>/Data/modules/steampunk-train-scenes/
   So module.json is at:
      <Foundry User Data>/Data/modules/steampunk-train-scenes/module.json
   See https://foundryvtt.com/article/modules/ for help locating User Data.
3. Start Foundry v13, enter your D&D world as the GM, and enable
   "Steampunk Train: Five Ready-to-Play Scenes" under Manage Modules.
4. At the confirmation dialog, click "Import 5 Scenes".
   The regular Scene sidebar will gain a folder named "Steampunk Train Carriages".
   The scenes are normal, editable world scenes; they are NOT locked module content.

TO IMPORT LATER OR ADD MISSING SCENES
As GM, open the browser developer console (F12) and run:
  game.modules.get("steampunk-train-scenes").api.showImportDialog()
You can also call .api.importScenes() to bypass the dialog.
It avoids duplicating scenes that still have this module's identifying flags.

INDIVIDUAL JSON IMPORT (IF YOU PREFER NOT TO USE THE ONE-CLICK DIALOG)
The five files in steampunk-train-scenes/scenes/*.json are Foundry v13 Scene data.
The MODULE STILL MUST BE INSTALLED for the backgrounds and audio paths to exist.
Create an empty Scene in the Scenes sidebar, right-click the Scene, Import Data,
and select the desired .json file. Import five times for five scenes.

IMPORTANT
- Do NOT delete or disable this module while using its scenes; background and
  ambience file paths live inside the module's maps/ and audio/ directories.
  Disabling the importer should not normally hide static assets, but leaving
  the module installed is safest.
- Each scene uses a 3000x1500 WebP background, 100px/5ft square grid,
  two east/west door locations, perimeter walls, and native ambient lights.
- The vault's gangway doors and four island gates are LOCKED (GM can unlock).
- Freight and dining include walk-blocking central cargo/booth edges. Other
  decorative furniture is part of the artwork, not an invisible wall.
- Set the Grid's opacity to 0 if you want gridless art while retaining token
  snapping. The supplied grid is intentionally faint.
- The ambient train sound is synthetic and optional; mute/delete the Sound
  layer object if you would rather supply music or your own rail ambience.
- Automatic teleporting between scenes is NOT included. Scene Navigation is
  enabled and the GM can move the party to the next car manually or use
  Foundry's built-in Region Teleport Token behavior to link scenes.
- Original native-size PNG artwork is included in the ZIP's originals/ folder.

THE BUNDLED SCENES WERE BUILT AGAINST FOUNDRY v13'S PUBLIC SCENE DATA FORMAT.
They have been structurally validated but not interactively tested in your
particular Foundry installation or game system. The first imported scene
should be checked before running a live session (especially wall alignment).

IMAGE ORDER IF YOU ARRANGE THE CARS AS A TRAIN
  Passenger -> Sleeper -> Dining -> Freight -> Vault

To update wall placement after import: open the Walls layer and drag wall
endpoints to match your preference. Safe doors can be unlocked via their
context menu while on the Walls layer.
