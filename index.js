
// http://www.omdbapi.com/?apikey=[yourkey]&
// API key: f57e4cbb


// GLOBALS
let movieDataDict = {}


// DOM ELEMENTS
const moviesListContainer = document.getElementById("movies-list-container")
const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")
// const emptySearchDiv = document.getElementById("no-movies-search")


// UPDATE THE SEARCH RESULTS CONTAINER'S HTML BASED ON GLOBAL RESULTS DICTIONARY
function updateSearchListHtml() {
    let htmlStr = ""
    for (let i = 0; i < Object.keys(movieDataDict).length; i++) {
        htmlStr += `
            <div class="movie-card">
                <img class="card-img" src=${movieDataDict[i].Poster} alt="Poster not found" onerror="this.onerror=null; this.src='./images/movieReelIcon.png';">
                <div class="card-first-row">
                    <h3 class="card-title">${movieDataDict[i].Title}</h3>
                    <img class="imdb-icon" src="./images/imdbIcon.png">
                    <p class="regular-text">${movieDataDict[i].imdbRating}</p>
                </div>
                <div class="card-second-row">
                    <p class="regular-text">${movieDataDict[i].Runtime}</p>
                    <p class="regular-text">${movieDataDict[i].Genre}</p>
                    <button class="add-watchlist-btn regular-text" data-keyindex=${i}>
                        <img src="./images/plusIcon.png" data-keyindex=${i}>Watchlist
                    </button>
                </div>
                <p class="card-plot">${movieDataDict[i].Plot}</p>
            </div>
        `
    }
    moviesListContainer.innerHTML = htmlStr
}


// RESET SEARCH RESULTS CONTAINER'S HTML
function resetSearchContainerHtml() {
    moviesListContainer.innerHTML = `
        <div id="no-movies-search">
            <img src="./images/movieReelIcon.png">
            <h2>Search above to start exploring</h2>
        </div>
    `
}

// UPDATE SEARCH CONTAINER'S HTML IF SEARCH FAILS
function searchFailedHtml() {
    moviesListContainer.innerHTML = `
        <div class="failed-search">
            <h2>Unable to find what you're looking for. Please try another search.</h2>
        </div>
    `
}

// SHOW THAT SEARCH IS HAPPENING WITH SEARCH CONTAINER HTML
function searchUnderwayHtml() {
    moviesListContainer.innerHTML = `
        <div class="failed-search">
            <h2>Searching...</h2>
        </div>
    `
}

// CHANGE SEARCH INPUT PLACEHOLDER TEXT
function onEmptySearchField() {
    searchInput.placeholder = "Can't search for something with no data"
}

function revertSearchPlaceholder() {
    searchInput.placeholder="Search for a movie title"
}




// EVENT LISTENERS

// For add to watchlist buttons
moviesListContainer.addEventListener("click", function(e) {
    if (!e.target.dataset.keyindex) {
        return
    }
    const id = movieDataDict[e.target.dataset.keyindex].imdbID
    const data = movieDataDict[e.target.dataset.keyindex]
    localStorage.setItem(id, JSON.stringify(data))
    e.target.innerText = "Added!"
    e.target.classList.remove("add-watchlist-btn")
    e.target.classList.add("disabled-watchlist-btn")
    delete e.target.dataset.keyindex
})

// // For empty search div (to focus search bar)
// emptySearchDiv.addEventListener("click", function() {
//     searchInput.focus()
// })

// For main search button
searchBtn.addEventListener("click", function(e) {
    e.preventDefault()
    const movieSearchName = searchInput.value
    if (!movieSearchName) {
        onEmptySearchField()
        return
    }
    revertSearchPlaceholder()
    searchUnderwayHtml()
    getSearchIdsArrPromise(movieSearchName)
        .then(movieIdsArr => {
            if (!movieIdsArr) {
                return
            }
            let fetches = []
            movieIdsArr.forEach((movieId, index) => {
                fetches.push(
                    fetch(`http://www.omdbapi.com/?apikey=f57e4cbb&i=${movieId}`)
                        .then(res => res.json())
                        .then(movieData => {
                            movieDataDict[index] = movieData
                        })
                )
            })
            Promise.all(fetches).then(_ => {
                updateSearchListHtml()
            })
        })
})
    

// GET SEARCH RESULTS ARRAY (WITHIN A RETURNED PROMISE)
function getSearchIdsArrPromise(searchTerm) {
    return fetch(`http://www.omdbapi.com/?apikey=f57e4cbb&s=${searchTerm}&type=movie`)
        .then(res => res.json())
        .then(data => {
            if (!data.Search) {
                searchFailedHtml()
                return
            }
            let movieIds = []
            for (let movie of data.Search) {
                movieIds.push(movie.imdbID)
            }
            return movieIds
        })
}

