/**
 * Dane rankingu drużyny.
 * Na razie zwykła tablica - żeby zmienić wyniki, po prostu edytuj
 * poniższą listę (albo docelowo wczytuj z data/leaderboard.json przez fetch()).
 */
const leaderboard = [
  { name: "Wilczek99",    score: 980 },
  { name: "Sokolica",     score: 915 },
  { name: "Zuch_Adam",    score: 870 },
  { name: "Kasia_H",      score: 760 },
  { name: "Mlody_Wojtek", score: 705 },
  { name: "Puszczyk",     score: 660 },
  { name: "Iskra",        score: 610 },
  { name: "Rysiu",        score: 555 },
  { name: "Ola_Traper",   score: 500 },
  { name: "Grzybek",      score: 470 },
];

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderLeaderboard(data) {
  // sortowanie malejąco po wyniku, na wypadek nieuporządkowanych danych
  const sorted = [...data].sort((a, b) => b.score - a.score);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3, 10);

  const podiumEl = document.getElementById("podium");
  podiumEl.innerHTML = top3
    .map((player, i) => {
      const place = i + 1;
      return `
        <div class="podium-spot place-${place}">
          <div class="rank">#${place}</div>
          <div class="name">${escapeHtml(player.name)}</div>
          <div class="score">${player.score} pkt</div>
        </div>
      `;
    })
    .join("");

  const listEl = document.getElementById("leaderboard-list");
  listEl.innerHTML = rest
    .map((player, i) => {
      const place = i + 4;
      return `
        <li>
          <span class="pos">#${place}</span>
          <span class="lname">${escapeHtml(player.name)}</span>
          <span class="lscore">${player.score} pkt</span>
        </li>
      `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderLeaderboard(leaderboard);
});

/**
 * Jeśli wolisz trzymać dane w osobnym pliku JSON zamiast w tym skrypcie,
 * podmień wywołanie w DOMContentLoaded na coś w stylu:
 *
 * fetch("data/leaderboard.json")
 *   .then(res => res.json())
 *   .then(data => renderLeaderboard(data));
 *
 * Uwaga: fetch() lokalnego pliku JSON nie zadziała przy otwieraniu
 * pliku bezpośrednio z dysku (file://) - trzeba wtedy odpalić lokalny
 * serwer, np. "npx serve" albo rozszerzenie Live Server w VS Code.
 * Po wrzuceniu na dowolny hosting (nawet najprostszy) będzie działać bez problemu.
 */
