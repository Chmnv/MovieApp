const API_KEY = "028f8a1c-bb5f-4986-a2c4-f22e5eca559c";
const API_URL_POPULAR =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL"
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

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
    const rating =
      movie.rating || movie.ratingKinopoisk || movie.ratingImdb || null;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
      <div class="movie__cover-inner">
        <img
          src="${movie.posterUrlPreview}"
          class="movie__cover"
          alt="${movie.nameRu || movie.nameEn}"
        />
        <div class="movie__cover--darkened"></div>
      </div>
      <div class="movie__info">
        <div class="movie__title">${movie.nameRu || movie.nameEn}</div>
        <div class="movie__category">${movie.genres?.map(
      (genre) => ` ${genre.genre}`
    ).join(", ") || ''}</div>
        ${rating
        ? `<div class="movie__average movie__average--${getClassByRate(
          rating
        )}">${rating}</div>`
        : ""}
      </div>
    `;
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
