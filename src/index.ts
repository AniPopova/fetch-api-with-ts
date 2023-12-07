// https://www.omdbapi.com/
// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=e9f54ad  API KEY

// TYPES
type Movie = {
  Title: string;
  Year: string;
};


const movieName: string = '';

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

  // Clear previous content
  if (movieContainer !== null) {
    movieContainer.innerHTML = '';

    if (movies && movies.length > 0) {
      for (let i = 0; i < movies.length; i++) {
        // Create a list item for each movie title
        const listItem: HTMLLIElement = document.createElement('li');
        listItem.className = 'movie-list-item';
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

  // Update the image source with the movie poster URL
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

  if (!movieName) {
    alert("Please enter a movie name");
    return;
  }


  const url: string = `http://www.omdbapi.com/?apikey=e9f54ad&s=${movieName}&type=movie`;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.Search && data.Search.length > 0) {
        // Get the first movie from the search results
        const firstMovie = data.Search[0];

        let image = document.getElementById("image") as HTMLImageElement;

        // Update the image source with the movie poster URL
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

let currentPosterIndex = 0; // Track the current index of the displayed poster
function fetchNextMoviePoster(): void {
  const movieNameInput: HTMLInputElement = document.getElementById("movieTitleInput") as HTMLInputElement;
  const movieName: string = movieNameInput.value.trim();

  if (!movieName) {
    console.error("Please enter a movie name");
    return;
  }

  const apiUrl: string = `http://www.omdbapi.com/?apikey=e9f54ad&s=${movieName}&type=movie`;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.Search && data.Search.length > 0) {
        // Update the current index to the next poster
        currentPosterIndex = (currentPosterIndex + 1) % data.Search.length;

        // Get the movie at the current index
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
const searchSection: HTMLElement = document.getElementById('search-section') as HTMLElement;

//RESULT SECTION ELEMENTS
const fetchPoster: HTMLElement = document.getElementById('result-section') as HTMLElement;
const posterButtons: HTMLDivElement = document.createElement('div');
posterButtons.classList.add('flex-container');

const fetchMoviePosterButton: HTMLAnchorElement = document.createElement('a');
fetchMoviePosterButton.classList.add('button');
fetchMoviePosterButton.textContent = 'See Poster';
posterButtons.appendChild(fetchMoviePosterButton);

const switchMoviePosterButton: HTMLAnchorElement = document.createElement('a');
switchMoviePosterButton.classList.add('button');
switchMoviePosterButton.textContent = 'Next';
posterButtons.appendChild(switchMoviePosterButton);

fetchPoster.appendChild(posterButtons);


//EVENT LISTENERS
fetchMoviePosterButton.addEventListener('click', fetchMoviePoster); 
switchMoviePosterButton.addEventListener('click', fetchNextMoviePoster); 