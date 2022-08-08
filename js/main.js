var elTemplate = document.querySelector("#template").content;
var moviesArray = movies.slice(0, 20);
var elWrapper = document.querySelector(".movies_wrapper");
var elFoundMovie = document.querySelector(".more__info");
var elTitle = document.querySelector("#exampleModalLabel");
var elBody = document.querySelector(".modal-body");
var elResult = document.querySelector(".result");


function normolizeArray(array) {
    let normolize = [];

    for (const item of array) {
        let newItem = {};

        newItem.title = item.Title.toString();
        newItem.fullTitle = item.fulltitle;
        newItem.movieYear = item.movie_year;
        newItem.categories = item.Categories.split("|");
        newItem.summary = item.summary;
        newItem.id = item.imdb_id;
        newItem.rating = item.imdb_rating;
        newItem.img = `https://img.youtube.com/vi/${item.ytid}/mqdefault.jpg`
        newItem.videoURL = `https://www.youtube.com/watch?v=${item.ytid}`

        normolize.push(newItem)
    }

    return normolize
}


let normolizedArray = normolizeArray(moviesArray);

function renderCard(array, wrapper) {
    wrapper.innerHTML = null
    elResult.textContent = array.length

    let newFragment = document.createDocumentFragment()

    for (const item of array) {
        let movieCard = elTemplate.cloneNode(true);

        movieCard.querySelector(".card-img-top").src = item.img;
        movieCard.querySelector(".card__heading").textContent = item.title
        movieCard.querySelector(".movie__year").textContent = item.movieYear;
        movieCard.querySelector(".movie__rating").textContent = item.rating;
        movieCard.querySelector(".movie_category").textContent = item.categories;
        movieCard.querySelector(".movie__link").href = item.videoURL;
        movieCard.querySelector(".movie__link").setAttribute("target", "blank");
        movieCard.querySelector(".more__info").dataset.movieId = item.id

        console.log(movieCard);

        newFragment.appendChild(movieCard)
        wrapper.appendChild(newFragment)
    }


    return wrapper
}
renderCard(normolizedArray, elWrapper)


elWrapper.addEventListener("click", function (evt) {
    let clicked = evt.target.dataset.movieId
    moreMovie(normolizedArray, clicked)
})

function moreMovie(array, id) {
    let foundMovie = array.find(function (item) {
        console.log(item.id);
        return item.id == id
    })
    exampleModalLabel.textContent = foundMovie.title;
    elBody.textContent = foundMovie.summary
}