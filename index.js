let moviename='';
let arr = [];
let addArray = [];
const displaySearch = document.getElementById('searchbar') 
const displayMovie = document.getElementById('movieDetail-container')
const inputMovieName = document.getElementById('searchanything');
const displaymovies = document.getElementById('display-searched-movie');
const favm = document.getElementById('fav-movie');
function fetchMovieName(){
    inputMovieName.addEventListener('input',async ()=>{
        moviename = inputMovieName.value;
        const apiKey = `https://www.omdbapi.com/?s=${moviename}&page=1&apikey=db462611`; 
        await fetch(apiKey)
        .then(response => response.json())
        .then(data => {
            if(data.Search){
                
                data.Search.forEach(item =>{
                    arr.push(item);
                    
                })
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        showMovieName();
        
    })
}
fetchMovieName();
function showMovieName(){
    const htmlContent = arr.map(item =>{
        
        return(`<div class='items' id=${item.imdbID}>
        
            <div class="post">
                <img  class="poster" src=${item.Poster}>
            </div>
            <div class="title-box">
            <h3 class="margn">Title:${item.Title}</h3>
            <p class="margn">Year:${item.Year}</p>
            <h5 class="margn">Ratting:N/A</h5>
            </div>    
        </div>`)});
    if(inputMovieName.value!=''){
        displaymovies.innerHTML = htmlContent;
        arr =[]
        const itemElements = displaymovies.querySelectorAll('.items');
        itemElements.forEach(itemElement => {
            itemElement.addEventListener('click', () => {
                // console.log(itemElement.id);
                showDetailsOfMovie(`${itemElement.id}`);
            });
        });
    }
    else{
        displaymovies.innerHTML =''
    }
    
}
async function showDetailsOfMovie(id){
    const result = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=bfd6b563`)
                        .then(response => response.json())
                        .then(data=>{
                           return  data;
                        })
                        .catch(error=>{
                            console.error(error);
                        })
    // console.log(movieDetails);
    
    displayMovieDetails(result);
    
}
function togglethePage(){
    if(displaySearch.style.display!== "none"){
        displaySearch.style.display = "none";
        displaymovies.style.display='none'
        displayMovie.style.display = "flex";
    }
    else{
        displaySearch.style.display = "flex";
        displayMovie.style.display = "none";
        displaymovies.innerHTML=''
        displaymovies.style.display='flex'
        inputMovieName.value=''
    }
}
function displayMovieDetails(moviedetails){
    const movie = {
        title:moviedetails.Title,
        year:moviedetails.Year,
        id:moviedetails.imdbID,
        poster:moviedetails.Poster
    }
    const movieElement = JSON.stringify(movie)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
     displayMovie.innerHTML = 
       `<div class="movie">
            <img id='img-movie' src=${moviedetails.Poster} alt="imgae not found">
            <div id='details'>
                <div id='addtocard'>
                <h3>Title:${moviedetails.Title}</h3>
                <h3><i class="fa-solid fa-bookmark" style="color: #43d067;" onclick="addToFavourite('${movieElement}')"></i></h3>
                </div>
                <h3>Actor:${moviedetails.Actors}</h3>
                <p>Released:${moviedetails.Released}</p>
                <h5>Director:${moviedetails.Director}</h5>
                <p>Details:Writer:${moviedetails.Writer},Awards:${moviedetails.Awards},BoxOffice:${moviedetails.Boxoffice},</p>
                <h3>IMDB rating:${moviedetails.imdbRating} </h3>
                <span>Votes:${moviedetails.imdbVotes}</span>
            </div>
        </div>
        <button onclick="togglethePage()" style=" position: relative;top:4rem;">Back Home</button>
       `
       togglethePage();  
}
async function addToFavourite(a){
    alert('movie add to favourite successfully')
    const localdata = localStorage.getItem('favmovie');
    if(localdata === null && localdata!==[]){
        addArray.push(a);
        const data = JSON.stringify(addArray);
        localStorage.setItem('favmovie',data)
    }
    else{
        addArray = [];
        if(localdata!=='undefined'){
            JSON.parse(localdata).forEach(item=>addArray.push(item));  
            addArray.unshift(a);
            const data = JSON.stringify(addArray);
            localStorage.setItem('favmovie',data)
        }
        
    }
}
function getitemfromLocal(){
    const item = localStorage.getItem('favmovie');
    if(item!==[]){
        const load = JSON.parse(item);
        const saved = load.map((items)=>{
            const ite = JSON.parse(items)
            if(ite!== ''){
                return (
                    `<div class="insert-fav">
                        <div style="width:40%">
                            <img class='img-movie' src='${ite.poster}'>
                        </div>
                        <div style="width:60%;height:4rem">
                            <div style="display:flex; height:1.5rem;justify-content:space-between;align-items:center">
                                <p>${ite.title}</p>
                                <h3><i class="fa-solid fa-trash" style="color: #a01c1c;" onclick="deletefavMovie('${ite.id}')"></i></h3>
                            </div>
                            <p>${ite.year}</p>
                        </div>
                    </div>
                    `)
            }
        })
        favm.innerHTML = saved.join();
    }
}
async function deletefavMovie(id){
    alert('movie delete from fav list')
    const localfetchdata = localStorage.getItem('favmovie');
    if(localfetchdata!== null && localfetchdata!==[] ){
        const lcdata = JSON.parse(localfetchdata).filter((item)=>(JSON.parse(item).id!==id))
        console.log(lcdata);
        const insertdata = JSON.stringify(lcdata)
        localStorage.setItem('favmovie',insertdata);
    }
    getitemfromLocal();   
}