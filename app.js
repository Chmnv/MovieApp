const API_KEY = "273b43c3-283f-4a80-a0ec-76679aa1dbc7";
const API_URL_POPULAR =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL";
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_MOVIE_DETAILS =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

getMovies(API_URL_POPULAR);

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  showMovies(respData);
}

function getClassByRate(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}


function showMovies(data) {
  const moviesEl = document.querySelector(".movies");
  moviesEl.innerHTML = "";

  const movies = data.items || data.films || [];

  movies.forEach((movie) => {
    const rating = movie.rating || movie.ratingKinopoisk || movie.ratingImdb || null;
    const title = movie.nameOriginal || movie.nameEn || movie.nameRu;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.dataset.id = movie.kinopoiskId || movie.filmId;

    movieEl.innerHTML = `
        <div class="movie__cover-inner">
          <img src="${movie.posterUrlPreview}" class="movie__cover"alt="${title}"/>
          <div class="movie__cover--darkened"></div>
        </div>

        <div class="movie__info">
          <div class="movie__title">${title}</div>
          <div class="movie__category">${movie.genres?.map((genre) => genre.genre).join(", ") || ""}</div>
          ${rating ? `<div class="movie__average movie__average--${getClassByRate(rating)}">${rating}</div>` : ""}
        </div>`;
    moviesEl.appendChild(movieEl);
  });
}

const form = document.querySelector("form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);
    search.value = "";
  }
});

// Modal Window
const modalEl = document.querySelector(".modal");

async function openModal(id) {
  const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();

  const title = respData.nameOriginal || respData.nameEn || respData.nameRu;


  modalEl.classList.add("modal--show");
  document.body.classList.add("stop-scrolling");

  modalEl.innerHTML = `
      <div class="modal__card">
        <img class="modal__movie-backdrop" src="${respData.posterUrl}" alt="">
        <h2>
          <span class="modal__movie-title">${title}</span>
          <span class="modal__movie-release-year"> - ${respData.year}</span>
        </h2>

        <ul class="modal__movie-info">
          <li class="modal__movie-genre">Genre - ${respData.genres.map((el) => `<span>${el.genre}</span>`).join(", ")}</li>
          ${respData.filmLength ? `<li class="modal__movie-runtime">Time - ${respData.filmLength} min</li>` : ""}
          <li>Site: <a class="modal__movie-site" href="${respData.webUrl}">${respData.webUrl}</a></li>
          <li class="modal__movie-overview">Description - ${respData.description}</li>
        </ul>
        <button type="button" class="modal__button-close">Close</button>
      </div>
    `;

  const btnClose = document.querySelector(".modal__button-close");
  btnClose.addEventListener("click", () => closeModal());
}

function closeModal() {
  modalEl.classList.remove("modal--show");
  document.body.classList.remove("stop-scrolling");
}

window.addEventListener("click", (e) => {
  if (e.target === modalEl) {
    closeModal();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

document.querySelector(".movies").addEventListener("click", (e) => {
  const movieEl = e.target.closest(".movie");
  if (movieEl && movieEl.dataset.id) {
    openModal(movieEl.dataset.id);
  }
});

