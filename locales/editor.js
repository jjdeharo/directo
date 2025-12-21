const BASE_LANG = 'es';
const rowsContainer = document.getElementById('rows');
const rowTemplate = document.getElementById('row-template');
const appSelect = document.getElementById('app-select');
const languageSelect = document.getElementById('language-select');
const searchInput = document.getElementById('search-input');
const missingOnly = document.getElementById('missing-only');
const changedOnly = document.getElementById('changed-only');
const statsEl = document.getElementById('stats');
const footerStatus = document.getElementById('footer-status');
const reloadButton = document.getElementById('reload-button');
const downloadButton = document.getElementById('download-button');
const copyButton = document.getElementById('copy-button');

const cloneDeep = typeof structuredClone === 'function'
  ? structuredClone
  : (value) => JSON.parse(JSON.stringify(value));

const state = {
  apps: [],
  languages: [],
  app: null,
  base: null,
  target: null,
  rows: [],
  basePaths: new Set(),
  extraPaths: [],
};

function segmentsKey(segments) {
  return segments.map((seg) => `/${seg}`).join('');
}

function displayKey(segments) {
  return segments
    .map((seg) => (typeof seg === 'number' ? `[${seg}]` : seg))
    .reduce((acc, part) => {
      if (part.startsWith('[')) return `${acc}${part}`;
      return acc ? `${acc}.${part}` : part;
    }, '');
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function walkBase(baseNode, targetNode, segments = []) {
  if (Array.isArray(baseNode)) {
    baseNode.forEach((item, index) => {
      walkBase(item, targetNode ? targetNode[index] : undefined, [...segments, index]);
    });
    return;
  }

  if (isObject(baseNode)) {
    Object.keys(baseNode).forEach((key) => {
      walkBase(baseNode[key], targetNode ? targetNode[key] : undefined, [...segments, key]);
    });
    return;
  }

  const key = displayKey(segments);
  const targetValue = targetNode ?? '';
  const row = {
    key,
    segments,
    baseValue: baseNode ?? '',
    targetValue,
    element: null,
    input: null,
  };
  state.rows.push(row);
  state.basePaths.add(segmentsKey(segments));
}

function walkExtra(targetNode, baseNode, segments = []) {
  if (Array.isArray(targetNode)) {
    targetNode.forEach((item, index) => {
      walkExtra(item, baseNode ? baseNode[index] : undefined, [...segments, index]);
    });
    return;
  }

  if (isObject(targetNode)) {
    Object.keys(targetNode).forEach((key) => {
      walkExtra(targetNode[key], baseNode ? baseNode[key] : undefined, [...segments, key]);
    });
    return;
  }

  const key = segmentsKey(segments);
  if (!state.basePaths.has(key)) {
    state.extraPaths.push(segments);
  }
}

function buildRows() {
  rowsContainer.innerHTML = '';
  state.rows.forEach((row) => {
    const fragment = rowTemplate.content.cloneNode(true);
    const rowEl = fragment.querySelector('.row');
    const keyEl = fragment.querySelector('.key');
    const baseEl = fragment.querySelector('.base');
    const inputEl = fragment.querySelector('textarea');

    keyEl.textContent = row.key;
    baseEl.textContent = row.baseValue;
    inputEl.value = row.targetValue;

    rowEl.dataset.key = row.key.toLowerCase();
    rowEl.dataset.base = String(row.baseValue).toLowerCase();
    rowEl.dataset.target = String(row.targetValue).toLowerCase();

    inputEl.addEventListener('input', () => {
      row.targetValue = inputEl.value;
      rowEl.dataset.target = row.targetValue.toLowerCase();
      updateRowState(row, rowEl);
      updateStats();
      applyFilters();
    });

    row.element = rowEl;
    row.input = inputEl;
    updateRowState(row, rowEl);

    rowsContainer.appendChild(fragment);
  });
}

function updateRowState(row, rowEl) {
  const isMissing = String(row.targetValue).trim() === '';
  const isChanged = row.targetValue !== row.baseValue;
  rowEl.classList.toggle('is-missing', isMissing);
  rowEl.classList.toggle('is-changed', isChanged);
}

function updateStats() {
  const missingCount = state.rows.filter((row) => String(row.targetValue).trim() === '').length;
  const changedCount = state.rows.filter((row) => row.targetValue !== row.baseValue).length;
  const total = state.rows.length;
  const extras = state.extraPaths.length;

  statsEl.textContent = `Claves: ${total} · Vacías: ${missingCount} · Diferentes: ${changedCount} · Extras: ${extras}`;
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const onlyMissing = missingOnly.checked;
  const onlySame = changedOnly.checked;

  state.rows.forEach((row) => {
    const rowEl = row.element;
    const isEditing = document.activeElement === row.input;
    const matchesSearch =
      !query ||
      rowEl.dataset.key.includes(query) ||
      rowEl.dataset.base.includes(query) ||
      rowEl.dataset.target.includes(query);
    const matchesMissing = !onlyMissing || String(row.targetValue).trim() === '';
    const matchesSame = !onlySame || row.targetValue === row.baseValue;

    rowEl.style.display = matchesSearch && (matchesMissing || isEditing) && (matchesSame || isEditing)
      ? ''
      : 'none';
  });
}

function buildOutput() {
  const output = cloneDeep(state.target || {});

  state.rows.forEach((row) => {
    let cursor = output;
    const lastIndex = row.segments.length - 1;
    row.segments.forEach((seg, idx) => {
      if (idx === lastIndex) {
        cursor[seg] = row.targetValue;
        return;
      }

      const nextSeg = row.segments[idx + 1];
      if (cursor[seg] === undefined) {
        cursor[seg] = typeof nextSeg === 'number' ? [] : {};
      }
      cursor = cursor[seg];
    });
  });

  return output;
}

async function loadApps() {
  const response = await fetch('./apps.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('No se pudo cargar /locales/apps.json');
  }
  return response.json();
}

async function loadLanguages() {
  const response = await fetch('./index.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('No se pudo cargar /locales/index.json');
  }
  return response.json();
}

async function loadTranslations(appId, lang) {
  const baseResp = await fetch(`./${appId}/${BASE_LANG}.json`, { cache: 'no-store' });
  if (!baseResp.ok) throw new Error('No se pudo cargar la base en español.');
  const base = await baseResp.json();

  let target = {};
  const targetResp = await fetch(`./${appId}/${lang}.json`, { cache: 'no-store' });
  if (targetResp.ok) {
    target = await targetResp.json();
  }

  return { base, target };
}

function rebuildRows(base, target) {
  state.rows = [];
  state.basePaths = new Set();
  state.extraPaths = [];

  walkBase(base, target);
  walkExtra(target, base);

  buildRows();
  updateStats();
  applyFilters();
}

async function refresh() {
  const appId = appSelect.value;
  const lang = languageSelect.value;

  if (!appId || !lang) return;
  footerStatus.textContent = 'Cargando traducciones...';

  const { base, target } = await loadTranslations(appId, lang);
  state.app = appId;
  state.base = base;
  state.target = target;

  rebuildRows(base, target);
  footerStatus.textContent = `Editando: ${appId} · ${lang}`;
}

function downloadJson(jsonText) {
  const blob = new Blob([jsonText], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${appSelect.value}-${languageSelect.value}.json`;
  link.click();
  URL.revokeObjectURL(url);
  footerStatus.textContent = 'Descarga iniciada.';
}

async function copyJson() {
  const jsonText = `${JSON.stringify(buildOutput(), null, 2)}\n`;
  await navigator.clipboard.writeText(jsonText);
  footerStatus.textContent = 'JSON copiado al portapapeles.';
}

function attachEvents() {
  searchInput.addEventListener('input', applyFilters);
  missingOnly.addEventListener('change', applyFilters);
  changedOnly.addEventListener('change', applyFilters);
  reloadButton.addEventListener('click', refresh);
  downloadButton.addEventListener('click', () => downloadJson(`${JSON.stringify(buildOutput(), null, 2)}\n`));
  copyButton.addEventListener('click', copyJson);
  languageSelect.addEventListener('change', refresh);
  appSelect.addEventListener('change', refresh);
}

function showError(error) {
  console.error(error);
  statsEl.textContent = 'Error al cargar las traducciones.';
  footerStatus.textContent = error.message || 'No se pudo iniciar el editor.';
}

async function init() {
  attachEvents();
  const [apps, languages] = await Promise.all([loadApps(), loadLanguages()]);
  state.apps = apps;
  state.languages = languages;

  appSelect.innerHTML = '';
  apps.forEach((app) => {
    const option = document.createElement('option');
    option.value = app.id;
    option.textContent = app.name;
    appSelect.appendChild(option);
  });

  languageSelect.innerHTML = '';
  languages.forEach((lang) => {
    const option = document.createElement('option');
    option.value = lang.code;
    option.textContent = `${lang.name} (${lang.code})`;
    languageSelect.appendChild(option);
  });

  appSelect.value = apps[0]?.id || '';
  const defaultLang = languages.find((lang) => lang.code !== BASE_LANG)?.code || BASE_LANG;
  languageSelect.value = defaultLang;

  await refresh();
}

init().catch(showError);
