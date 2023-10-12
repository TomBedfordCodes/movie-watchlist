
// DOM ELEMENTS
const moviesListContainer = document.getElementById("movies-list-container2")
const noMoviesContainer = document.getElementById("no-movies-container")


// ON PAGE STARTUP
updateWatchlistHtml()



// UPDATE WATCHLIST CONTAINER'S HTML BASED ON LOCALSTORAGE
function updateWatchlistHtml() {
    if (Object.keys(localStorage).length <= 0) {
        noMoviesContainer.style.display = "flex"
        return
    } else if (Object.keys(localStorage).length === 1 && Object.keys(localStorage)[0] === "deckId") {
        noMoviesContainer.style.display = "flex"
        return
    }
    moviesListContainer.hidden = false
    noMoviesContainer.style.display = "none"
    let htmlStr = ""
    for (let key of Object.keys(localStorage)) {
        if (key === "deckId") {
            continue
        }
        const movie = JSON.parse(localStorage.getItem(key))
        htmlStr += `
            <div class="movie-card">
                <img class="card-img" src=${movie.Poster} alt="Poster not found" onerror="this.onerror=null; this.src='./images/movieReelIcon.png';">
                <div class="card-first-row">
                    <h3 class="card-title">${movie.Title}</h3>
                    <img class="imdb-icon" src="./images/imdbIcon.png">
                    <p class="regular-text">${movie.imdbRating}</p>
                </div>
                <div class="card-second-row">
                    <p class="regular-text">${movie.Runtime}</p>
                    <p class="regular-text">${movie.Genre}</p>
                    <button class="add-watchlist-btn regular-text" data-keyindex=${key}>
                        <img src="./images/minusIcon.png" data-keyindex=${key}>Remove
                    </button>
                </div>
                <p class="card-plot">${movie.Plot}</p>
            </div>
        `
    }
    moviesListContainer.innerHTML = htmlStr
}



// EVENT LISTENER FOR REMOVE FROM WATCHLIST BUTTONS
moviesListContainer.addEventListener("click", function(e) {
    if (!e.target.dataset.keyindex) {
        return
    }
    const key = e.target.dataset.keyindex
    if (!localStorage.getItem(key)) {
        return
    }
    localStorage.removeItem(key)
    if (e.target.nodeName === "IMG") {
        const card = e.target.parentElement.parentElement.parentElement
        card.parentElement.removeChild(card)
    } else {
        const card = e.target.parentElement.parentElement
        card.parentElement.removeChild(card)
    }
    if (moviesListContainer.children.length <= 0) {
        noMoviesContainer.style.display = "flex"
        moviesListContainer.hidden = true
    }
})






