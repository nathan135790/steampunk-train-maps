/**
 * Steampunk Train Carts — Foundry v13 / dnd5e
 * Import-on-demand world content: 15 scenes, 40 NPCs, and (optionally) matching tokens.
 * Never replaces existing scenes or actors, and never duplicates our placed tokens.
 */
const MODULE_ID = "steampunk-train-scenes";
const CARS = ["passenger", "sleeper", "dining", "freight", "vault", "locomotive", "tender",
  "maintenance", "security", "market", "tavern", "botanical", "library", "first-class", "observation"];
const SCENE_FOLDER = "Steampunk Train Carriages";
const ACTOR_FOLDER = "Steampunk Train — NPCs";
let npcIndexCache;

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "dismissedNpcPrompt12", {
    name: "Dismiss the Steampunk Train 1.2 content import prompt",
    scope: "world", config: false, type: Boolean, default: false
  });
});

const isGM = () => Boolean(game.user?.isGM);

async function npcIndex() {
  if (npcIndexCache) return npcIndexCache;
  const response = await fetch(`modules/${MODULE_ID}/actors/index.json`, {cache: "no-store"});
  if (!response.ok) throw new Error(`NPC index unavailable (HTTP ${response.status}).`);
  npcIndexCache = await response.json();
  return npcIndexCache;
}

function missingScenes() {
  return CARS.filter(carId => !game.scenes.some(scene => scene.getFlag(MODULE_ID, "mapId") === carId));
}

function npcForId(npcId) {
  return game.actors.find(actor => actor.getFlag(MODULE_ID, "npcId") === npcId);
}

async function missingActors() {
  return (await npcIndex()).filter(npc => !npcForId(npc.id));
}

async function getOrCreateFolder(name, type, color) {
  return game.folders.find(folder => folder.type === type && folder.name === name)
    ?? Folder.create({name, type, color});
}

async function importScenes() {
  if (!isGM()) throw new Error("Only a GM can import train scenes.");
  const missing = missingScenes();
  if (!missing.length) return [];
  const folder = await getOrCreateFolder(SCENE_FOLDER, "Scene", "#b37a45");
  const toCreate = [];
  for (const carId of missing) {
    const res = await fetch(`modules/${MODULE_ID}/scenes/${carId}.json`, {cache: "no-store"});
    if (!res.ok) throw new Error(`Could not load scene ${carId}.json (HTTP ${res.status}).`);
    const data = await res.json();
    delete data._id; // Existing world scene IDs must never be overwritten.
    data.folder = folder.id;
    toCreate.push(data);
  }
  return Scene.createDocuments(toCreate, {renderSheet: false});
}

async function importActors() {
  if (!isGM()) throw new Error("Only a GM can import train NPCs.");
  if (game.system.id !== "dnd5e") throw new Error("These NPC stat blocks require the D&D 5e system.");
  const missing = await missingActors();
  if (!missing.length) return [];
  const folder = await getOrCreateFolder(ACTOR_FOLDER, "Actor", "#91754c");
  const created = [];
  for (const npc of missing) {
    try {
      const res = await fetch(`modules/${MODULE_ID}/${npc.path}`, {cache: "no-store"});
      if (!res.ok) throw new Error(`Could not load ${npc.path} (HTTP ${res.status}).`);
      const data = await res.json();
      delete data._id;
      data.folder = folder.id;
      // Individual creation allows valid NPCs to import even if one Actor has an issue.
      const actor = await Actor.create(data, {renderSheet: false});
      if (actor) created.push(actor);
    } catch (error) {
      console.error(`[${MODULE_ID}] Failed to import ${npc.name}`, error);
    }
  }
  return created;
}

const POSITIONS = {
  passenger: [[680, 470], [1610, 940], [2200, 470]],
  sleeper: [[610, 445], [1540, 1000], [2200, 450]],
  dining: [[650, 460], [1540, 940], [2300, 960]],
  freight: [[570, 530], [1850, 1060]],
  vault: [[850, 400], [1960, 1070]],
  locomotive: [[980, 490], [1800, 1000], [2300, 410]],
  tender: [[720, 630], [2100, 980], [2330, 460]],
  maintenance: [[720, 610], [1900, 880], [2360, 540]],
  security: [[720, 500], [1750, 470], [2160, 980]],
  market: [[720, 630], [1550, 850], [2240, 650]],
  tavern: [[850, 760], [1730, 950], [2250, 460]],
  botanical: [[850, 420], [1950, 1050]],
  library: [[800, 660], [1580, 980], [2320, 520]],
  "first-class": [[780, 730], [1970, 770]],
  observation: [[950, 730], [2000, 730]]
};

async function populateScenesWithNPCs() {
  if (!isGM()) throw new Error("Only a GM can populate train scenes.");
  const index = await npcIndex();
  let placedCount = 0;
  for (const carId of CARS) {
    const scene = game.scenes.find(s => s.getFlag(MODULE_ID, "mapId") === carId);
    if (!scene) continue;
    const roster = index.filter(npc => npc.carId === carId);
    const coords = POSITIONS[carId] ?? [[750, 700]];
    const docs = [];
    for (let i = 0; i < roster.length; i++) {
      const npc = roster[i];
      const actor = npcForId(npc.id);
      if (!actor) continue;
      if (scene.tokens.some(token => token.getFlag(MODULE_ID, "npcId") === npc.id)) continue;
      const [x, y] = coords[i % coords.length];
      const token = await actor.getTokenDocument({
        x, y, actorLink: false, hidden: false, disposition: 0,
        flags: {[MODULE_ID]: {npcId: npc.id, carId}}
      });
      docs.push(token.toObject());
    }
    if (docs.length) {
      try {
        await scene.createEmbeddedDocuments("Token", docs);
        placedCount += docs.length;
      } catch (error) {
        console.error(`[${MODULE_ID}] Could not add tokens to ${scene.name}`, error);
      }
    }
  }
  return placedCount;
}

async function installMissingContent({addTokens = true} = {}) {
  const scenes = await importScenes();
  const actors = await importActors();
  const tokens = addTokens ? await populateScenesWithNPCs() : 0;
  const remaining = await missingActors();
  const msg = `Train content: ${scenes.length} new scenes, ${actors.length} new NPCs, ${tokens} placed tokens.`;
  if (remaining.length) ui.notifications.warn(`${msg} ${remaining.length} NPCs could not be imported; see F12 console.`);
  else ui.notifications.info(msg);
  return {scenes, actors, tokens, missingActors: remaining};
}

async function showImportDialog() {
  if (!isGM()) return;
  if (game.system.id !== "dnd5e") {
    ui.notifications.warn("Steampunk Train NPCs require the D&D 5e game system.");
    return;
  }
  const scenes = missingScenes();
  const npcs = await missingActors();
  if (!scenes.length && !npcs.length) {
    ui.notifications.info("All Steampunk Train scenes and NPCs are already imported.");
    return;
  }
  const yes = await foundry.applications.api.DialogV2.confirm({
    window: {title: "Update Steampunk Train Carts"},
    content: `<p>Import <strong>${npcs.length} new NPCs</strong> and <strong>${scenes.length} missing scenes</strong>?</p>
      <p>The NPCs go into <em>${ACTOR_FOLDER}</em> in the Actor Directory. Their tokens are placed in their respective train scenes, including scenes already in your world.</p>
      <p><strong>Existing actors, scenes, walls and manually placed tokens will not be replaced or removed.</strong></p>
      <p><small>Review token starting positions in your own scenes after import. Back up your world before updating any module.</small></p>`,
    yes: {label: "Import Missing Scenes + NPCs"},
    no: {label: "Not Now"},
    rejectClose: false
  });
  if (yes) {
    try {
      await installMissingContent({addTokens: true});
      await game.settings.set(MODULE_ID, "dismissedNpcPrompt12", true);
    } catch (error) {
      console.error(`[${MODULE_ID}] Train content import failed`, error);
      ui.notifications.error("Train content import failed. See your browser console (F12). No existing scene was deleted.");
    }
  } else {
    await game.settings.set(MODULE_ID, "dismissedNpcPrompt12", true);
    ui.notifications.info(`You can import later through game.modules.get("${MODULE_ID}").api.showImportDialog()`);
  }
}

Hooks.once("ready", async () => {
  const module = game.modules.get(MODULE_ID);
  if (module) module.api = {importActors, importScenes, populateScenesWithNPCs, installMissingContent, showImportDialog, missingActors, missingScenes};
  if (!isGM()) return;
  try {
    if (!game.settings.get(MODULE_ID, "dismissedNpcPrompt12")) await showImportDialog();
  } catch (error) {
    console.error(`[${MODULE_ID}] Startup error`, error);
  }
});
