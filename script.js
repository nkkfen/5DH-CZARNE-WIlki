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

// gałązka laurowa do owinięcia wieńca (SVG, kolor dziedziczony z CSS przez currentColor)
const laurelBranch = `
  <svg class="wreath-leaf" viewBox="0 0 24 40" fill="currentColor" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2 C12 2 4 9 4 17 C4 25 8 31 12 38" stroke="currentColor" stroke-width="1.2" fill="none"/>
    <ellipse cx="7" cy="8" rx="3.2" ry="1.6" transform="rotate(-40 7 8)"/>
    <ellipse cx="5" cy="13.5" rx="3.2" ry="1.6" transform="rotate(-22 5 13.5)"/>
    <ellipse cx="4.2" cy="19" rx="3.2" ry="1.6" transform="rotate(-4 4.2 19)"/>
    <ellipse cx="4.6" cy="24.5" rx="3.2" ry="1.6" transform="rotate(14 4.6 24.5)"/>
    <ellipse cx="6" cy="30" rx="3.2" ry="1.6" transform="rotate(32 6 30)"/>
    <ellipse cx="9" cy="35" rx="3.2" ry="1.6" transform="rotate(48 9 35)"/>
  </svg>
`;

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
          ${laurelBranch.replace('class="wreath-leaf"', 'class="wreath-leaf wreath-leaf-left"')}
          ${laurelBranch.replace('class="wreath-leaf"', 'class="wreath-leaf wreath-leaf-right"')}
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
  { src: "https://picsum.photos/seed/harcerze-oboz/900/700", caption: "Obóz letni 2025 - poranna zbiórka." },
  { src: "https://picsum.photos/seed/harcerze-ognisko/900/700", caption: "Wieczorne ognisko i śpiewy przy gitarze." },
  { src: "https://picsum.photos/seed/harcerze-rajd/900/700", caption: "Rajd górski drużyny 'Czarne Wilki'." },
  { src: "https://picsum.photos/seed/harcerze-gra/900/700", caption: "Terenowa gra strategiczna dla zastępów." },
  { src: "https://picsum.photos/seed/harcerze-zlot/900/700", caption: "Zlot harcerski - wspólne zdjęcie drużyny." },
  { src: "https://picsum.photos/seed/harcerze-las/900/700", caption: "Marsz przez las podczas rajdu jesiennego." },
  { src: "https://picsum.photos/seed/harcerze-namioty/900/700", caption: "Rozbijanie obozowiska - zastęp 'Rysie'." },
  { src: "https://picsum.photos/seed/harcerze-warsztaty/900/700", caption: "Warsztaty z pierwszej pomocy." },
  { src: "https://picsum.photos/seed/harcerze-kajaki/900/700", caption: "Spływ kajakowy drużyny." },
  { src: "https://picsum.photos/seed/harcerze-apel/900/700", caption: "Uroczysty apel z okazji Dnia Myśli Braterskiej." },
];

function renderGallery(photos) {
  const grid = document.getElementById("gallery-grid");
  grid.innerHTML = photos
    .map(
      (photo, i) => `
        <button class="gallery-item" data-index="${i}" aria-label="Powiększ zdjęcie ${i + 1}">
          <img src="${photo.src}" alt="${escapeHtml(photo.caption)}" loading="lazy">
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
  lightboxImg().alt = photo.caption;
  lightboxCaption().textContent = photo.caption;
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
  renderLeaderboard(leaderboard);
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
