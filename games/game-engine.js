/**
 * SILNIK GRY - obsługuje wszystkie 6 minigier.
 *
 * Zasady punktacji (ustalone przez Ciebie):
 * - każda minigra: max 150 pkt, min 50 pkt
 * - start: 150 pkt
 * - błąd (zgłoszony przez konkretną minigrę): -20 pkt
 * - każde 2 sekundy wykonywania zadania: -1 pkt
 *
 * Każda minigra definiowana jest w games-data.js jako obiekt:
 * { name: "Nazwa gry", render(container, api) { ... } }
 *
 * "api" przekazywane do każdej minigry:
 * - api.registerError()        -> zgłasza pełny błąd (-20 pkt)
 * - api.applyPenalty(points)   -> odejmuje dowolną, niestandardową liczbę punktów (np. "pół błędu" = 10 pkt)
 * - api.completeGame(score?)   -> kończy minigrę i przechodzi do następnej; opcjonalny "score" wymusza konkretny wynik (np. 50 pkt przy pominięciu gry)
 * - api.getElapsedSeconds()    -> ile sekund trwa aktualna minigra (gdyby gra chciała np. limit czasu)
 */

const GAME_CONFIG = {
  maxScore: 150,
  minScore: 50,
  errorPenalty: 20,
  secondsPerPenaltyPoint: 2,
};

const state = {
  currentIndex: 0,
  scores: [],
  penalty: 0,
  startTime: 0,
  timerInterval: null,
};

const els = {};

function initGameEngine(games) {
  els.count = document.getElementById("game-count");
  els.name = document.getElementById("game-name");
  els.timerValue = document.getElementById("timer-value");
  els.container = document.getElementById("game-container");

  window.__GAMES__ = games;
  loadGame(0);
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function startTimer() {
  state.startTime = Date.now();
  updateTimerDisplay();
  state.timerInterval = setInterval(updateTimerDisplay, 250);
}

function stopTimer() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
}

function updateTimerDisplay() {
  els.timerValue.textContent = formatTime(getElapsedSeconds());
}

function getElapsedSeconds() {
  return (Date.now() - state.startTime) / 1000;
}

function computeScore(penaltyPoints, elapsedSeconds) {
  const raw =
    GAME_CONFIG.maxScore -
    penaltyPoints -
    Math.floor(elapsedSeconds / GAME_CONFIG.secondsPerPenaltyPoint);
  return Math.max(GAME_CONFIG.minScore, Math.min(GAME_CONFIG.maxScore, raw));
}

function loadGame(index) {
  state.currentIndex = index;
  state.penalty = 0;

  const games = window.__GAMES__;
  const game = games[index];

  els.count.textContent = `Minigra ${index + 1}/${games.length}`;
  els.name.textContent = game.name;
  els.container.innerHTML = "";

  startTimer();

  const api = {
    registerError() {
      state.penalty += GAME_CONFIG.errorPenalty;
    },
    applyPenalty(points) {
      state.penalty += points;
    },
    getPenalty() {
      return state.penalty;
    },
    getElapsedSeconds,
    isLastGame() {
      return index === games.length - 1;
    },
    completeGame(overrideScore) {
      finishCurrentGame(overrideScore);
    },
  };

  game.render(els.container, api);
}

function finishCurrentGame(overrideScore) {
  stopTimer();

  let score;
  if (typeof overrideScore === "number") {
    score = Math.max(GAME_CONFIG.minScore, Math.min(GAME_CONFIG.maxScore, overrideScore));
  } else {
    const elapsed = getElapsedSeconds();
    score = computeScore(state.penalty, elapsed);
  }

  state.scores.push(score);

  const games = window.__GAMES__;
  const next = state.currentIndex + 1;

  if (next < games.length) {
    loadGame(next);
  } else {
    showSummary();
  }
}

function showSummary() {
  els.count.textContent = "Podsumowanie";
  els.name.textContent = "Koniec gry!";
  els.timerValue.textContent = "--:--";

  const total = state.scores.reduce((a, b) => a + b, 0);

  els.container.innerHTML = `
    <div class="summary-card">
      <h2 class="summary-heading">Twój wynik: <span class="summary-score">${total}</span> pkt</h2>

      <p class="summary-lorem">
        Gratulację! Udało ci się ukończyć wszystkie nasze minigry z naprawdę dobrym wynikiem.
        <span class="highlight">Możesz teraz odebrać nagrodę za swój wynik już w najbliższy piątek</span>
        na naszej zbiórce, która odbędzie się pod Szkołą Podstawową nr. 4 w Oławie
        <span class="highlight">o godzinie 16:00</span>.
        Zachęcamy również do ponownego zagrania w nasze minigry i pobicia wyników innych graczy
        w celu zwiększenia wartości nagrody!
      </p>

      <label class="summary-label" for="player-name">Wpisz swoją nazwę, aby zapisać wynik na tablicy wyników:</label>
      <input type="text" id="player-name" class="summary-input" maxlength="20" placeholder="Twoja nazwa">

      <div class="summary-actions">
        <button id="save-score-btn" class="btn-play">Zapisz wynik</button>
        <a href="index.html" class="btn-secondary">Powrót do strony głównej</a>
      </div>

      <p class="summary-note" id="summary-note"></p>
    </div>
  `;

  document.getElementById("save-score-btn").addEventListener("click", () => {
    const input = document.getElementById("player-name");
    const name = input.value.trim();
    const note = document.getElementById("summary-note");

    if (!name) {
      note.textContent = "Podaj nazwę, aby zapisać wynik.";
      note.classList.add("error");
      return;
    }

    saveScore(name, total);
    note.classList.remove("error");
    note.textContent = "Wynik zapisany! Możesz wrócić na stronę główną.";
    document.getElementById("save-score-btn").disabled = true;
    input.disabled = true;
  });
}

function saveScore(name, score) {
  let stored = [];
  try {
    stored = JSON.parse(localStorage.getItem("cwLeaderboard") || "[]");
  } catch (e) {
    stored = [];
  }
  stored.push({ name, score });
  localStorage.setItem("cwLeaderboard", JSON.stringify(stored));
}
