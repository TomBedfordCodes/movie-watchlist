
// DOM ELEMENTS
const watchlistMoviesContainer = document.getElementById("movies-list-container2")
const noMoviesContainer = document.getElementById("no-movies-container")


// GLOBALS
let localStoreWatchlistDict = {}
const localStoreWatchlistKey = "movieWatchlist"




// ON PAGE STARTUP
updateWatchlistHtml()



// UPDATE WATCHLIST CONTAINER'S HTML BASED ON LOCALSTORAGE
function updateWatchlistHtml() {
    localStoreWatchlistDict = JSON.parse(localStorage.getItem(localStoreWatchlistKey))
    if (Object.keys(localStoreWatchlistDict).length <= 0) {
        localStoreWatchlistDict = {}
        noMoviesContainer.style.display = "flex"
        return
    }
    // if (Object.keys(localStorage).length <= 0) {
    // if (JSON.parse(localStorage.getItem(localStoreKey)).length <= 0) {
    //     noMoviesContainer.style.display = "flex"
    //     return
    // } else if (Object.keys(localStorage).length === 1 && 
    //         Object.keys(localStorage)[0] === "deckId" || 
    //         Object.keys(localStorage)[0] ==="firebase:host:editbookpro-d9930-default-rtdb.europe-west1.firebasedatabase.app") {
    //     noMoviesContainer.style.display = "flex"
    //     return
    // }
    watchlistMoviesContainer.hidden = false
    noMoviesContainer.style.display = "none"
    let htmlStr = ""
    // for (let key of Object.keys(localStorage)) {
        // if (key === "deckId") {
        //     continue
        // }
    // for (let key of JSON.parse(localStorage.getItem(localStoreKey))) {
    for (let key of Object.keys(localStoreWatchlistDict)) {
        const movie = localStoreWatchlistDict[key]
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
    watchlistMoviesContainer.innerHTML = htmlStr
}



// EVENT LISTENER FOR REMOVE FROM WATCHLIST BUTTONS
watchlistMoviesContainer.addEventListener("click", function(e) {
    if (!e.target.dataset.keyindex) {
        return
    }
    const key = e.target.dataset.keyindex
    // if (!localStorage.getItem(key)) {
    if (!localStoreWatchlistDict[key]) {
        return
    }
    // localStorage.removeItem(key)
    delete localStoreWatchlistDict[key]
    localStorage.setItem(localStoreWatchlistKey, JSON.stringify(localStoreWatchlistDict))
    if (e.target.nodeName === "IMG") {
        const card = e.target.parentElement.parentElement.parentElement
        card.parentElement.removeChild(card)
    } else {
        const card = e.target.parentElement.parentElement
        card.parentElement.removeChild(card)
    }
    if (watchlistMoviesContainer.children.length <= 0) {
        noMoviesContainer.style.display = "flex"
        watchlistMoviesContainer.hidden = true
    }
})






