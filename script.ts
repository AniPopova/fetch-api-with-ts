// https://www.omdbapi.com/
// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=e9f54ad  API KEY

let movieTitle = '';


function getMovieByName() {

let movieName = document.getElementById("movieTitle");

    let url: string = `http://www.omdbapi.com/?s=${movieName}&apikey=e9f54ad`;
    fetchMovies(url);
  }
  
  function getMoviesByYear() {
    let url: string = "http://www.omdbapi.com/?s=Barbie&apikey=e9f54ad&type=movie";
    fetchMovies(url, true);
  }
  
  function fetchMovies(url: string, sortByYear: boolean = false) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (sortByYear && data.Search) {
          // Transform years to numbers and sort
          data.Search.sort((a: any, b: any) => parseInt(b.Year) - parseInt(a.Year));
        }
        displayMovies(data.Search);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }
  
  function displayMovies(movie: any[]) {
    console.log(movie);
    let movieContainer: HTMLElement | null = document.querySelector('.movie-list');
  
    // Clear previous content
    if (movieContainer) {
      movieContainer.innerHTML = '';
  
      if (movie && movie.length > 0) {
        for (let i = 0; i < movie.length; i++) {
          // Create a list item for each movie title
          let listItem: HTMLLIElement = document.createElement('li');
          listItem.className = 'movie-list-item';
          listItem.textContent = `${movie[i].Title} (${movie[i].Year})`;
  
          // Append the list item to the movie list
          if (movieContainer) {
            movieContainer.appendChild(listItem);
          }
        }
      }
    }
  }
  