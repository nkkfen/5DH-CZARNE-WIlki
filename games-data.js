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

const GAMES = [
  buildPlaceholderGame("Deszyfrowanie czekoladki"),
  buildPlaceholderGame("Quiz z 4 odpowiedziami"),
  buildPlaceholderGame("Strzał z łuku"),
  buildPlaceholderGame("Quiz prawda / fałsz"),
  buildPlaceholderGame("Mapa"),
  buildPlaceholderGame("Quiz z 4 odpowiedziami"),
];

document.addEventListener("DOMContentLoaded", () => {
  initGameEngine(GAMES);
});
