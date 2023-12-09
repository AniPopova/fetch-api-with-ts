// https://www.omdbapi.com/
// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=e9f54ad  API KEY

// VARIABLES AND INTERFACES
interface Movie {
  Title: string;
  Year: string;
  Poster: string;
};

interface MovieResponse {
  Search: Array<Movie>;
};

interface PosterResponse {
  Response: boolean;
  Error: string;
};

let currentPosterIndex = 0;


//GLOBAL HTML ELEMENTS
const searchSection = document.getElementById('search-section') as HTMLElement;
const resultSection = document.getElementById('result-section') as HTMLElement;
const fetchPoster = document.getElementById('result-section') as HTMLElement;
const searchMoviesButton = document.getElementById('get-movie-button') as HTMLAnchorElement;
const sortMoviesButton = document.getElementById('sort-movies-button') as HTMLAnchorElement;
const movieNameInput = document.getElementById("movieTitleInput") as HTMLInputElement;

//FUNCTIONS

function getMoviesByNameOrYear(yearsOrName: boolean = false) {
  const movieName = movieNameInput.value.trim();

  if (movieName !== '') {
    let url = `http://www.omdbapi.com/?s=${movieName}&apikey=e9f54ad`;

    if (yearsOrName) {
      url += '&type=movie';
    }

    fetchMovies(url, yearsOrName);
  }
}


function fetchMovies(url: string, sortByYear: boolean = false) {
  fetch(url)
    .then((response) => response.json())
    .then((data: MovieResponse) => {
      if (sortByYear && data.Search) {
        data.Search.sort((a, b) => (parseInt(b.Year) - parseInt(a.Year)));
      }
      displayMovies(data.Search);
    })
    .catch((error) => console.error('Error fetching data:', error));
}


function displayMovies(movies: Array<Movie>) {
  const movieContainer = document.querySelector('.movie-list') as HTMLElement;

  if (movieContainer !== null) {
    movieContainer.innerHTML = '';

    if (movies && movies.length > 0) {
      for (let i = 0; i < movies.length; i++) {
        const listItem = document.createElement('li');
        listItem.classList.add('movie-list-item');
        listItem.textContent = `${movies[i].Title} (${movies[i].Year})`;
        if (movieContainer) {
          movieContainer.appendChild(listItem);
        }
      }
    }
  }
}

// MOVIE POSTER
function displayMoviePoster(posterUrl: string) {
  const image = document.getElementById("image") as HTMLImageElement;

  if (image instanceof HTMLImageElement) {
    if (posterUrl !== "N/A") {
      image.src = posterUrl;
    } else {
      alert("No poster available for the selected movies");
    }
  }
}

function fetchMoviePoster(isNextPoster: boolean = false) {
  const movieName = movieNameInput.value.trim();
  const url = `http://www.omdbapi.com/?apikey=e9f54ad&s=${movieName}&type=movie`;

  if (!movieName) {
    alert("Please enter a movie name");
    return;
  }

  fetch(url)
    .then((response) =>{
      return response.json();
    })
    .then((data: MovieResponse) =>{
      if (data.Search && data.Search.length > 0) {
        if (isNextPoster) {
          currentPosterIndex = (currentPosterIndex + 1) % data.Search.length;
        }
        const currentMovie = data.Search[currentPosterIndex];
        const posterUrl = currentMovie.Poster;
        
        if (isNextPoster) {
          displayMoviePoster(posterUrl);
        } else {
          let image = document.getElementById("image") as HTMLImageElement;
          if (image instanceof HTMLImageElement) {
            if (posterUrl !== "N/A") {
              image.src = posterUrl;
            } else {
              alert("No poster available for the selected movie");
            }
          }
        }
      } else {
        alert(`No search results found for the movie: ${movieName}`);
      }
    })
    .catch(function (error: string){
      console.error(`Error fetching movie picture for ${movieName}:`, error);
    });
}

//SEARCH SECTION
const movieListContainer: HTMLDivElement = document.createElement('div');
movieListContainer.classList.add('container');

const movieList: HTMLUListElement = document.createElement('ul');
movieList.classList.add('movie-list');

//POSTERS
const posterContainer: HTMLDivElement = document.createElement('div');
posterContainer.classList.add('container');

const moviePoster: HTMLImageElement = document.createElement('img');
moviePoster.id = 'image';
moviePoster.classList.add('image');
moviePoster.alt = 'Movie poster';

movieListContainer.appendChild(movieList);
posterContainer.appendChild(moviePoster);
resultSection.appendChild(movieListContainer);
resultSection.appendChild(posterContainer);

// RESULT SECTION ELEMENTS
const posterButtons = document.createElement('div');
posterButtons.classList.add('flex-container');

const fetchMoviePosterButton = document.createElement('a');
fetchMoviePosterButton.classList.add('button');
fetchMoviePosterButton.textContent = 'See Next Poster';

posterButtons.appendChild(fetchMoviePosterButton);
fetchPoster.appendChild(posterButtons);


// EVENT LISTENERS
searchMoviesButton.addEventListener('click', () => { getMoviesByNameOrYear(false); fetchMoviePoster(true);});
sortMoviesButton.addEventListener('click', () => { getMoviesByNameOrYear(true);});
fetchMoviePosterButton.addEventListener('click', () => { fetchMoviePoster(true); });
