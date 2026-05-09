const API = "https://pokeapi.co/api/v2";

const frenchTypes = {
  normal: "Normal",
  fire: "Feu",
  water: "Eau",
  electric: "Électrik",
  grass: "Plante",
  ice: "Glace",
  fighting: "Combat",
  poison: "Poison",
  ground: "Sol",
  flying: "Vol",
  psychic: "Psy",
  bug: "Insecte",
  rock: "Roche",
  ghost: "Spectre",
  dragon: "Dragon",
  dark: "Ténèbres",
  steel: "Acier",
  fairy: "Fée"
};


const typeEffectiveness = {
  normal:{rock:0.5,ghost:0,steel:0.5}, fire:{fire:0.5,water:0.5,grass:2,ice:2,bug:2,rock:0.5,dragon:0.5,steel:2},
  water:{fire:2,water:0.5,grass:0.5,ground:2,rock:2,dragon:0.5}, electric:{water:2,electric:0.5,grass:0.5,ground:0,flying:2,dragon:0.5},
  grass:{fire:0.5,water:2,grass:0.5,poison:0.5,ground:2,flying:0.5,bug:0.5,rock:2,dragon:0.5,steel:0.5}, ice:{fire:0.5,water:0.5,grass:2,ground:2,flying:2,dragon:2,steel:0.5,ice:0.5},
  fighting:{normal:2,ice:2,poison:0.5,flying:0.5,psychic:0.5,bug:0.5,rock:2,ghost:0,dark:2,steel:2,fairy:0.5}, poison:{grass:2,poison:0.5,ground:0.5,rock:0.5,ghost:0.5,steel:0,fairy:2},
  ground:{fire:2,electric:2,grass:0.5,poison:2,flying:0,bug:0.5,rock:2,steel:2}, flying:{electric:0.5,grass:2,fighting:2,bug:2,rock:0.5,steel:0.5},
  psychic:{fighting:2,poison:2,psychic:0.5,dark:0,steel:0.5}, bug:{fire:0.5,grass:2,fighting:0.5,poison:0.5,flying:0.5,psychic:2,ghost:0.5,dark:2,steel:0.5,fairy:0.5},
  rock:{fire:2,ice:2,fighting:0.5,ground:0.5,flying:2,bug:2,steel:0.5}, ghost:{normal:0,psychic:2,ghost:2,dark:0.5},
  dragon:{dragon:2,steel:0.5,fairy:0}, dark:{fighting:0.5,psychic:2,ghost:2,dark:0.5,fairy:0.5}, steel:{fire:0.5,water:0.5,electric:0.5,ice:2,rock:2,steel:0.5,fairy:2}, fairy:{fire:0.5,fighting:2,poison:0.5,dragon:2,dark:2,steel:0.5}
};


const gymTypeThemes = {
  normal: { accent: "#d3bf84", accent2: "#b6a06f", bg: "#18140f", bg2: "#241d16", glow: "rgba(211, 191, 132, 0.34)" },
  fire: { accent: "#ff8d5c", accent2: "#ff4f3a", bg: "#1e0b08", bg2: "#35120d", glow: "rgba(255, 93, 48, 0.35)" },
  water: { accent: "#6ed8ff", accent2: "#3f87ff", bg: "#081423", bg2: "#102c43", glow: "rgba(94, 182, 255, 0.36)" },
  electric: { accent: "#ffe36b", accent2: "#ffbf3f", bg: "#1a1402", bg2: "#2a2005", glow: "rgba(255, 214, 87, 0.38)" },
  grass: { accent: "#8be183", accent2: "#43c16f", bg: "#09180f", bg2: "#102a1a", glow: "rgba(102, 229, 132, 0.35)" },
  ice: { accent: "#9bf6ff", accent2: "#65d9ff", bg: "#071922", bg2: "#0f2a33", glow: "rgba(148, 244, 255, 0.38)" },
  fighting: { accent: "#ff9b84", accent2: "#e25748", bg: "#210c0c", bg2: "#3a1613", glow: "rgba(255, 135, 107, 0.35)" },
  poison: { accent: "#c38cff", accent2: "#9b57e8", bg: "#170a23", bg2: "#2a123d", glow: "rgba(187, 124, 255, 0.34)" },
  ground: { accent: "#dcb774", accent2: "#be8a4f", bg: "#191109", bg2: "#2a1b0d", glow: "rgba(230, 188, 116, 0.36)" },
  flying: { accent: "#b8c2ff", accent2: "#8da5ff", bg: "#0b1020", bg2: "#151f3a", glow: "rgba(170, 186, 255, 0.35)" },
  psychic: { accent: "#ff99d7", accent2: "#ff619e", bg: "#220b17", bg2: "#3a1526", glow: "rgba(255, 139, 198, 0.34)" },
  bug: { accent: "#b7df57", accent2: "#80b144", bg: "#121905", bg2: "#202d0c", glow: "rgba(176, 225, 91, 0.35)" },
  rock: { accent: "#c8b697", accent2: "#a88a6f", bg: "#17120e", bg2: "#282019", glow: "rgba(205, 180, 149, 0.33)" },
  ghost: { accent: "#a495ff", accent2: "#7266d9", bg: "#110d24", bg2: "#20193d", glow: "rgba(148, 130, 255, 0.35)" },
  dragon: { accent: "#8da8ff", accent2: "#5d63ff", bg: "#0a1030", bg2: "#151f4a", glow: "rgba(114, 142, 255, 0.36)" },
  dark: { accent: "#b0a49a", accent2: "#726863", bg: "#0c0b0d", bg2: "#1b191f", glow: "rgba(188, 176, 166, 0.28)" },
  steel: { accent: "#b9d7df", accent2: "#89abb8", bg: "#0a1418", bg2: "#14242e", glow: "rgba(163, 207, 223, 0.33)" },
  fairy: { accent: "#ffc2ec", accent2: "#ff8fd3", bg: "#210d1f", bg2: "#391833", glow: "rgba(255, 172, 227, 0.35)" }
};

const defaultTheme = {
  accent: "#8ee8ff",
  accent2: "#ff8bd1",
  bg: "#090511",
  bg2: "#120b1f",
  glow: "rgba(142, 232, 255, 0.28)"
};

const defaultRules = [
  { arena: 1, badges: 0, count: 2, min: 10, max: 12 },
  { arena: 2, badges: 1, count: 2, min: 16, max: 18 },
  { arena: 3, badges: 2, count: 3, min: 23, max: 24 },
  { arena: 4, badges: 3, count: 3, min: 30, max: 31 },
  { arena: 5, badges: 4, count: 4, min: 36, max: 38 },
  { arena: 6, badges: 5, count: 5, min: 41, max: 46 },
  { arena: 7, badges: 6, count: 5, min: 52, max: 54 },
  { arena: 8, badges: 7, count: 6, min: 62, max: 62 }
];

const evolutionMethodMinimums = {
  baby_or_base: 1,
  level_up_no_min_level: 18,
  happiness: 22,
  affection: 22,
  beauty: 24,
  held_item_level: 28,
  use_item: 30,
  special: 32,
  trade: 34,
  held_item_trade: 34,
  unknown: 30
};

const gen9ParadoxPokemon = new Set([
  "great-tusk","scream-tail","brute-bonnet","flutter-mane","slither-wing","sandy-shocks","roaring-moon",
  "iron-treads","iron-bundle","iron-hands","iron-jugulis","iron-moth","iron-thorns","iron-valiant",
  "walking-wake","iron-leaves","gouging-fire","raging-bolt","iron-boulder","iron-crown"
]);

const typeSelect = document.querySelector("#gymType");
const modeSelect = document.querySelector("#mode");
const finalTeamInputs = document.querySelector("#finalTeamInputs");
const rulesBody = document.querySelector("#rulesBody");
const generateBtn = document.querySelector("#generateBtn");
const defaultRulesBtn = document.querySelector("#defaultRulesBtn");
const resetBtn = document.querySelector("#resetBtn");
const results = document.querySelector("#results");
const statusBox = document.querySelector("#status");
const suggestions = document.querySelector("#pokemonSuggestions");
const finalFormState = new Map();

let pokemonCache = new Map();
let speciesCache = new Map();
let evolutionCache = new Map();
let moveCache = new Map();
let moveFrenchCache = new Map();
let abilityFrenchCache = new Map();
let typePools = new Map();
let frenchNameMap = new Map();
let englishToFrench = new Map();
let allPokemonPool = null;

init();

function init() {
  renderTypes();
  renderFinalTeamInputs();
  renderRules(defaultRules);
  bindEvents();
  applySiteTheme("");
  loadGlobalAutocomplete();
}

function bindEvents() {
  defaultRulesBtn.addEventListener("click", () => renderRules(defaultRules));
  resetBtn.addEventListener("click", resetAll);
  generateBtn.addEventListener("click", generateTeams);
  typeSelect.addEventListener("change", handleTypeChange);
  finalTeamInputs.addEventListener("input", handleFinalTeamInputEvent);
  finalTeamInputs.addEventListener("change", handleFinalTeamInputEvent);
}

function renderTypes() {
  Object.entries(frenchTypes).forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    typeSelect.appendChild(option);
  });
}

function renderFinalTeamInputs() {
  finalTeamInputs.innerHTML = "";

  for (let i = 1; i <= 6; i++) {
    const label = document.createElement("label");
    label.className = "final-slot";
    label.innerHTML = `
      Pokémon ${i}
      <div class="final-slot-fields">
        <input class="final-pokemon" data-slot="${i}" list="pokemonSuggestions" placeholder="Ex : Gardevoir" autocomplete="off" />
        <select class="final-form hidden" data-slot="${i}">
          <option value="">Forme auto</option>
        </select>
      </div>
    `;
    finalTeamInputs.appendChild(label);
  }
}

function renderRules(rules) {
  rulesBody.innerHTML = "";

  rules.forEach(rule => {
    const row = document.createElement("div");
    row.className = "rule-row";
    row.dataset.arena = rule.arena;

    row.innerHTML = `
      <strong>Arène ${rule.arena}</strong>
      <span>${rule.badges} badge${rule.badges > 1 ? "s" : ""}</span>
      <input class="rule-count" type="number" min="1" max="6" value="${rule.count}" />
      <input class="rule-min" type="number" min="1" max="100" value="${rule.min}" />
      <input class="rule-max" type="number" min="1" max="100" value="${rule.max}" />
    `;

    rulesBody.appendChild(row);
  });
}

function resetAll() {
  typeSelect.value = "";
  modeSelect.value = "balanced";
  document.querySelectorAll(".final-pokemon").forEach(input => input.value = "");
  document.querySelectorAll(".final-form").forEach(select => {
    select.classList.add("hidden");
    select.innerHTML = '<option value="">Forme auto</option>';
  });
  finalFormState.clear();
  renderRules(defaultRules);
  results.innerHTML = "";
  suggestions.innerHTML = "";
  hideStatus();
  applySiteTheme("");
}

async function handleTypeChange() {
  applySiteTheme(typeSelect.value);

  if (!typeSelect.value) {
    setStatus("Choisis un type pour générer une équipe.");
    return;
  }

  hideStatus();
}

function applySiteTheme(type) {
  const theme = gymTypeThemes[type] || defaultTheme;
  const root = document.documentElement;

  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--accent-2", theme.accent2);
  root.style.setProperty("--bg", theme.bg);
  root.style.setProperty("--bg-2", theme.bg2);
  root.style.setProperty("--type-glow", theme.glow);

  document.body.dataset.gymType = type || "default";
}

async function loadGlobalAutocomplete() {
  setStatus("Chargement de l’autocomplétion de tous les Pokémon...");

  try {
    const pool = await getAllPokemon();
    await hydrateFrenchNames(pool);
    renderAutocomplete(pool);
    setStatus("Autocomplétion globale chargée.", "success");
  } catch (error) {
    console.error(error);
    setStatus("Erreur pendant le chargement de l’autocomplétion.", "error");
  }
}

function readRules() {
  return [...document.querySelectorAll(".rule-row")].map(row => {
    const arena = Number(row.dataset.arena);
    const count = clamp(Number(row.querySelector(".rule-count").value), 1, 6);
    const minInput = clamp(Number(row.querySelector(".rule-min").value), 1, 100);
    const maxInput = clamp(Number(row.querySelector(".rule-max").value), 1, 100);

    return {
      arena,
      badges: arena - 1,
      count,
      min: Math.min(minInput, maxInput),
      max: Math.max(minInput, maxInput)
    };
  });
}

function readFinalTeamSelections() {
  return [...document.querySelectorAll(".final-pokemon")]
    .map(input => {
      const rawName = input.value.trim();
      const slot = input.dataset.slot;
      const selectedForm = finalFormState.get(slot)?.selected || "";

      return {
        rawName,
        forcedForm: selectedForm || ""
      };
    })
    .filter(entry => entry.rawName);
}

async function generateTeams() {
  results.innerHTML = "";

  const type = typeSelect.value;
  const mode = modeSelect.value;
  const rules = readRules();
  const finalSelections = readFinalTeamSelections();

  if (!type) {
    setStatus("Choisis d’abord le type de l’arène.", "error");
    return;
  }

  setStatus("Génération en cours...");

  try {
    const pool = await getPokemonByType(type);
    await hydrateFrenchNames(pool.slice(0, 700));

    const finalRule = rules.find(rule => rule.arena === 8) || rules[rules.length - 1];

    let finalTeam;

    if (finalSelections.length > 0) {
      finalTeam = await resolveFinalTeam(finalSelections, type);
    } else {
      finalTeam = await buildRandomTeam({
        type,
        count: finalRule.count,
        maxLevel: finalRule.max,
        mode
      });
    }

    if (finalTeam.length === 0) {
      setStatus("Aucun Pokémon valide trouvé.", "error");
      return;
    }

    const allTeams = [];

    for (const rule of rules) {
      const team = await buildTeamForRule({
        type,
        rule,
        finalTeam,
        mode
      });

      allTeams.push({ rule, team });
    }

    renderTeams(allTeams, type);
    setStatus("Teams générées. Arène 8 = team finale exacte.", "success");
  } catch (error) {
    console.error(error);
    setStatus(error.message || "Erreur pendant la génération.", "error");
  }
}

async function resolveFinalTeam(selections, type) {
  const team = [];

  for (const selection of selections.slice(0, 6)) {
    const pokemon = await resolvePokemonForGymType(selection, type);

    if (!hasType(pokemon, type)) {
      throw new Error(`${getDisplayName(pokemon)} n’a pas le type ${frenchTypes[type]}.`);
    }

    const species = await getSpecies(pokemon.species.url);

    if (isBannedSpecies(species)) {
      throw new Error(`${getDisplayName(pokemon)} est légendaire, fabuleux ou interdit.`);
    }

    const evoData = await getEvolutionData(species.evolution_chain.url);
    const evoInfo = getEvolutionInfoForPokemon(evoData, pokemon.name);

    const ability = pickBestAbility(pokemon);
    const moveset = await buildMoveset(pokemon, 62);
    team.push({
      pokemon,
      species,
      evoData,
      evolutionMinLevel: evoInfo.minimumLevel,
      evolutionMethod: evoInfo.methodLabel,
      ability,
      abilityFr: await getFrenchAbilityName(ability),
      moveset,
      movesetFr: await getFrenchMoveset(moveset)
    });
  }

  return team;
}

async function resolvePokemonForGymType(selection, type) {
  const apiName = normalizePokemonName(selection.rawName);
  const forcedApiName = selection.forcedForm || "";
  const initialPokemon = await getPokemon(forcedApiName || apiName);

  if (forcedApiName) {
    if (!hasType(initialPokemon, type)) {
      throw new Error(`${getDisplayName(initialPokemon)} n’a pas le type ${frenchTypes[type]}.`);
    }
    return initialPokemon;
  }

  if (hasType(initialPokemon, type)) return initialPokemon;

  const candidates = await findRegionalCandidates(apiName);
  const typedCandidate = candidates.find(candidate => hasType(candidate, type));

  if (typedCandidate) return typedCandidate;

  return initialPokemon;
}

async function handleFinalTeamInputEvent(event) {
  const input = event.target.closest(".final-pokemon");
  const select = event.target.closest(".final-form");

  if (select) {
    const slot = select.dataset.slot;
    const state = finalFormState.get(slot) || {};
    state.selected = select.value;
    finalFormState.set(slot, state);
    return;
  }

  if (!input) return;

  const slot = input.dataset.slot;
  const state = finalFormState.get(slot) || {};
  clearTimeout(state.timer);

  state.timer = setTimeout(() => syncFormSelectorForInput(input), 280);
  finalFormState.set(slot, state);
}

async function syncFormSelectorForInput(input) {
  const slot = input.dataset.slot;
  const select = finalTeamInputs.querySelector(`.final-form[data-slot="${slot}"]`);
  if (!select) return;

  const rawName = input.value.trim();
  if (!rawName) {
    select.classList.add("hidden");
    select.innerHTML = '<option value="">Forme auto</option>';
    finalFormState.set(slot, { selected: "" });
    return;
  }

  try {
    const baseApiName = normalizePokemonName(rawName);
    const basePokemon = await getPokemon(baseApiName);
    const species = await getSpecies(basePokemon.species.url);
    const formOptions = await getFormOptionsFromSpecies(species);

    if (formOptions.length <= 1) {
      select.classList.add("hidden");
      select.innerHTML = '<option value="">Forme auto</option>';
      finalFormState.set(slot, { selected: "" });
      return;
    }

    const previous = finalFormState.get(slot)?.selected || "";
    select.innerHTML = formOptions
      .map(option => `<option value="${option.value}">${option.label}</option>`)
      .join("");

    const defaultValue = formOptions.some(opt => opt.value === basePokemon.name)
      ? basePokemon.name
      : formOptions[0].value;

    select.value = formOptions.some(opt => opt.value === previous) ? previous : defaultValue;
    select.classList.remove("hidden");
    finalFormState.set(slot, { selected: select.value });
  } catch {
    select.classList.add("hidden");
    select.innerHTML = '<option value="">Forme auto</option>';
    finalFormState.set(slot, { selected: "" });
  }
}

async function getFormOptionsFromSpecies(species) {
  const options = [];

  for (const variety of species.varieties || []) {
    const apiName = variety.pokemon.name;
    await hydrateFrenchNames([{ pokemon: { name: apiName, url: variety.pokemon.url } }]);
    options.push({
      value: apiName,
      label: englishToFrench.get(apiName) || cleanName(apiName)
    });
  }

  return options;
}

async function findRegionalCandidates(apiName) {
  const pool = await getAllPokemon();
  const seen = new Set();
  const candidates = [];

  const baseName = apiName.split("-")[0];
  const possibleNames = new Set([apiName, baseName]);

  pool.forEach(item => {
    const name = item.pokemon.name;
    if (name === apiName || name.startsWith(`${baseName}-`)) {
      possibleNames.add(name);
    }
  });

  for (const name of possibleNames) {
    if (seen.has(name)) continue;
    seen.add(name);

    const pokemon = await getPokemon(name).catch(() => null);
    if (!pokemon) continue;
    candidates.push(pokemon);
  }

  return candidates;
}

async function buildTeamForRule({ type, rule, finalTeam, mode }) {
  const levels = makeLevelSpread(rule.count, rule.min, rule.max);

  if (rule.arena === 8) {
    let team = finalTeam.slice(0, rule.count).map((slot, index) => ({
      ...slot,
      level: levels[index] ?? rule.max,
      ability: slot.ability || pickBestAbility(slot.pokemon),
      moveset: slot.moveset || []
    }));

    if (team.length < rule.count) {
      const extraLevels = levels.slice(team.length, rule.count);
      const extra = await buildRandomTeam({
        type,
        count: rule.count - team.length,
        maxLevel: rule.max,
        mode,
        already: team,
        levels: extraLevels
      });

      team = [...team, ...extra];
    }

    team = team.slice(0, rule.count).sort((a, b) => a.level - b.level);

    const coverageTargets = getTeamWeaknessTargets(team.map(slot => slot.pokemon.types.map(t => t.type.name)));
    const teamProfile = evaluateTeamSynergy(team);
    await Promise.all(team.map(async slot => {
      slot.teamProfile = teamProfile;
      slot.moveset = await buildMoveset(slot.pokemon, slot.level, coverageTargets);
      slot.movesetFr = await getFrenchMoveset(slot.moveset);
      slot.abilityFr = await getFrenchAbilityName(slot.ability || pickBestAbility(slot.pokemon));
    }));

    return team;
  }

  const candidates = [];

  for (let idx = 0; idx < Math.min(finalTeam.length, rule.count); idx++) {
    const finalSlot = finalTeam[idx];
    const slotLevel = levels[idx] ?? rule.max;
    const family = getFamilyFromEvolutionData(finalSlot.evoData);
    const possibleForms = [];

    for (const member of family) {
      const pokemon = await getPokemon(member.name).catch(() => null);
      if (!pokemon) continue;
      if (!hasType(pokemon, type)) continue;

      const species = await getSpecies(pokemon.species.url);
      if (isBannedSpecies(species)) continue;

      const evoInfo = getEvolutionInfoForPokemon(finalSlot.evoData, pokemon.name);
      if (evoInfo.minimumLevel > slotLevel) continue;

      possibleForms.push({
        pokemon,
        species,
        evoData: finalSlot.evoData,
        evolutionMinLevel: evoInfo.minimumLevel,
        evolutionMethod: evoInfo.methodLabel,
        ability: pickBestAbility(pokemon),
        moveset: [],
        level: slotLevel
      });
    }

    const selected = selectHighestPossibleEvolution(possibleForms, slotLevel);
    if (selected) candidates.push(selected);
  }

  let team = uniqueByPokemon(candidates);

  if (team.length < rule.count) {
    const extraLevels = levels.slice(team.length, rule.count);
    const extra = await buildRandomTeam({
      type,
      count: rule.count - team.length,
      maxLevel: rule.max,
      mode,
      already: team,
      levels: extraLevels
    });

    team = [...team, ...extra];
  }

  team = uniqueByPokemon(team).slice(0, rule.count);

  const leveledTeam = team.map((slot, index) => ({
    ...slot,
    level: slot.level ?? levels[index] ?? rule.max,
    ability: slot.ability || pickBestAbility(slot.pokemon),
    moveset: slot.moveset || []
  })).sort((a, b) => a.level - b.level);

  const coverageTargets = getTeamWeaknessTargets(leveledTeam.map(slot => slot.pokemon.types.map(t => t.type.name)));
  const teamProfile = evaluateTeamSynergy(leveledTeam);
  await Promise.all(leveledTeam.map(async slot => {
    slot.teamProfile = teamProfile;
    slot.moveset = await buildMoveset(slot.pokemon, slot.level, coverageTargets);
    slot.movesetFr = await getFrenchMoveset(slot.moveset);
    slot.abilityFr = await getFrenchAbilityName(slot.ability || pickBestAbility(slot.pokemon));
  }));

  return leveledTeam;
}

async function buildRandomTeam({ type, count, maxLevel, mode, already = [], levels = [] }) {
  const pool = await getPokemonByType(type);
  const shuffled = shuffle([...pool]);
  const usedFamilies = new Set(already.map(slot => slot.species.name));
  const usedTypeCombos = new Set(already.map(slot => getTypeComboKey(slot.pokemon)));
  const usedPokemon = new Set(already.map(slot => slot.pokemon.name));
  const team = [];

  for (const item of shuffled) {
    if (team.length >= count) break;

    const apiName = item.pokemon.name;
    if (usedPokemon.has(apiName)) continue;

    const pokemon = await getPokemon(apiName).catch(() => null);
    if (!pokemon) continue;
    if (!hasType(pokemon, type)) continue;

    const species = await getSpecies(pokemon.species.url);
    if (isBannedSpecies(species)) continue;
    if (usedFamilies.has(species.name)) continue;

    const evoData = await getEvolutionData(species.evolution_chain.url);
    const family = getFamilyFromEvolutionData(evoData);
    const familyForms = [];

    for (const member of family) {
      const familyPokemon = await getPokemon(member.name).catch(() => null);
      if (!familyPokemon) continue;
      if (!hasType(familyPokemon, type)) continue;

      const familySpecies = await getSpecies(familyPokemon.species.url);
      if (isBannedSpecies(familySpecies)) continue;

      const evoInfo = getEvolutionInfoForPokemon(evoData, familyPokemon.name);
      if (evoInfo.minimumLevel > maxLevel) continue;

      familyForms.push({
        pokemon: familyPokemon,
        species: familySpecies,
        evoData,
        evolutionMinLevel: evoInfo.minimumLevel,
        evolutionMethod: evoInfo.methodLabel,
        ability: pickBestAbility(familyPokemon),
        moveset: []
      });
    }

    const targetLevel = levels[team.length] ?? maxLevel;
    const selected = selectHighestPossibleEvolution(familyForms, targetLevel);
    if (!selected) continue;

    if (usedPokemon.has(selected.pokemon.name)) continue;
    if (usedFamilies.has(selected.species.name)) continue;

    const typeCombo = getTypeComboKey(selected.pokemon);
    if (mode === "random" && usedTypeCombos.has(typeCombo)) continue;

    if (mode === "balanced") {
      const bst = scorePokemon(selected.pokemon);
      const targetBST = 220 + targetLevel * 5.5;
      const tolerance = 85;
      if (Math.abs(bst - targetBST) > tolerance) continue;
    }

    team.push(selected);
    usedPokemon.add(selected.pokemon.name);
    usedFamilies.add(selected.species.name);
    usedTypeCombos.add(typeCombo);
  }

  const sorted = uniqueByPokemon(team).slice(0, count);
  const finalized = sorted.map((slot, i) => ({ ...slot, level: levels[i] ?? maxLevel }));

  const coverageTargets = getTeamWeaknessTargets(finalized.map(slot => slot.pokemon.types.map(t => t.type.name)));
  const teamProfile = evaluateTeamSynergy(finalized);
  await Promise.all(finalized.map(async slot => {
    slot.teamProfile = teamProfile;
    slot.moveset = await buildMoveset(slot.pokemon, slot.level, coverageTargets);
    slot.movesetFr = await getFrenchMoveset(slot.moveset);
    slot.abilityFr = await getFrenchAbilityName(slot.ability || pickBestAbility(slot.pokemon));
  }));

  return finalized;
}


function getTypeComboKey(pokemon) {
  return pokemon.types.map(t => t.type.name).sort().join("/");
}

function pickBestAbility(pokemon) {
  const preferred = pokemon.abilities
    .filter(a => !a.is_hidden)
    .sort((a, b) => a.slot - b.slot)[0] || pokemon.abilities[0];
  return preferred?.ability?.name || "unknown";
}

async function buildMoveset(pokemon, maxLevel, coverageTargets = []) {
  const learned = pokemon.moves
    .map(move => {
      const levelDetail = move.version_group_details
        .filter(d => d.move_learn_method.name === "level-up")
        .sort((a, b) => b.level_learned_at - a.level_learned_at)[0];
      return levelDetail ? { name: move.move.name, level: levelDetail.level_learned_at } : null;
    })
    .filter(Boolean)
    .filter(move => move.level <= maxLevel)
    .sort((a, b) => b.level - a.level);

  const moveDetails = [];
  for (const move of learned) {
    if (moveDetails.some(entry => entry.name === move.name)) continue;
    const detail = await getMove(move.name).catch(() => null);
    if (!detail) continue;
    moveDetails.push({ name: move.name, level: move.level, detail, score: scoreMoveForPokemon(pokemon, detail, move.level, coverageTargets) });
  }

  const picked = [];
  const perClass = new Map();

  moveDetails.sort((a, b) => b.score - a.score).forEach(move => {
    if (picked.length >= 4) return;
    const moveClass = move.detail.damage_class?.name || "status";
    const isStatus = moveClass === "status";
    if (picked.some(entry => entry.name === move.name)) return;
    if (move.detail.power === null && !isStatus) return;
    if (isStatus && picked.filter(entry => (entry.detail.damage_class?.name || "status") === "status").length >= 1) return;
    if (!isStatus && (perClass.get(moveClass) || 0) >= 2) return;

    picked.push(move);
    perClass.set(moveClass, (perClass.get(moveClass) || 0) + 1);
  });

  return picked.map(move => move.name);
}

function scoreMoveForPokemon(pokemon, moveDetail, learnedAtLevel, coverageTargets = []) {
  const moveClass = moveDetail.damage_class?.name || "status";
  const isStatus = moveClass === "status";
  if (isStatus) return 55 + learnedAtLevel * 0.4;

  const power = moveDetail.power || 0;
  const accuracy = moveDetail.accuracy ?? 100;
  const pp = moveDetail.pp || 10;
  const isStab = pokemon.types.some(slot => slot.type.name === moveDetail.type?.name);
  const classAttack = getAttackStat(pokemon, moveClass);

  const coverageBonus = coverageTargets.includes(moveDetail.type?.name) ? 32 : 0;
  const statBias = (moveClass === "special" ? getAttackStat(pokemon,"special") : getAttackStat(pokemon,"physical"));
  return power + (isStab ? 28 : 0) + coverageBonus + accuracy * 0.35 + Math.min(pp, 20) * 0.6 + classAttack * 0.15 + learnedAtLevel * 0.35 + statBias * 0.05;
}

function getAttackStat(pokemon, moveClass) {
  const statName = moveClass === "special" ? "special-attack" : "attack";
  return pokemon.stats.find(stat => stat.stat.name === statName)?.base_stat || 0;
}

async function getFrenchAbilityName(name) {
  if (abilityFrenchCache.has(name)) return abilityFrenchCache.get(name);
  const data = await fetchJson(`${API}/ability/${name}`);
  const fr = data.names?.find(n => n.language.name === "fr")?.name || cleanName(name);
  abilityFrenchCache.set(name, fr);
  return fr;
}

async function getFrenchMoveset(moves) {
  const translated = await Promise.all(moves.map(move => getFrenchMoveName(move)));
  return translated;
}

async function getFrenchMoveName(name) {
  if (moveFrenchCache.has(name)) return moveFrenchCache.get(name);
  const data = await getMove(name);
  const fr = data.names?.find(n => n.language.name === "fr")?.name || cleanName(name);
  moveFrenchCache.set(name, fr);
  return fr;
}

async function getMove(name) {
  if (moveCache.has(name)) return moveCache.get(name);
  const data = await fetchJson(`${API}/move/${name}`);
  moveCache.set(name, data);
  return data;
}

function selectHighestPossibleEvolution(forms, maxLevel) {
  const valid = forms.filter(form => form.evolutionMinLevel <= maxLevel);

  if (valid.length === 0) return null;

  valid.sort((a, b) => {
    if (a.evolutionMinLevel !== b.evolutionMinLevel) {
      return b.evolutionMinLevel - a.evolutionMinLevel;
    }

    return scorePokemon(b.pokemon) - scorePokemon(a.pokemon);
  });

  return valid[0];
}

function sortTeamByPower(team, mode) {
  const sorted = [...team];

  if (mode === "random") return shuffle(sorted);

  sorted.sort((a, b) => {
    const levelDiff = a.evolutionMinLevel - b.evolutionMinLevel;
    if (levelDiff !== 0) return levelDiff;

    return scorePokemon(a.pokemon) - scorePokemon(b.pokemon);
  });

  if (mode === "strong") sorted.reverse();

  return sorted;
}

function getEvolutionInfoForPokemon(evoData, targetName) {
  let result = null;

  function walk(node, currentMinimumLevel, methodLabel) {
    if (node.species.name === targetName) {
      result = {
        minimumLevel: currentMinimumLevel,
        methodLabel
      };
      return;
    }

    for (const child of node.evolves_to) {
      const details = child.evolution_details || [];
      const detail = details[0] || {};
      const nextInfo = getMinimumFromEvolutionDetail(detail, currentMinimumLevel);

      walk(
        child,
        Math.max(currentMinimumLevel, nextInfo.minimumLevel),
        nextInfo.methodLabel
      );
    }
  }

  walk(evoData.chain, evolutionMethodMinimums.baby_or_base, "Base");

  return result || {
    minimumLevel: 1,
    methodLabel: "Base"
  };
}

function getMinimumFromEvolutionDetail(detail, previousMinimum) {
  if (!detail || Object.keys(detail).length === 0) {
    return {
      minimumLevel: Math.max(previousMinimum, evolutionMethodMinimums.unknown),
      methodLabel: "Évolution spéciale"
    };
  }

  const trigger = detail.trigger?.name || "unknown";

  if (trigger === "level-up") {
    if (detail.min_level) {
      return {
        minimumLevel: detail.min_level,
        methodLabel: `Évolution niveau ${detail.min_level}`
      };
    }

    if (detail.min_happiness) {
      return {
        minimumLevel: evolutionMethodMinimums.happiness,
        methodLabel: "Évolution par bonheur"
      };
    }

    if (detail.min_affection) {
      return {
        minimumLevel: evolutionMethodMinimums.affection,
        methodLabel: "Évolution par affection"
      };
    }

    if (detail.min_beauty) {
      return {
        minimumLevel: evolutionMethodMinimums.beauty,
        methodLabel: "Évolution par beauté"
      };
    }

    if (detail.held_item) {
      return {
        minimumLevel: evolutionMethodMinimums.held_item_level,
        methodLabel: "Évolution avec objet tenu"
      };
    }

    if (
      detail.known_move ||
      detail.known_move_type ||
      detail.location ||
      detail.party_species ||
      detail.party_type ||
      detail.relative_physical_stats !== null ||
      detail.time_of_day ||
      detail.turn_upside_down
    ) {
      return {
        minimumLevel: evolutionMethodMinimums.special,
        methodLabel: "Évolution spéciale"
      };
    }

    return {
      minimumLevel: evolutionMethodMinimums.level_up_no_min_level,
      methodLabel: "Évolution par niveau spéciale"
    };
  }

  if (trigger === "use-item") {
    return {
      minimumLevel: evolutionMethodMinimums.use_item,
      methodLabel: `Évolution par ${detail.item?.name || "pierre / objet"}`
    };
  }

  if (trigger === "trade") {
    if (detail.held_item) {
      return {
        minimumLevel: evolutionMethodMinimums.held_item_trade,
        methodLabel: "Évolution par échange avec objet"
      };
    }

    return {
      minimumLevel: evolutionMethodMinimums.trade,
      methodLabel: "Évolution par échange"
    };
  }

  if (trigger === "shed") {
    return {
      minimumLevel: 20,
      methodLabel: "Évolution spéciale"
    };
  }

  return {
    minimumLevel: evolutionMethodMinimums.unknown,
    methodLabel: "Évolution spéciale"
  };
}

function makeLevelSpread(count, min, max) {
  if (count <= 1) return [max];

  const levels = [];

  for (let i = 0; i < count; i++) {
    const ratio = i / (count - 1);
    levels.push(Math.round(min + (max - min) * ratio));
  }

  levels[0] = min;
  levels[levels.length - 1] = max;

  return levels;
}

async function getPokemonByType(type) {
  if (typePools.has(type)) return typePools.get(type);

  const data = await fetchJson(`${API}/type/${type}`);

  const pool = data.pokemon
    .filter(entry => {
      const id = getIdFromUrl(entry.pokemon.url);
      return id <= 1025;
    })
    .sort((a, b) => getIdFromUrl(a.pokemon.url) - getIdFromUrl(b.pokemon.url));

  typePools.set(type, pool);
  return pool;
}

async function getAllPokemon() {
  if (allPokemonPool) return allPokemonPool;

  const data = await fetchJson(`${API}/pokemon?limit=1025&offset=0`);

  allPokemonPool = data.results
    .map(pokemon => ({ pokemon }))
    .sort((a, b) => getIdFromUrl(a.pokemon.url) - getIdFromUrl(b.pokemon.url));

  return allPokemonPool;
}

async function hydrateFrenchNames(pool) {
  const jobs = pool.map(async item => {
    const apiName = item.pokemon.name;
    if (englishToFrench.has(apiName)) return;

    try {
      const pokemon = await getPokemon(apiName);
      const species = await getSpecies(pokemon.species.url);

      const baseFrName = getFrenchSpeciesName(species) || cleanName(species.name);
      const formLabel = getRegionalOrFormLabel(apiName, species.name);
      const frName = formLabel ? `${baseFrName} (${formLabel})` : baseFrName;

      englishToFrench.set(apiName, frName);
      frenchNameMap.set(normalizeKey(frName), apiName);
      frenchNameMap.set(normalizeKey(apiName), apiName);
      frenchNameMap.set(normalizeKey(cleanName(apiName)), apiName);

      const regionalAlias = makeRegionalAlias(baseFrName, formLabel);
      if (regionalAlias) {
        frenchNameMap.set(normalizeKey(regionalAlias), apiName);
      }
    } catch {}
  });

  await Promise.allSettled(jobs);
}

function renderAutocomplete(pool) {
  suggestions.innerHTML = "";

  const added = new Set();

  pool.forEach(item => {
    const apiName = item.pokemon.name;
    const frName = englishToFrench.get(apiName) || cleanName(apiName);

    if (added.has(frName)) return;
    added.add(frName);

    const option = document.createElement("option");
    option.value = frName;
    suggestions.appendChild(option);
  });
}

async function getPokemon(nameOrId) {
  const key = String(nameOrId).toLowerCase();

  if (pokemonCache.has(key)) return pokemonCache.get(key);

  const data = await fetchJson(`${API}/pokemon/${key}`);

  pokemonCache.set(key, data);
  pokemonCache.set(data.name, data);

  return data;
}

async function getSpecies(url) {
  if (speciesCache.has(url)) return speciesCache.get(url);

  const data = await fetchJson(url);
  speciesCache.set(url, data);

  return data;
}

async function getEvolutionData(url) {
  if (evolutionCache.has(url)) return evolutionCache.get(url);

  const data = await fetchJson(url);
  evolutionCache.set(url, data);

  return data;
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les données PokéAPI.");
  }

  return response.json();
}

function hasType(pokemon, type) {
  return pokemon.types.some(slot => slot.type.name === type);
}

function isBannedSpecies(species) {
  return species.is_legendary || species.is_mythical || isParadoxPokemon(species.name);
}

function isParadoxPokemon(apiName) {
  return gen9ParadoxPokemon.has(apiName);
}

function getFamilyFromEvolutionData(evoData) {
  const list = [];

  function walk(node) {
    list.push({ name: node.species.name });
    node.evolves_to.forEach(child => walk(child));
  }

  walk(evoData.chain);
  return list;
}

function getFrenchSpeciesName(species) {
  const fr = species.names.find(name => name.language.name === "fr");
  return fr?.name || null;
}

function getRegionalOrFormLabel(apiName, speciesName) {
  if (apiName === speciesName) return "";

  const suffix = apiName.replace(`${speciesName}-`, "");

  const labels = {
    alola: "Alola",
    galar: "Galar",
    hisui: "Hisui",
    paldea: "Paldea",
    paldean: "Paldea",
    galarian: "Galar",
    alolan: "Alola",
    hisuian: "Hisui",
    mega: "Méga",
    "mega-x": "Méga X",
    "mega-y": "Méga Y",
    gmax: "Gigamax",
    origin: "Originel",
    altered: "Alternative",
    attack: "Attaque",
    defense: "Défense",
    speed: "Vitesse",
    therian: "Totémique",
    incarnate: "Avatar",
    plant: "Plante",
    sandy: "Sable",
    trash: "Déchet",
    east: "Est",
    west: "Ouest",
    heat: "Chaleur",
    wash: "Lavage",
    frost: "Froid",
    fan: "Hélice",
    mow: "Tonte",
    sky: "Céleste",
    land: "Terrestre",
    black: "Noir",
    white: "Blanc",
    resolute: "Décidé",
    ordinary: "Ordinaire",
    pirouette: "Pirouette",
    blade: "Assaut",
    shield: "Parade",
    small: "Petit",
    large: "Grand",
    super: "Ultra",
    average: "Moyen",
    baile: "Flamenco",
    "pom-pom": "Pom-Pom",
    pau: "Hula",
    sensu: "Buyō",
    dusk: "Crépuscule",
    midday: "Diurne",
    midnight: "Nocturne",
    school: "Banc",
    solo: "Solo",
    red: "Rouge",
    blue: "Bleu",
    yellow: "Jaune",
    orange: "Orange",
    "low-key": "Grave",
    amped: "Aiguë",
    "shadow-rider": "Cavalier d’Effroi",
    "ice-rider": "Cavalier du Froid",
    bloodmoon: "Lune Vermeille",
    "family-of-three": "Famille de Trois",
    "family-of-four": "Famille de Quatre",
    droopy: "Affalé",
    stretchy: "Étiré",
    curly: "Bouclé",
    artisan: "Artisanale",
    masterpiece: "Chef-d’œuvre",
    combat: "Combat",
    blaze: "Flamboyante",
    aqua: "Aquatique"
  };

  return labels[suffix] || cleanName(suffix);
}

function makeRegionalAlias(baseFrName, formLabel) {
  if (!formLabel) return "";

  const normalizedForm = normalizeKey(formLabel);

  if (["alola", "galar", "hisui", "paldea"].includes(normalizedForm)) {
    return `${baseFrName} de ${formLabel}`;
  }

  return "";
}

function normalizePokemonName(input) {
  const key = normalizeKey(input);

  if (frenchNameMap.has(key)) return frenchNameMap.get(key);

  const raw = String(input).trim();
  const regionalMatch = raw.match(/^(.+?)\s*\((.+?)\)$/);
  const deRegionalMatch = raw.match(/^(.+?)\s+d[eu]\s+(.+)$/i);

  if (regionalMatch || deRegionalMatch) {
    const match = regionalMatch || deRegionalMatch;
    const namePart = normalizeKey(match[1]);
    const formPart = normalizeKey(match[2]);

    for (const [label, apiName] of frenchNameMap.entries()) {
      if (label.includes(namePart) && label.includes(formPart)) {
        return apiName;
      }
    }
  }

  return key
    .replaceAll(" ", "-")
    .replaceAll("’", "-")
    .replaceAll("'", "-")
    .replaceAll(".", "")
    .toLowerCase();
}

function normalizeKey(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[♀]/g, "-f")
    .replace(/[♂]/g, "-m")
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getDisplayName(pokemon) {
  return englishToFrench.get(pokemon.name) || cleanName(pokemon.name);
}

function cleanName(name) {
  return name
    .split("-")
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function scorePokemon(pokemon) {
  return pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
}

function uniqueByPokemon(team) {
  const seen = new Set();
  const output = [];

  for (const slot of team) {
    if (seen.has(slot.pokemon.name)) continue;
    seen.add(slot.pokemon.name);
    output.push(slot);
  }

  return output;
}


function calcBattleStat(base, iv = 31, ev = 252, level = 50, hp = false) {
  if (hp) return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
  return Math.floor((Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5));
}

function getStatSpread(pokemon, level, teamProfile = null) {
  const base = Object.fromEntries(pokemon.stats.map(s => [s.stat.name, s.base_stat]));
  const roleProfile = determinePokemonRole(pokemon, teamProfile);
  const ivs = { hp: 31, attack: 31, defense: 31, spAttack: 31, spDefense: 31, speed: 31 };
  const evs = buildEvSpread(base, roleProfile);

  return {
    role: roleProfile.label,
    ivs,
    evs,
    hp: calcBattleStat(base.hp || 1, ivs.hp, evs.hp, level, true),
    attack: calcBattleStat(base.attack || 1, ivs.attack, evs.attack, level),
    defense: calcBattleStat(base.defense || 1, ivs.defense, evs.defense, level),
    spAttack: calcBattleStat(base['special-attack'] || 1, ivs.spAttack, evs.spAttack, level),
    spDefense: calcBattleStat(base['special-defense'] || 1, ivs.spDefense, evs.spDefense, level),
    speed: calcBattleStat(base.speed || 1, ivs.speed, evs.speed, level)
  };
}



function determinePokemonRole(pokemon, teamProfile = null) {
  const base = Object.fromEntries(pokemon.stats.map(s => [s.stat.name, s.base_stat]));
  const offense = Math.max(base.attack || 0, base["special-attack"] || 0);
  const bulk = (base.hp || 0) + (base.defense || 0) + (base["special-defense"] || 0);
  const speed = base.speed || 0;
  const specialBias = (base["special-attack"] || 0) - (base.attack || 0);

  const needsSpeedControl = Boolean(teamProfile?.weaknessPressure >= 4);

  if (speed >= 105 && offense >= 100) {
    return { style: specialBias >= 8 ? "special" : "physical", plan: "sweeper", label: specialBias >= 8 ? "Sweeper Spécial" : "Sweeper Physique" };
  }

  if (bulk >= 260 && offense < 115) {
    if ((base["special-defense"] || 0) >= (base.defense || 0)) {
      return { style: "mixed", plan: "special-wall", label: "Mur Spécial" };
    }
    return { style: "mixed", plan: "physical-wall", label: "Mur Physique" };
  }

  if (needsSpeedControl && speed >= 85) {
    return { style: specialBias >= 0 ? "special" : "physical", plan: "revenge", label: "Revenge Killer" };
  }

  return {
    style: specialBias >= 0 ? "special" : "physical",
    plan: "breaker",
    label: specialBias >= 0 ? "Breaker Spécial" : "Breaker Physique"
  };
}

function buildEvSpread(base, roleProfile) {
  const evs = { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 };

  if (roleProfile.plan === "sweeper" || roleProfile.plan === "revenge") {
    evs.speed = 252;
    if (roleProfile.style === "special") evs.spAttack = 252;
    else evs.attack = 252;
    evs.hp = 6;
    return evs;
  }

  if (roleProfile.plan === "physical-wall") {
    evs.hp = 252;
    evs.defense = 252;
    evs.spDefense = 6;
    return evs;
  }

  if (roleProfile.plan === "special-wall") {
    evs.hp = 252;
    evs.spDefense = 252;
    evs.defense = 6;
    return evs;
  }

  if (roleProfile.style === "special") {
    evs.spAttack = 252;
  } else {
    evs.attack = 252;
  }

  if ((base.speed || 0) >= 80) {
    evs.speed = 252;
    evs.hp = 6;
  } else {
    evs.hp = 252;
    evs.spDefense = 252 - (evs.attack || evs.spAttack);
    if (evs.spDefense < 0) evs.spDefense = 6;
    evs.defense = 6;
  }

  return rebalanceEvs(evs);
}

function rebalanceEvs(evs) {
  const statOrder = ["hp", "attack", "defense", "spAttack", "spDefense", "speed"];
  statOrder.forEach(stat => {
    evs[stat] = clamp(Math.round((evs[stat] || 0) / 2) * 2, 0, 252);
  });

  let total = Object.values(evs).reduce((sum, value) => sum + value, 0);
  if (total <= 510) return evs;

  for (const stat of statOrder.reverse()) {
    if (total <= 510) break;
    const remove = Math.min(evs[stat], total - 510);
    evs[stat] -= remove;
    total -= remove;
  }

  return evs;
}

function evaluateTeamSynergy(team) {
  const uniqueCombos = new Set(team.map(slot => getTypeComboKey(slot.pokemon))).size;
  const weaknesses = getTeamWeaknessTargets(team.map(slot => slot.pokemon.types.map(t => t.type.name)));
  const weaknessPressure = weaknesses.length;
  const avgBst = team.reduce((sum, slot) => sum + scorePokemon(slot.pokemon), 0) / Math.max(1, team.length);

  return {
    uniqueCombos,
    weaknessPressure,
    avgBst: Math.round(avgBst),
    score: uniqueCombos * 22 + (12 - Math.min(12, weaknessPressure)) * 8 + avgBst * 0.12
  };
}

function getTeamWeaknessTargets(teamTypes) {
  const weak = new Set();
  teamTypes.forEach(defTypes => {
    Object.keys(frenchTypes).forEach(atkType => {
      let mult = 1;
      defTypes.forEach(dt => { mult *= (typeEffectiveness[atkType]?.[dt] ?? 1); });
      if (mult > 1) weak.add(atkType);
    });
  });
  return [...weak];
}

function renderTeams(allTeams, type) {
  results.innerHTML = "";

  allTeams.forEach(({ rule, team }) => {
    const teamTotalBst = team.reduce((sum, slot) => sum + scorePokemon(slot.pokemon), 0);
    const card = document.createElement("article");
    card.className = "team-card";

    card.innerHTML = `
      <div class="team-header">
        <div>
          <h3>Arène ${rule.arena}</h3>
          <span>${rule.badges} badge${rule.badges > 1 ? "s" : ""} · ${rule.count} Pokémon · Niv. ${rule.min}-${rule.max}</span>
        </div>
        <strong>${frenchTypes[type]}</strong>
      </div>

      <div class="pokemon-grid">
        ${team.map(slot => renderPokemonCard(slot)).join("")}
      </div>

      <div class="notes">
        ${
          team.length < rule.count
            ? `<p class="warning">Attention : pas assez de Pokémon valides trouvés pour cette règle.</p>`
            : ""
        }
        <p>Le Pokémon le plus faible est niveau ${rule.min}, le plus fort est niveau ${rule.max}.</p>
        <p>BST total de l’équipe : ${teamTotalBst}</p>
        <p>Synergie : ${evaluateTeamSynergy(team).score.toFixed(1)} · Couvertures de types uniques ${evaluateTeamSynergy(team).uniqueCombos} · Pression faiblesses ${evaluateTeamSynergy(team).weaknessPressure}</p>
      </div>
    `;

    results.appendChild(card);
  });
}

function renderPokemonCard(slot) {
  const pokemon = slot.pokemon;

  const sprite =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default ||
    "";

  const types = pokemon.types
    .map(entry => `<span class="type-pill">${frenchTypes[entry.type.name] || entry.type.name}</span>`)
    .join("");

  const abilityLabel = slot.abilityFr || cleanName(slot.ability || pickBestAbility(pokemon));
  const moves = (slot.movesetFr || slot.moveset || []).map(move => `<li>${move}</li>`).join("");
  const bst = scorePokemon(pokemon);
  const teamProfile = slot.teamProfile || null;
  const statSpread = getStatSpread(pokemon, slot.level, teamProfile);

  const totalEvs = Object.values(statSpread.evs).reduce((sum, value) => sum + value, 0);

  return `
    <div class="poke-card">
      <div class="poke-top">
        ${sprite ? `<img src="${sprite}" alt="${getDisplayName(pokemon)}" />` : ""}
        <div>
          <div class="poke-name">${getDisplayName(pokemon)}</div>
          <div class="poke-level">Niv. ${slot.level}</div>
          <div class="types">${types}</div>
        </div>
      </div>
      <div class="meta-row"><span class="k">BST</span><span class="v">${bst}</span></div>
      <div class="meta-row"><span class="k">Talent</span><span class="v">${abilityLabel}</span></div>
      <div class="meta-row"><span class="k">Rôle</span><span class="v">${statSpread.role}</span></div>
      <div class="stat-row"><span class="k">Stats finales</span><span class="v">PV ${statSpread.hp} · Atk ${statSpread.attack} · Def ${statSpread.defense} · Atk Spé ${statSpread.spAttack} · Def Spé ${statSpread.spDefense} · Vit ${statSpread.speed}</span></div>
      <div class="split-row"><span class="k">IV (max 31)</span><span class="v">PV ${statSpread.ivs.hp} / Atk ${statSpread.ivs.attack} / Def ${statSpread.ivs.defense} / Atk Spé ${statSpread.ivs.spAttack} / Def Spé ${statSpread.ivs.spDefense} / Vit ${statSpread.ivs.speed}</span></div>
      <div class="split-row"><span class="k">EV (max 252/stat)</span><span class="v">PV ${statSpread.evs.hp} / Atk ${statSpread.evs.attack} / Def ${statSpread.evs.defense} / Atk Spé ${statSpread.evs.spAttack} / Def Spé ${statSpread.evs.spDefense} / Vit ${statSpread.evs.speed} · Total ${totalEvs}/510</span></div>
      <ul class="moveset">${moves || "<li>Aucun move valide</li>"}</ul>
      <div class="meta-row" title="${slot.evolutionMethod}"><span class="k">Évolution</span><span class="v">${slot.evolutionMethod} · dispo niv. ${slot.evolutionMinLevel}</span></div>
    </div>
  `;
}

function getIdFromUrl(url) {
  return Number(url.split("/").filter(Boolean).pop());
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function shuffle(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(item => item.value);
}

function setStatus(message, type = "") {
  statusBox.textContent = message;
  statusBox.className = `status ${type}`.trim();
}

function hideStatus() {
  statusBox.className = "status hidden";
  statusBox.textContent = "";
}
