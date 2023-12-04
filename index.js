
//https://www.omdbapi.com/
//OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=e9f54ad  API KEY


function getMovieByName() {
  let url = "http://www.omdbapi.com/?s=Barbie&apikey=e9f54ad";
  fetchMovies(url);
}

function getMoviesByYear() {
  let url = "http://www.omdbapi.com/?s=Barbie&apikey=e9f54ad&type=movie";
  fetchMovies(url, true);
}

function fetchMovies(url, sortByYear = false) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (sortByYear) {
        // Sort movies by year
        data.Search.sort((a, b) => b.Year - a.Year);
      }
      displayMovies(data);
    })
    .catch((error) => console.error('Error fetching data:', error));
}

function displayMovies(movie) {
  console.log(movie);
  let movieContainer = document.querySelector('.movie-list');

  // Clear previous content
  movieContainer.innerHTML = '';

  if (movie.Search && movie.Search.length > 0) {
    for (let i = 0; i < movie.Search.length; i++) {
      // Create a list item for each movie title
      let listItem = document.createElement('li');
      listItem.className = 'movie-list-item';
      listItem.textContent = `${movie.Search[i].Title} (${movie.Search[i].Year})`;

      // Append the list item to the movie list
      movieContainer.appendChild(listItem);
    }
  }
}