"use strict";
// https://www.omdbapi.com/
// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=e9f54ad  API KEY
const movieName = '';
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
// MOVIE POSTER
function displayMoviePoster(posterUrl) {
    const image = document.getElementById("image");
    // Update the image source with the movie poster URL
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
    if (!movieName) {
        alert("Please enter a movie name");
        return;
    }
    const url = `http://www.omdbapi.com/?apikey=e9f54ad&s=${movieName}&type=movie`;
    fetch(url)
        .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        if (data.Search && data.Search.length > 0) {
            // Get the first movie from the search results
            const firstMovie = data.Search[0];
            let image = document.getElementById("image");
            // Update the image source with the movie poster URL
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
let currentPosterIndex = 0; // Track the current index of the displayed poster
function fetchNextMoviePoster() {
    const movieNameInput = document.getElementById("movieTitleInput");
    const movieName = movieNameInput.value.trim();
    if (!movieName) {
        console.error("Please enter a movie name");
        return;
    }
    const apiUrl = `http://www.omdbapi.com/?apikey=e9f54ad&s=${movieName}&type=movie`;
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
const searchSection = document.getElementById('search-section');
//RESULT SECTION ELEMENTS
const fetchPoster = document.getElementById('result-section');
const posterButtons = document.createElement('div');
posterButtons.classList.add('flex-container');
const fetchMoviePosterButton = document.createElement('a');
fetchMoviePosterButton.classList.add('button');
fetchMoviePosterButton.textContent = 'See Poster';
posterButtons.appendChild(fetchMoviePosterButton);
const switchMoviePosterButton = document.createElement('a');
switchMoviePosterButton.classList.add('button');
switchMoviePosterButton.textContent = 'Next';
posterButtons.appendChild(switchMoviePosterButton);
fetchPoster.appendChild(posterButtons);
//EVENT LISTENERS
fetchMoviePosterButton.addEventListener('click', fetchMoviePoster);
switchMoviePosterButton.addEventListener('click', fetchNextMoviePoster);
