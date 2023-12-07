"use strict";
// https://www.omdbapi.com/
// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=e9f54ad  API KEY
let currentPosterIndex = 0; // current index of the displayed poster
//GLOBAL VARIABLES
const searchSection = document.getElementById('search-section');
const resultSection = document.getElementById('result-section');
const fetchPoster = document.getElementById('result-section');
//FUNCTIONS
function getMovieByName() {
    const movieNameInput = document.getElementById("movieTitleInput");
    const movieName = movieNameInput.value.trim();
    if (movieName !== '') {
        const url = `http://www.omdbapi.com/?s=${movieName}&apikey=e9f54ad`;
        fetchMovies(url);
    }
}
function getMoviesByYear() {
    const movieNameInput = document.getElementById("movieTitleInput");
    const movieName = movieNameInput.value.trim();
    if (movieName !== '') {
        const url = `http://www.omdbapi.com/?s=${movieName}&apikey=e9f54ad&type=movie`;
        fetchMovies(url, true);
    }
}
function fetchMovies(url, sortByYear = false) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
        if (sortByYear && data.Search) {
            // Transform years to numbers and sort
            data.Search.sort((a, b) => (parseInt(b.Year) - parseInt(a.Year)));
        }
        displayMovies(data.Search);
    })
        .catch((error) => console.error('Error fetching data:', error));
}
function displayMovies(movies) {
    const movieContainer = document.querySelector('.movie-list');
    if (movieContainer !== null) {
        movieContainer.innerHTML = '';
        if (movies && movies.length > 0) {
            for (let i = 0; i < movies.length; i++) {
                // Create a list item for each movie title
                const listItem = document.createElement('li');
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
function displayMoviePoster(posterUrl) {
    const image = document.getElementById("image");
    if (image instanceof HTMLImageElement) {
        if (posterUrl !== "N/A") {
            image.src = posterUrl;
        }
        else {
            alert("No poster available for the selected movies");
        }
    }
}
function fetchMoviePoster() {
    const movieNameInput = document.getElementById("movieTitleInput");
    const movieName = movieNameInput.value.trim();
    const url = `http://www.omdbapi.com/?apikey=e9f54ad&s=${movieName}&type=movie`;
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
            let image = document.getElementById("image");
            if (image instanceof HTMLImageElement) {
                const posterUrl = firstMovie.Poster;
                if (posterUrl !== "N/A") {
                    image.src = posterUrl;
                }
                else {
                    alert("No poster available for the selected movie");
                }
            }
        }
        else {
            alert(`No search results found for the movie: ${movieName}`);
        }
    })
        .catch(function (error) {
        alert(`Error fetching movie picture for ${movieName}`);
    });
}
function fetchNextMoviePoster() {
    const movieNameInput = document.getElementById("movieTitleInput");
    const movieName = movieNameInput.value.trim();
    const url = `http://www.omdbapi.com/?apikey=e9f54ad&s=${movieName}&type=movie`;
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
        }
        else {
            console.error(`No search results found for the movie: ${movieName}`);
        }
    })
        .catch(function (error) {
        console.error(`Error fetching movie picture for ${movieName}:`, error);
    });
}
//SEARCH SECTION
const movieListContainer = document.createElement('div');
movieListContainer.classList.add('container');
const movieList = document.createElement('ul');
movieList.classList.add('movie-list');
//POSTERS
const posterContainer = document.createElement('div');
posterContainer.classList.add('container');
const moviePoster = document.createElement('img');
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
fetchMoviePosterButton.textContent = 'See Poster';
const switchMoviePosterButton = document.createElement('a');
switchMoviePosterButton.classList.add('button');
switchMoviePosterButton.textContent = 'Next';
posterButtons.appendChild(fetchMoviePosterButton);
posterButtons.appendChild(switchMoviePosterButton);
fetchPoster.appendChild(posterButtons);
// EVENT LISTENERS
fetchMoviePosterButton.addEventListener('click', fetchMoviePoster);
switchMoviePosterButton.addEventListener('click', fetchNextMoviePoster);
