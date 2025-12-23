const APP_ID = "consee";

const artistInput = document.getElementById("artistInput");
const cityInput = document.getElementById("cityInput");
const dateInput = document.getElementById("dateInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");
const status = document.getElementById("status");
const featuredSlides = document.getElementById("featuredSlides");

searchBtn.onclick = search;
[artistInput, cityInput, dateInput].forEach(i =>
  i.addEventListener("keydown", e => e.key === "Enter" && search())
);

loadFeatured();

async function search() {
  const artist = artistInput.value.trim();
  if (!artist) return;

  status.textContent = "Loading events...";
  results.innerHTML = "";

  const res = await fetch(
    `https://rest.bandsintown.com/artists/${encodeURIComponent(
      artist
    )}/events?app_id=${APP_ID}`
  );

  const events = await res.json();
  if (!Array.isArray(events)) {
    status.textContent = "No events found.";
    return;
  }

  const city = cityInput.value.trim().toLowerCase();
  const date = dateInput.value;

  const filtered = events.filter(e => {
    if (city && !e.venue.city.toLowerCase().includes(city)) return false;
    if (date && !e.datetime.startsWith(date)) return false;
    return true;
  });

  status.textContent =
    filtered.length > 0
      ? `${filtered.length} events found`
      : "No events match your search.";

  filtered.forEach(e => {
    const card = document.createElement("div");
    card.className = "reviewCard";
    card.innerHTML = `
      <h3>${e.artist.name}</h3>
      <div class="meta">${e.venue.name} · ${e.venue.city}</div>
      <div class="text">${new Date(e.datetime).toLocaleDateString()}</div>
      <a href="${e.url}" target="_blank" class="badge">View</a>
    `;
    results.appendChild(card);
  });
}

async function loadFeatured() {
  const artists = [
    "Taylor Swift",
    "Drake",
    "SZA",
    "Bad Bunny",
    "Olivia Rodrigo"
  ];

  for (const name of artists) {
    const res = await fetch(
      `https://rest.bandsintown.com/artists/${encodeURIComponent(
        name
      )}?app_id=${APP_ID}`
    );
    const a = await res.json();

    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
      <div class="slideCard"
        style="background-image:url('${a.image_url}');
               background-size:cover;
               background-position:center;">
        <div class="slideTitle">${a.name}</div>
        <div class="slideMeta">${a.upcoming_event_count} upcoming</div>
      </div>
    `;

    slide.onclick = () => {
      artistInput.value = a.name;
      search();
      window.scrollTo({ top: 300, behavior: "smooth" });
    };

    featuredSlides.appendChild(slide);
  }

  new Swiper("#featuredSwiper", {
    slidesPerView: 1.2,
    spaceBetween: 14,
    pagination: { el: ".swiper-pagination", clickable: true },
    breakpoints: {
      700: { slidesPerView: 2.5 },
      1000: { slidesPerView: 3.5 }
    }
  });
}
