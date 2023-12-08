// https://www.omdbapi.com/
// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=e9f54ad  API KEY

// TYPES
type Movie = {
  Title: string;
  Year: string;
};

type MovieApiResponse = {
  Search: Movie[];
};


let currentPosterIndex = 0; // current index of the displayed poster

//GLOBAL VARIABLES
const searchSection: HTMLElement = document.getElementById('search-section') as HTMLElement;
const resultSection: HTMLElement = document.getElementById('result-section') as HTMLElement;
const fetchPoster: HTMLElement = document.getElementById('result-section') as HTMLElement;
const searchMoviesButton: HTMLAnchorElement = document.getElementById('get-movie-button') as HTMLAnchorElement; 
const sortMoviesButton: HTMLAnchorElement = document.getElementById('sort-movies-button') as HTMLAnchorElement;
//FUNCTIONS

function getMovieByName(): void {
  const movieNameInput: HTMLInputElement = document.getElementById("movieTitleInput") as HTMLInputElement;
  const movieName: string = movieNameInput.value.trim();

  if (movieName !== '') {
    const url: string = `http://www.omdbapi.com/?s=${movieName}&apikey=e9f54ad`;
    fetchMovies(url);
  }
}

function getMoviesByYear(): void {
  const movieNameInput: HTMLInputElement = document.getElementById("movieTitleInput") as HTMLInputElement;
  const movieName: string = movieNameInput.value.trim();

  if (movieName !== '') {
    const url: string = `http://www.omdbapi.com/?s=${movieName}&apikey=e9f54ad&type=movie`;
    fetchMovies(url, true);
  }
}

function fetchMovies(url: string, sortByYear: boolean = false): void {
  fetch(url)
    .then((response) => response.json())
    .then((data: { Search: Movie[] }) => {
      if (sortByYear && data.Search) {
        // Transform years to numbers and sort
        data.Search.sort((a, b) => (parseInt(b.Year) - parseInt(a.Year)));
      }
      displayMovies(data.Search);
    })
    .catch((error) => console.error('Error fetching data:', error));
}


function displayMovies(movies: Movie[]): void {
  const movieContainer: HTMLElement = document.querySelector('.movie-list') as HTMLElement;

  if (movieContainer !== null) {
    movieContainer.innerHTML = '';

    if (movies && movies.length > 0) {
      for (let i = 0; i < movies.length; i++) {
        //list item for each movie title
        const listItem: HTMLLIElement = document.createElement('li');
        listItem.classList.add('movie-list-item');
        listItem.textContent = `${movies[i].Title} (${movies[i].Year})`;

        // Append the list item to the movie list
        if (movieContainer) {
          movieContainer.appendChild(listItem);
        }
      }
    }
  }
}


// MOVIE POSTER
function displayMoviePoster(posterUrl: string): void {
  const image = document.getElementById("image") as HTMLImageElement;

  if (image instanceof HTMLImageElement) {
    if (posterUrl !== "N/A") {
      image.src = posterUrl;
    } else {
      alert("No poster available for the selected movies");
    }
  }
}

function fetchMoviePoster(): void {
  const movieNameInput: HTMLInputElement = document.getElementById("movieTitleInput") as HTMLInputElement;
  const movieName: string = movieNameInput.value.trim();
  const url: string = `http://www.omdbapi.com/?apikey=e9f54ad&s=${movieName}&type=movie`;

  if (!movieName) {
    alert("Please enter a movie name");
    return;
  }

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.Search && data.Search.length > 0) {
        const firstMovie = data.Search[0];

        let image = document.getElementById("image") as HTMLImageElement;
        if (image instanceof HTMLImageElement) {
          const posterUrl = firstMovie.Poster;
          if (posterUrl !== "N/A") {
            image.src = posterUrl;
          } else {
            alert("No poster available for the selected movie");
          }
        }
      } else {
        alert(`No search results found for the movie: ${movieName}`);
      }
    })
    .catch(function (error): void {
      alert(`Error fetching movie picture for ${movieName}`);
    });
}


function fetchNextMoviePoster(): void {
  const movieNameInput: HTMLInputElement = document.getElementById("movieTitleInput") as HTMLInputElement;
  const movieName: string = movieNameInput.value.trim();
  const url: string = `http://www.omdbapi.com/?apikey=e9f54ad&s=${movieName}&type=movie`;

  if (!movieName) {
    alert("Please enter a movie name");
    return;
  }

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.Search && data.Search.length > 0) {
        currentPosterIndex = (currentPosterIndex + 1) % data.Search.length;
        const currentMovie = data.Search[currentPosterIndex];

        displayMoviePoster(currentMovie.Poster);
      } else {
        console.error(`No search results found for the movie: ${movieName}`);
      }
    })
    .catch(function (error): void {
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
const posterButtons: HTMLDivElement = document.createElement('div');
posterButtons.classList.add('flex-container');

const fetchMoviePosterButton: HTMLAnchorElement = document.createElement('a');
fetchMoviePosterButton.classList.add('button');
fetchMoviePosterButton.textContent = 'See Poster';

const switchMoviePosterButton: HTMLAnchorElement = document.createElement('a');
switchMoviePosterButton.classList.add('button');
switchMoviePosterButton.textContent = 'Next';

posterButtons.appendChild(fetchMoviePosterButton);
posterButtons.appendChild(switchMoviePosterButton);
fetchPoster.appendChild(posterButtons);


// EVENT LISTENERS
searchMoviesButton.addEventListener('click', getMovieByName);
sortMoviesButton.addEventListener('click', getMoviesByYear);
fetchMoviePosterButton.addEventListener('click', fetchMoviePoster);
switchMoviePosterButton.addEventListener('click', fetchNextMoviePoster);
