

const API_URL =
"https://api.themoviedb.org/3/discover/movie?&with_cast=&api_key=6b4357c41d9c606e4d7ebe2f4a8850ea";
const IMG_PATH = "https://image.tmdb.org/t/p/w500";
const SEARCH_API =
"https://api.themoviedb.org/3/search/movie?api_key=1cf50e6248dc270629e802686245c2c8";
const img_path = "https://image.tmdb.org/t/p/original";
const main = document.getElementById("porco");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");
const genres = [
{
  "id": 28,
  "name": "Hành động"
},
{
  "id": 12,
  "name": "Phiêu lưu"
},
{
  "id": 16,
  "name": "Hoạt hình"
},
{
  "id": 35,
  "name": "Hài kịch"
},
{
  "id": 80,
  "name": "Tội phạm"
},
{
  "id": 99,
  "name": "Tài liệu"
},
{
  "id": 18,
  "name": "Kịch"
},
{
  "id": 10751,
  "name": "Gia đình"
},
{
  "id": 14,
  "name": "Tưởng tượng"
},
{
  "id": 36,
  "name": "Lịch sử"
},
{
  "id": 27,
  "name": "Kinh dị"
},
{
  "id": 10402,
  "name": "Âm nhạc"
},
{
  "id": 9648,
  "name": "Bí ẩn"
},
{
  "id": 10749,
  "name": "Lãng mạn"
},
{
  "id": 878,
  "name": "Khoa học viễn tưởng"
},
{
  "id": 10770,
  "name": "Truyền hình"
},
{
  "id": 53,
  "name": "Giật gân"
},
{
  "id": 10752,
  "name": "Chiến tranh"
},
{
  "id": 37,
  "name": "Miền Viễn Tây"
}
]
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');
var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var navBar = document.getElementById("wrapper");
var lastUrl = '';
var totalPages = 1000;
const IMDB = "https://www.imdb.com/title/tt1";
var selectedGenre = []
const requests = {
  fetchNetflixOrignals:`https://api.apipop.net/list?sort=seeds&short=1&cb=&quality=720p,1080p,3d&page=1&ver=100.0.0.0.&os=windows&app_id=T4P_ONL` ,
};
var banner = document.getElementById("banner");
var banner_title = document.getElementById("banner__title");
var banner_button = document.getElementById("banner__button")
var banner__desc = document.getElementById("banner__description");

function color(){
navBar.classList.toggle("active")
}
setInterval(() => {
fetch(requests.fetchNetflixOrignals)
.then((res) => res.json())
.then((data) => {
  console.log(data.MovieList);
  
  const setMovie = data.MovieList[Math.floor(Math.random() * data.MovieList.length - 1)];
  
  console.log(setMovie);
  
  banner.style.backgroundImage = "url(" + setMovie.poster_big + ")";
  banner_button.href = "http://www.imdb.com/title/" + setMovie.imdb;
  banner__desc.innerText = setMovie.year;
  banner_title.innerText = setMovie.title;
});
}, 3000);




getMovies(API_URL);

async function getMovies(url) {
const res = await fetch(url);
const data = await res.json();

showMovies(data.results);
console.log (data.results)

}
function getMovies(url){
lastUrl = url;
fetch(url).then(res => res.json()).then(data => {
  console.log(data.results)
  if(data.results.length !== 0){
      showMovies(data.results);
      currentPage = data.page;
      nextPage = currentPage + 1;
      prevPage = currentPage - 1;
      totalPages = data.total_pages;

      current.innerText = currentPage;

      if(currentPage <= 1){
        prev.classList.add('disabled');
        next.classList.remove('disabled')
      }else if(currentPage>= totalPages){
        prev.classList.remove('disabled');
        next.classList.add('disabled')
      }else{
        prev.classList.remove('disabled');
        next.classList.remove('disabled')
      }

      tagsEl.scrollIntoView({behavior : 'smooth'})

  }
 
})
}

prev.addEventListener('click', () => {
if(prevPage > 0){
  pageCall(prevPage);
}
})

next.addEventListener('click', () => {
if(nextPage <= totalPages){
  pageCall(nextPage);
}
})

function pageCall(page){
let urlSplit = lastUrl.split('?');
let queryParams = urlSplit[1].split('&');
let key = queryParams[queryParams.length -1].split('=');
if(key[0] != 'page'){
  let url = lastUrl + '&page='+page
  getMovies(url);
}else{
  key[1] = page.toString();
  let a = key.join('=');
  queryParams[queryParams.length -1] = a;
  let b = queryParams.join('&');
  let url = urlSplit[0] +'?'+ b
  getMovies(url);
}
}

setGenre();
function setGenre() {
  tagsEl.innerHTML= '';
  genres.forEach(genre => {
      const t = document.createElement('div');
      t.classList.add('tag');
      t.id=genre.id;
      t.innerHTML=genre.name;
      t.addEventListener('click', () => {
          if(selectedGenre.length == 0){
              selectedGenre.push(genre.id);
          }else{
              if(selectedGenre.includes(genre.id)){
                  selectedGenre.forEach((id, idx) => {
                      if(id== genre.id){
                          selectedGenre.splice(idx, 1);
                      }
                  })
              }else{
                  selectedGenre.push(genre.id);
              }
          }
          console.log(selectedGenre)
          getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')))
          highlightSelection()
      })
      tagsEl.append(t);
  })
}
function highlightSelection() {
const tags = document.querySelectorAll('.tag');
tags.forEach(tag => {
    tag.classList.remove('highlight')
})
clearBtn()
if(selectedGenre.length !=0){   
    selectedGenre.forEach(id => {
        const hightlightedTag = document.getElementById(id);
        hightlightedTag.classList.add('highlight');
    })
}

}
function clearBtn(){
let clearBtn = document.getElementById('clear');
if(clearBtn){
    clearBtn.classList.add('highlight')
}else{
        
    let clear = document.createElement('div');
    clear.classList.add('tag','highlight');
    clear.id = 'clear';
    clear.innerText = 'Xóa';
    clear.addEventListener('click', () => {
        selectedGenre = [];
        setGenre();            
        getMovies(API_URL);
    })
    tagsEl.append(clear);
}

}
function like(id,x){
 x.classList.toggle("fa-heart");
  console.log(id)
}
function showMovies(movies) {
main.innerHTML = "";

movies.forEach((movie) => {
  const { title, poster_path, rating, runtime, vote_average, genre_ids, id,original_language,release_date } = movie;

  const movieEl = document.createElement("div");
  movieEl.classList.add("col-xl-2");
  movieEl.classList.add("col-sm-6");
  movieEl.classList.add("mb-2");
  movieEl.innerHTML = `
                      <div class="video-card">
                         <div class="video-card-image">
                            <a class="play-icon" href="https://www.themoviedb.org/movie/${id}/" target="_blank"><i class="fa fa-play-circle"></i></a>
                            <a href="#"><img class="img-fluid" src="https://image.tmdb.org/t/p/original${poster_path}"  alt="${title}"></a>
                            <span class="movierating movierating">
                            <button class="favourite"><i onclick="like(${id},this)" class="fa  fa-thumbs-up" ></i></button>
                            
                            </span>
                         </div>
                         <div class="video-card-body">
                            <div class="video-title">
                               <a href="https://www.themoviedb.org/movie/${id}/" target="_blank">${title}</a>
                            </div>
                            <div class="video-view">
                               ${
                                release_date
                               }<span style="float:right;">${vote_average}</span> 
                            </div>
                         </div>
                      </div>
      `;
  main.appendChild(movieEl);
  
  
  
});

}

form.addEventListener('submit', (e) => {
e.preventDefault();

const searchTerm = search.value;
tags.style.display ="none";
if(searchTerm) {
    getMovies(SEARCH_API+'&query='+searchTerm)
}else{
    getMovies(API_URL);
}

})
// const addLikes = (title, id, rating, poster_path,  release_date) => {
//   const movieToBeAdded = {
//      movieTitle: title,
//      movieId: id,
//      movieRating: rating,
//      moviePoster: poster_path,
//      movieRelease:  release_date,
// };if (localStorage.Likes === undefined) {
//   localStorage.setItem("Likes", JSON.stringify([]));
// }const data_likes = localStorage.getItem("Likes");
// const response_likes = JSON.parse(data_likes);
// const indexOfQuery = response_likes.findIndex((movie) => id === movie.movieId);
//    if (indexOfQuery < 0) {
//       response_likes.push(movieToBeAdded);
//    }
//    localStorage.setItem("Likes", JSON.stringify(response_likes));
// };

// const removeLikes = (id) => {
//   const data_likes = localStorage.getItem("Likes");
//   const response_likes = JSON.parse(data_likes);

//   // Check if the id of the movie exists in the local storage array
//   const indexOfQuery = response_likes.findIndex((movie) => id === movie.movieId);

//   // Remove the index of the id from local storage
//   // Check if the indexQuery exists (not -1)
//   if (indexOfQuery > -1) {
//      response_likes.splice(indexOfQuery, 1);
//   }

//   // Store to local storage
//   localStorage.setItem("Likes", JSON.stringify(response_likes));
// };





