/**
 * LISTA 6 MINIGIER - w tej kolejności.
 * Na razie każda to placeholder testowy: pozwala sprawdzić działanie
 * silnika (stoper, punktacja, przejścia, podsumowanie), zanim podmienimy
 * zawartość na prawdziwą rozgrywkę.
 *
 * Każdy obiekt gry ma:
 * - name: nazwa wyświetlana w nagłówku
 * - render(container, api): rysuje UI gry w danym kontenerze
 *   - api.registerError() wywołuj przy każdym błędzie (-20 pkt)
 *   - api.completeGame() wywołuj, gdy gracz kończy zadanie
 */

function buildPlaceholderGame(name) {
  return {
    name,
    render(container, api) {
      container.innerHTML = `
        <div class="game-placeholder">
          <p class="placeholder-title">Tu pojawi się gra: <strong>${name}</strong></p>
          <p class="placeholder-note">To tymczasowy ekran testowy silnika - opisz zasady tej gry, a zostanie ona tu zaprogramowana.</p>
          <div class="placeholder-actions">
            <button class="btn-play" id="ph-complete">Zakończ minigrę</button>
            <button class="btn-secondary" id="ph-error" type="button">Symuluj błąd (-20 pkt)</button>
          </div>
        </div>
      `;
      container.querySelector("#ph-complete").addEventListener("click", () => api.completeGame());
      container.querySelector("#ph-error").addEventListener("click", () => api.registerError());
    },
  };
}

/**
 * MINIGRA 1: Deszyfrowanie czekoladki.
 * Losowe słowo z listy jest wyświetlane czcionką "ChocolateCipher"
 * (podmienia zwykłe litery na symbole szyfru). Gracz wpisuje odgadnięte
 * słowo zwykłym alfabetem i klika "Sprawdź".
 * - błędna odpowiedź: -20 pkt (api.registerError()), można próbować dalej
 * - poprawna odpowiedź: krótki komunikat, potem automatyczne przejście dalej
 */
const CIPHER_WORDS = [
  "Terenowy",
  "Szyszki",
  "Harcersko",
  "szyfrowanie",
  "Enigma",
  "surwiwal",
  "ekwipunek",
  "Patrolowy",
  "eksploracja",
  "siekiera",
];

const cipherGame = {
  name: "Deszyfrowanie czekoladki",
  render(container, api) {
    const targetWord = CIPHER_WORDS[Math.floor(Math.random() * CIPHER_WORDS.length)];

    container.innerHTML = `
      <div class="cipher-game">
        <img src="assets/games/szyfr-zasady.png" alt="Zasady szyfru czekoladowego" class="cipher-rules-img">
        <p class="cipher-instructions">Rozszyfruj poniższe słowo zapisane szyfrem czekoladowym i wpisz je w polu poniżej.</p>
        <div class="cipher-word">${targetWord}</div>
        <input type="text" id="cipher-input" class="cipher-input" placeholder="Wpisz rozszyfrowane słowo" autocomplete="off">
        <button id="cipher-check" class="btn-play">Sprawdź</button>
        <p id="cipher-feedback" class="cipher-feedback"></p>
      </div>
    `;

    const input = container.querySelector("#cipher-input");
    const feedback = container.querySelector("#cipher-feedback");
    const checkBtn = container.querySelector("#cipher-check");

    function checkAnswer() {
      const guess = input.value.trim().toLowerCase();
      const correct = targetWord.trim().toLowerCase();

      if (guess === correct) {
        feedback.textContent = "Poprawnie! Przechodzimy do kolejnej minigry...";
        feedback.className = "cipher-feedback ok";
        checkBtn.disabled = true;
        input.disabled = true;
        setTimeout(() => api.completeGame(), 1200);
      } else {
        feedback.textContent = "Błąd! Spróbuj jeszcze raz.";
        feedback.className = "cipher-feedback bad";
        api.registerError();
      }
    }

    checkBtn.addEventListener("click", checkAnswer);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkAnswer();
    });
  },
};

const GAMES = [
  cipherGame,
  buildPlaceholderGame("Quiz z 4 odpowiedziami"),
  buildPlaceholderGame("Strzał z łuku"),
  buildPlaceholderGame("Quiz prawda / fałsz"),
  buildPlaceholderGame("Mapa"),
  buildPlaceholderGame("Quiz z 4 odpowiedziami"),
];

document.addEventListener("DOMContentLoaded", () => {
  initGameEngine(GAMES);
});
