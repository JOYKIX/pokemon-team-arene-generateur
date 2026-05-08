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
}

async function handleTypeChange() {
  if (!typeSelect.value) {
    setStatus("Choisis un type pour générer une équipe.");
    return;
  }

  hideStatus();
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

    await Promise.all(team.map(async slot => {
      slot.moveset = await buildMoveset(slot.pokemon, slot.level);
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

  await Promise.all(leveledTeam.map(async slot => {
    slot.moveset = await buildMoveset(slot.pokemon, slot.level);
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
      const maxReasonableBST = 250 + maxLevel * 6;
      if (bst > maxReasonableBST) continue;
    }

    team.push(selected);
    usedPokemon.add(selected.pokemon.name);
    usedFamilies.add(selected.species.name);
    usedTypeCombos.add(typeCombo);
  }

  const sorted = uniqueByPokemon(team).slice(0, count);
  const finalized = sorted.map((slot, i) => ({ ...slot, level: levels[i] ?? maxLevel }));

  await Promise.all(finalized.map(async slot => {
    slot.moveset = await buildMoveset(slot.pokemon, slot.level);
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

async function buildMoveset(pokemon, maxLevel) {
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

  const moves = [];

  for (const move of learned) {
    if (moves.includes(move.name)) continue;
    const detail = await getMove(move.name).catch(() => null);
    if (!detail) continue;
    if (detail.power === null && detail.damage_class?.name === "status") continue;
    moves.push(move.name);
    if (moves.length === 4) break;
  }

  return moves;
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
  return species.is_legendary || species.is_mythical;
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

function renderTeams(allTeams, type) {
  results.innerHTML = "";

  allTeams.forEach(({ rule, team }) => {
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

  return `
    <div class="poke-card">
      ${sprite ? `<img src="${sprite}" alt="${getDisplayName(pokemon)}" />` : ""}
      <div class="poke-name">${getDisplayName(pokemon)}</div>
      <div class="poke-level">Niv. ${slot.level}</div>
      <div class="types">${types}</div>
      <small>Talent : ${abilityLabel}</small>
      <ul class="moveset">${moves || "<li>Aucun move valide</li>"}</ul>
      <small title="${slot.evolutionMethod}">
        ${slot.evolutionMethod} · dispo niv. ${slot.evolutionMinLevel}
      </small>
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
