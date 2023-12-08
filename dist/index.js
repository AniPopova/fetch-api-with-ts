"use strict";
// https://www.omdbapi.com/
// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=e9f54ad  API KEY
;
;
;
let currentPosterIndex = 0;
//GLOBAL HTML ELEMENTS
const searchSection = document.getElementById('search-section');
const resultSection = document.getElementById('result-section');
const fetchPoster = document.getElementById('result-section');
const searchMoviesButton = document.getElementById('get-movie-button');
const sortMoviesButton = document.getElementById('sort-movies-button');
const movieNameInput = document.getElementById("movieTitleInput");
//FUNCTIONS
function getMoviesByNameOrYear(yearsOrName = false) {
    const movieNameInput = document.getElementById("movieTitleInput");
    const movieName = movieNameInput.value.trim();
    if (movieName !== '') {
        let url = `http://www.omdbapi.com/?s=${movieName}&apikey=e9f54ad`;
        if (yearsOrName) {
            url += '&type=movie';
        }
        fetchMovies(url, yearsOrName);
    }
}
function fetchMovies(url, sortByYear = false) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
        if (sortByYear && data.Search) {
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
function fetchMoviePoster(isNextPoster = false) {
    const movieName = movieNameInput.value.trim();
    const url = `http://www.omdbapi.com/?apikey=e9f54ad&s=${movieName}&type=movie`;
    if (!movieName) {
        alert("Please enter a movie name");
        return;
    }
    fetch(url)
        .then((response) => {
        return response.json();
    })
        .then((data) => {
        if (data.Search && data.Search.length > 0) {
            if (isNextPoster) {
                currentPosterIndex = (currentPosterIndex + 1) % data.Search.length;
            }
            const currentMovie = data.Search[currentPosterIndex];
            const posterUrl = currentMovie.Poster;
            if (isNextPoster) {
                displayMoviePoster(posterUrl);
            }
            else {
                let image = document.getElementById("image");
                if (image instanceof HTMLImageElement) {
                    if (posterUrl !== "N/A") {
                        image.src = posterUrl;
                    }
                    else {
                        alert("No poster available for the selected movie");
                    }
                }
            }
        }
        else {
            alert(`No search results found for the movie: ${movieName}`);
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
//fetchMoviePosterButton.classList.add('hidden');
fetchMoviePosterButton.textContent = 'See Poster';
const switchMoviePosterButton = document.createElement('a');
switchMoviePosterButton.classList.add('button');
switchMoviePosterButton.textContent = 'Next';
posterButtons.appendChild(fetchMoviePosterButton);
posterButtons.appendChild(switchMoviePosterButton);
fetchPoster.appendChild(posterButtons);
// EVENT LISTENERS
searchMoviesButton.addEventListener('click', () => { getMoviesByNameOrYear(false); });
sortMoviesButton.addEventListener('click', () => { getMoviesByNameOrYear(true); });
fetchMoviePosterButton.addEventListener('onload', () => { fetchMoviePoster(false); });
fetchMoviePosterButton.addEventListener('click', () => { fetchMoviePoster(false); });
switchMoviePosterButton.addEventListener('click', () => { fetchMoviePoster(true); });
