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

// wczytuje wyniki zapisane przez graczy w minigrach (localStorage) i łączy
// je z domyślną listą, żeby nowe wyniki pojawiały się na tablicy wyników
function loadStoredScores() {
  try {
    const raw = localStorage.getItem("cwLeaderboard");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function getCombinedLeaderboard() {
  return [...leaderboard, ...loadStoredScores()];
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// zapobiega samotnym jednoliterowym spójnikom/przyimkom (i, a, o, u, w, z) na końcu linijki -
// wstawia po nich twardą spację, więc tekst przenosi się razem z kolejnym słowem
function fixWidows(str) {
  return str.replace(/\b([iazouwIAZOUW])\s+/g, "$1\u00A0");
}

// wieniec laurowy - lewa połówka zbudowana z punktów na łuku okręgu (SVG 200x200,
// dopasowany 1:1 do kwadratowego kontenera, więc nie ma żadnego rozciągania/zniekształceń)
const wreathLeafPoints = [
  { x: 72.0, y: 177.1, r: 200 },
  { x: 45.0, y: 160.8, r: 222 },
  { x: 26.1, y: 135.6, r: 244 },
  { x: 18.2, y: 105.1, r: 266 },
  { x: 22.3, y: 73.8,  r: 289 },
  { x: 37.8, y: 46.5,  r: 311 },
  { x: 62.6, y: 27.0,  r: 333 },
  { x: 92.9, y: 18.3,  r: 355 },
];

function buildWreathHalfSvg(extraClass) {
  const stemPath = "M" + wreathLeafPoints.map((p) => `${p.x},${p.y}`).join(" L ");
  const leaves = wreathLeafPoints
    .map(
      (p) =>
        `<ellipse cx="${p.x}" cy="${p.y}" rx="14" ry="5.5" transform="rotate(${p.r} ${p.x} ${p.y})"/>`
    )
    .join("");
  return `
    <svg class="wreath-leaf ${extraClass}" viewBox="0 0 200 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="${stemPath}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
      ${leaves}
    </svg>
  `;
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
        <div class="wreath-badge place-${place}">
          ${buildWreathHalfSvg("wreath-leaf-left")}
          ${buildWreathHalfSvg("wreath-leaf-right")}
          <div class="wreath-content">
            <div class="rank">#${place}</div>
            <div class="name">${escapeHtml(player.name)}</div>
            <div class="score">${player.score} pkt</div>
          </div>
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

/**
 * Galeria zdjęć.
 * Podmień "src" na własne zdjęcia drużyny (np. z folderu assets/gallery/)
 * i zaktualizuj opisy w "caption".
 */
const galleryPhotos = [
  { src: "assets/galeria/1.jpg", caption: "Nasza drużyna na wzgórzu „Monte” podczas nadmorskiego obozu w Lubiatowie 2026" },
  { src: "assets/galeria/2.jpg", caption: "Prezentacja naszych pięknych mundurów, sztandaru i naszywek nad polskim morzem podczas obozu w Lubiatowie!" },
  { src: "assets/galeria/3.jpg", caption: "Wspinaczka linowa podczas corocznych manewrów techniczno-obronnych" },
  { src: "assets/galeria/4.jpg", caption: "Prezentacja narzędzi survivalowych podczas pikniku w SP4" },
  { src: "assets/galeria/5.jpg", caption: "Ćwiczenia z musztry i ceremoniału podczas biwaku drużynowego" },
  { src: "assets/galeria/6.jpg", caption: "Wspinaczka na hufcowej ściance" },
  { src: "assets/galeria/7.jpg", caption: "Gra fabularna podczas zakończenia roku harcerskiego" },
  { src: "assets/galeria/8.jpg", caption: "Współzawodnictwo podczas zbiórki" },
  { src: "assets/galeria/9.jpg", caption: "Kuchnia polowa na leśnym biwaku hamakowym w Wójcicach" },
  { src: "assets/galeria/10.jpg", caption: "Szyfry i zagadki podczas zbiórki" },
  { src: "assets/galeria/11.jpg", caption: "Rozkładanie hamaków podczas biwaku w Wójcicach" },
  { src: "assets/galeria/12.jpg", caption: "Nasza drużyna podczas organizowanego przez nas festiwalu piosenki harcerskiej" },
  { src: "assets/galeria/13.jpg", caption: "Patrol z naszej drużyny na organizowanych dla służb manewrach poszukiwawczo-ratowniczych" },
];

function renderGallery(photos) {
  const grid = document.getElementById("gallery-grid");
  grid.innerHTML = photos
    .map(
      (photo, i) => `
        <button class="gallery-item" data-index="${i}" aria-label="Powiększ zdjęcie ${i + 1}">
          <img src="${photo.src}" alt="${escapeHtml(fixWidows(photo.caption))}" loading="lazy">
        </button>
      `
    )
    .join("");

  grid.querySelectorAll(".gallery-item").forEach((btn) => {
    btn.addEventListener("click", () => openLightbox(Number(btn.dataset.index)));
  });
}

let currentPhotoIndex = 0;
const lightbox = () => document.getElementById("lightbox");
const lightboxImg = () => document.getElementById("lightbox-img");
const lightboxCaption = () => document.getElementById("lightbox-caption");

function openLightbox(index) {
  currentPhotoIndex = index;
  updateLightboxContent();
  lightbox().classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox().classList.remove("open");
  document.body.style.overflow = "";
}

function updateLightboxContent() {
  const photo = galleryPhotos[currentPhotoIndex];
  lightboxImg().src = photo.src;
  lightboxImg().alt = fixWidows(photo.caption);
  lightboxCaption().textContent = fixWidows(photo.caption);
}

function showNextPhoto() {
  currentPhotoIndex = (currentPhotoIndex + 1) % galleryPhotos.length;
  updateLightboxContent();
}

function showPrevPhoto() {
  currentPhotoIndex = (currentPhotoIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
  updateLightboxContent();
}

document.addEventListener("DOMContentLoaded", () => {
  renderLeaderboard(getCombinedLeaderboard());
  renderGallery(galleryPhotos);

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox-next").addEventListener("click", showNextPhoto);
  document.getElementById("lightbox-prev").addEventListener("click", showPrevPhoto);

  // strzałki obok galerii - przewijanie widocznych miniaturek (o jedną "stronę" na klik)
  const galleryTrackWrap = document.getElementById("gallery-track-wrap");
  document.getElementById("gallery-next").addEventListener("click", () => {
    galleryTrackWrap.scrollBy({ left: galleryTrackWrap.clientWidth, behavior: "smooth" });
  });
  document.getElementById("gallery-prev").addEventListener("click", () => {
    galleryTrackWrap.scrollBy({ left: -galleryTrackWrap.clientWidth, behavior: "smooth" });
  });

  // zamykanie kliknięciem w ciemne tło poza zdjęciem
  document.getElementById("lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLightbox();
  });

  // nawigacja strzałkami klawiatury i Escape
  document.addEventListener("keydown", (e) => {
    if (!lightbox().classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNextPhoto();
    if (e.key === "ArrowLeft") showPrevPhoto();
  });
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
