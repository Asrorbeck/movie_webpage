var elTemplate = document.querySelector("#template").content;
var moviesArray = movies.slice(0, 20);
var elWrapper = document.querySelector(".movies_wrapper");
var elFoundMovie = document.querySelector(".more__info");
var elTitle = document.querySelector("#exampleModalLabel");
var elBody = document.querySelector(".modal-body");
var elResult = document.querySelector(".result");
var elSelect = document.querySelector(".movie__select");
var elForm = document.querySelector(".main-form");
var elBookmarkedList = document.querySelector(".bookmarked-list");
var elYear = document.querySelector(".movie__year");
var elRating = document.querySelector(".movie__rating");

let bookmarkedMovies = []

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
        movieCard.querySelector(".btn-bookmarked").dataset.bookmarkedId = item.id
        
        
        newFragment.appendChild(movieCard)
    }
    wrapper.appendChild(newFragment)
    
}
renderCard(normolizedArray, elWrapper)




elWrapper.addEventListener("click", function (evt) {
    let currentId = evt.target.dataset.movieId
    if (currentId) {
        let foundMovie = normolizedArray.find(function(item) {
            return item.id == currentId
        })
        elTitle.textContent = foundMovie.title;
        elBody.textContent = foundMovie.summary;
    }
})




function generateCategory(array) {
    let newCategoryArray = []
    
    for (const item of array) {
        let categoryArray = item.categories
        for (const itemCategory of categoryArray) {
            if (!newCategoryArray.includes(itemCategory)) {
                newCategoryArray.push(itemCategory)
                
            }
        }
    }
    return newCategoryArray
    
}

generateCategory(normolizedArray)
let categoryList = generateCategory(normolizedArray)


function renderCategory(array, wrapper) {
    let fragment = document.createDocumentFragment()
    
    for (const item of array) {
        let newOption = document.createElement("option");
        newOption.textContent = item;
        newOption.value = item;
        
        fragment.appendChild(newOption)
    }
    
    wrapper.appendChild(fragment)
}

renderCategory(categoryList, elSelect);



elWrapper.addEventListener("click", function (evt) {
    let currentId = evt.target.dataset.bookmarkedId
    
    if (currentId) {
        let foundMovie = normolizedArray.find(function(item) {
            return item.id == currentId
        })
        
        
        if (bookmarkedMovies.length == 0) {
            bookmarkedMovies.unshift(foundMovie); 
        }else {
            let check = false;
            for (const item of bookmarkedMovies) {
                if (item.id == currentId) {
                    check = true
                }
            }
            
            if (!check) {
                bookmarkedMovies.unshift(foundMovie); 
            }
        }
        console.log(bookmarkedMovies);
        renderBookmarked(bookmarkedMovies, elBookmarkedList)
    }
    
    function renderBookmarked(array, wrapper) {
        wrapper.innerHTML = null;
        
        let mainFragment = document.createDocumentFragment();
        
        for (const item of array) {
            let newLi = document.createElement("li");
            newLi.classList = "list-group-item p-3";
            
            let newH4 = document.createElement("h4")
            newH4.textContent = item.title
            newH4.classList = "d-inline-block text-truncate h5";
            newH4.style.maxWidth = "100%";
            
            let btnWrapper = document.createElement("div");
            btnWrapper.classList = "btn-wrapper d-flex align-items-center justify-content-between";
            
            
            let newBtn = document.createElement("button");
            newBtn.classList = "btn btn-danger d-block";
            newBtn.textContent = "Remove"
            newBtn.dataset.RemoveId = item.id
            
            let newBtn1 = document.createElement("a");
            newBtn1.classList = "btn btn-success movie__link"
            newBtn1.href = item.videoURL
            newBtn1.setAttribute("target", "blank")
            newBtn1.textContent = "Watch trailer"
            
            let newBtn2 = document.createElement("button");
            newBtn2.classList = "btn btn-primary more__info";
            newBtn2.textContent = "More info";
            newBtn2.dataset.movieId = item.id;
            newBtn2.dataset.bsToggle = "modal";
            newBtn2.dataset.bsTarget = "#exampleModal";

            
            newBtn2.addEventListener("click", function (evt) {
                let currentId = newBtn2.dataset.movieId;
                if (currentId) {
                    let foundMovie = normolizedArray.find(function(item) {
                        return item.id == currentId
                    })
                    elTitle.textContent = foundMovie.title;
                    elBody.textContent = foundMovie.summary;
                }
            })
            
            newBtn.addEventListener("click", function (evt) {
                newLi.remove()
                let removeBtn = evt.target.dataset.RemoveId
                console.log(removeBtn);
                bookmarkedMovies.shift(removeBtn)
            })
            
            btnWrapper.appendChild(newBtn)
            btnWrapper.appendChild(newBtn1)
            btnWrapper.appendChild(newBtn2)
            
            newLi.appendChild(newH4);
            newLi.appendChild(btnWrapper);
            
            mainFragment.appendChild(newLi)
        }
        
        wrapper.appendChild(mainFragment);
    }
})

elForm.addEventListener("submit", function (evt) {
    evt.preventDefault()
    
    let inputYear = elYear.value.trim();
    let inputRating = elRating.value.trim()
    let inputSelect = elSelect.value.trim();
    
    console.log(inputRating, inputSelect, inputYear);
    
    
    let filteredMovies = normolizedArray.filter(function (item) {
        let select = inputSelect == "all" ? true : item.categories.includes(inputSelect);
        
        let validation = item.rating >= inputRating && item.movieYear >= inputYear && select
        
        return validation
    })
    
    renderCard(filteredMovies)
})


