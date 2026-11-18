import { cards } from './cards.js';
import { chooseCards, reviewState } from './review.js';

const get = id => document.getElementById(id);
const namespace = 'fieldwork:quick-practice:';
const cardIds = new Set(cards.map(card => card.id));
const api = '/api/records';
const keyPrefix = 'career:practice/';
const storage = localStorage;
const sections = ['start', 'session', 'summary'];
let owner = storage.getItem(namespace + 'owner');
let remote = {};
let currentSession = [];
let index = 0;
let correct = 0;
let graded = false;
let syncInFlight = false;
let syncAgain = false;
let installPrompt;

function storedJson(key, fallback) {
  try {
    return JSON.parse(storage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function validAttempt(attempt) {
  return cardIds.has(attempt?.questionId)
    && typeof attempt.correct === 'boolean'
    && typeof attempt.date === 'string'
    && Number.isFinite(Date.parse(attempt.date));
}

function localAttempts() {
  return Object.keys(storage)
    .filter(key => key.startsWith(namespace + 'attempt:'))
    .map(key => ({ key, entry: storedJson(key, null) }))
    .filter(({ entry }) => validAttempt(entry?.value) && (!entry.owner || entry.owner === owner));
}

function attempts() {
  const combined = { ...remote };
  for (const { entry } of localAttempts()) combined[entry.key] = entry.value;
  return Object.values(combined).filter(validAttempt);
}

function updateCounts() {
  const history = attempts();
  const reviews = reviewState(history);
  const today = new Date().toDateString();
  get('due').textContent = String([...reviews.values()].filter(item => item.due <= Date.now()).length);
  get('today').textContent = String(history.filter(item => new Date(item.date).toDateString() === today).length);
}

function readCachedProgress() {
  remote = owner ? storedJson(namespace + 'remote:' + owner, {}) : {};
  updateCounts();
}

function show(name) {
  for (const section of sections) get(section).hidden = section !== name;
}

async function syncProgress() {
  if (!navigator.onLine) {
    get('sync').textContent = 'Offline · saved on device';
    return;
  }
  if (syncInFlight) {
    syncAgain = true;
    return;
  }
  syncInFlight = true;
  try {
    const response = await fetch(api + '?scope=practice', { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(8000) });
    if (response.status === 401) {
      get('sync').textContent = 'Device progress';
      return;
    }
    if (!response.ok) throw new Error('Progress unavailable');
    const payload = await response.json();
    if (typeof payload.owner !== 'string' || !payload.records) throw new Error('Invalid progress');
    owner = payload.owner;
    storage.setItem(namespace + 'owner', owner);
    remote = payload.records;

    for (const { key, entry } of localAttempts()) {
      if (!entry.owner) storage.setItem(key, JSON.stringify({ ...entry, owner }));
      const saved = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: entry.key, value: entry.value, practiceOwner: owner }),
        signal: AbortSignal.timeout(8000),
        redirect: 'error',
      });
      if (!saved.ok) throw new Error('Sync unavailable');
      remote[entry.key] = entry.value;
      storage.setItem(namespace + 'remote:' + owner, JSON.stringify(remote));
      storage.removeItem(key);
    }

    storage.setItem(namespace + 'remote:' + owner, JSON.stringify(remote));
    get('sync').textContent = 'Progress synced';
  } catch {
    get('sync').textContent = 'Saved on device · sync pending';
  } finally {
    syncInFlight = false;
    updateCounts();
    if (syncAgain) {
      syncAgain = false;
      void syncProgress();
    }
  }
}

function saveAnswer(card, recalled) {
  const id = crypto.randomUUID();
  const value = { questionId: card.id, correct: recalled, date: new Date().toISOString() };
  storage.setItem(namespace + 'attempt:' + id, JSON.stringify({ key: keyPrefix + id, owner, value }));
  if (recalled) correct += 1;
  updateCounts();
  void syncProgress();
}

function begin() {
  const mode = document.querySelector('input[name=mode]:checked').value;
  const length = Number(document.querySelector('input[name=length]:checked').value);
  currentSession = chooseCards(cards, reviewState(attempts()), mode, length, Date.now());
  index = 0;
  correct = 0;
  show('session');
  renderCard();
}

function renderCard() {
  const card = currentSession[index];
  const debug = card.kind === 'debug';
  graded = false;
  get('topic').textContent = card.topic + (debug ? ' · Debugging' : ' · Flashcard');
  get('position').textContent = (index + 1) + ' / ' + currentSession.length;
  get('progress').max = currentSession.length;
  get('progress').value = index;
  get('prompt').textContent = debug ? card.title : card.prompt;
  get('scenario').hidden = !debug;
  get('scenario').textContent = debug ? card.prompt : '';
  get('answer').hidden = true;
  get('rating').hidden = true;
  get('reveal').hidden = debug;
  get('next').hidden = true;
  get('choices').replaceChildren();

  if (debug) card.choices.forEach((text, i) => {
    const button = document.createElement('button');
    button.className = 'choice';
    const letter = document.createElement('span');
    letter.textContent = String.fromCharCode(65 + i);
    letter.setAttribute('aria-hidden', 'true');
    button.append(letter, document.createTextNode(text));
    button.addEventListener('click', () => selectChoice(i));
    get('choices').append(button);
  });
  get('prompt').focus({ preventScroll: true });
}

function reveal(title, explanation) {
  get('answer-title').textContent = title;
  get('answer-copy').textContent = explanation;
  get('answer').hidden = false;
}

function selectChoice(choice) {
  if (graded) return;
  graded = true;
  const card = currentSession[index];
  const recalled = choice === card.correct;
  Array.from(get('choices').children).forEach((button, i) => {
    button.disabled = true;
    if (i === card.correct) button.classList.add('is-correct');
    else if (i === choice) button.classList.add('is-wrong');
  });
  reveal(recalled ? 'Correct' : 'Best answer · ' + card.choices[card.correct], card.explanation);
  saveAnswer(card, recalled);
  get('progress').value = index + 1;
  get('next').hidden = false;
  get('next').focus();
}

function rate(recalled) {
  if (graded) return;
  graded = true;
  saveAnswer(currentSession[index], recalled);
  advance();
}

function advance() {
  index += 1;
  if (index < currentSession.length) renderCard();
  else {
    show('summary');
    get('summary-copy').textContent = correct + ' of ' + currentSession.length + ' recalled or answered correctly. Missed cards come up sooner in future practice.';
    get('summary-heading').focus();
  }
}

get('begin').addEventListener('click', begin);
get('reveal').addEventListener('click', () => {
  const card = currentSession[index];
  get('reveal').hidden = true;
  reveal(card.answer, card.explanation);
  get('rating').hidden = false;
  get('again').focus();
});
get('again').addEventListener('click', () => rate(false));
get('knew').addEventListener('click', () => rate(true));
get('next').addEventListener('click', advance);
for (const id of ['exit', 'restart']) get(id).addEventListener('click', () => {
  show('start');
  updateCounts();
  get('begin').focus();
});

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  get('install').hidden = false;
});
get('install').addEventListener('click', async () => {
  if (!installPrompt) return;
  await installPrompt.prompt();
  installPrompt = null;
  get('install').hidden = true;
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/practice/sw.js', { scope: '/practice/' })
    .then(() => navigator.serviceWorker.ready)
    .then(() => { get('offline').textContent = 'Questions are ready for offline practice.'; })
    .catch(() => { get('offline').textContent = 'Offline setup is unavailable in this browser.'; });
}

window.addEventListener('online', () => void syncProgress());
window.addEventListener('offline', () => { get('sync').textContent = 'Offline · saved on device'; });
window.addEventListener('focus', () => void syncProgress());
readCachedProgress();
void syncProgress();
