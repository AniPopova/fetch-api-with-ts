"use strict";
// https://www.omdbapi.com/
// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=e9f54ad  API KEY
let movieTitle = '';
function getMovieByName() {
    const movieName = document.getElementById("movieTitle");
    const url = `http://www.omdbapi.com/?s=${movieName}&apikey=e9f54ad`;
    fetchMovies(url);
}
function getMoviesByYear() {
    const url = "http://www.omdbapi.com/?s=Barbie&apikey=e9f54ad&type=movie";
    fetchMovies(url, true);
}
function fetchMovies(url, sortByYear = false) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
        if (sortByYear && data.Search) {
            // Transform years to numbers and sort
            data.Search.sort((a, b) => (b.Year - a.Year));
        }
        displayMovies(data.Search);
    })
        .catch((error) => console.error('Error fetching data:', error));
}
function displayMovies(movies) {
    console.log(movies);
    const movieContainer = document.querySelector('.movie-list');
    // Clear previous content
    if (movieContainer !== null) {
        movieContainer.innerHTML = '';
        if (movies && movies.length > 0) {
            for (let i = 0; i < movies.length; i++) {
                // Create a list item for each movie title
                const listItem = document.createElement('li');
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
