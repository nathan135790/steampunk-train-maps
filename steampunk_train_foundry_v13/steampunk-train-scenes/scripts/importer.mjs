/**
 * v13 native one-click scene importer. It creates ordinary world Scenes that
 * remain editable after import. No third-party Foundry modules are required.
 */
const MODULE_ID = "steampunk-train-scenes";
const SCENES = ["passenger", "sleeper", "dining", "freight", "vault"];
const LABEL = "Steampunk Train Carriages";

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "dismissedImportPrompt", {
    name: "Hide the steampunk train import prompt",
    scope: "world", config: false, type: Boolean, default: false
  });
});

function missingScenes() {
  return SCENES.filter(id => !game.scenes.some(s => s.getFlag(MODULE_ID, "mapId") === id));
}

async function importScenes() {
  if (!game.user?.isGM) {
    ui.notifications.warn("Only a GM can import the steampunk train scenes.");
    return [];
  }
  const missing = missingScenes();
  if (!missing.length) {
    ui.notifications.info("All five steampunk train scenes are already imported.");
    return [];
  }
  const folder = game.folders.find(f => f.type === "Scene" && f.name === LABEL)
    ?? await Folder.create({name: LABEL, type: "Scene", color: "#b37a45"});
  const toCreate = [];
  for (const id of missing) {
    const res = await fetch(`modules/${MODULE_ID}/scenes/${id}.json`, {cache:"no-store"});
    if (!res.ok) throw new Error(`Scene file ${id}.json could not be loaded: HTTP ${res.status}`);
    const data = await res.json();
    delete data._id; // Avoid collisions when importing into an existing world.
    data.folder = folder.id;
    toCreate.push(data);
  }
  // A single bulk operation ensures these are standard editable World Scene documents.
  const created = await Scene.createDocuments(toCreate, {renderSheet: false});
  await game.settings.set(MODULE_ID, "dismissedImportPrompt", true);
  ui.notifications.info(`Imported ${created.length} steampunk train scenes into ${LABEL}.`);
  return created;
}

async function showImportDialog() {
  if (!game.user?.isGM) return;
  const missing = missingScenes();
  if (!missing.length) return ui.notifications.info("All five train scenes are already imported.");
  const agreed = await foundry.applications.api.DialogV2.confirm({
    window: {title: "Import Steampunk Train Scenes?"},
    content: `<p>Add the ${missing.length} missing preconfigured train scenes to this world?</p>
      <p>Includes five maps, exterior walls, functioning doors, locked vault doors, lanterns, a 5-foot grid and optional ambient train audio. Artwork stays inside the installed module.</p>
      <p><small>Scene order: Passenger → Sleeper → Dining → Freight → Vault.</small></p>`,
    yes: {label: `Import ${missing.length} Scene${missing.length === 1 ? "" : "s"}`},
    no: {label: "Not Now"},
    rejectClose: false
  });
  if (agreed) {
    try { return await importScenes(); }
    catch (error) {
      console.error(`[${MODULE_ID}] Scene import failed`, error);
      ui.notifications.error("Train scene import failed; see the console for details.");
    }
  } else {
    await game.settings.set(MODULE_ID, "dismissedImportPrompt", true);
    ui.notifications.info("You can import later: game.modules.get(\"steampunk-train-scenes\").api.showImportDialog()");
  }
}

Hooks.once("ready", async () => {
  // Foundry exposes the API once the module has initialized.
  const module = game.modules.get(MODULE_ID);
  if (module) module.api = {importScenes, showImportDialog, missingScenes};
  if (!game.user?.isGM) return;
  if (await game.settings.get(MODULE_ID,"dismissedImportPrompt")) return;
  if (missingScenes().length) await showImportDialog();
});
