const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

const notfound = document.querySelector("[data-notfound]");

//initialaizaing  vairables

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessionStorage();

// tab switching function
function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        else{
            //if searchtab is first active then first deactive it and activate the  your weather tab
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //creating the function to get the cordnate automaticaly from the storage
            getfromSessionStorage();
        }
    }
}


//adding event listener to the tab buttons 
userTab.addEventListener("click", () => {
//pass clicked tab  as input parameter
switchTab(userTab);
});

searchTab.addEventListener("click", () => {
//pass clicked tab as input parameter
switchTab(searchTab);
});

//creating a function to check if coordinates are already present  in session storage

function  getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //if coordinates not found activting the grant access page 
        grantAccessContainer.classList.add("active");
    }
    else{
        //if coordinate are present then converting to the json file 
        const coordinates = JSON.parse(localCoordinates);

        //calling the function to fetch the user weather data 
        fetchUserWeatherInfo(coordinates);
    }
}

//creating a function to fetch the weather data for user 
async function  fetchUserWeatherInfo(coordinates){
    //getting coordinates and storing them into the varible
    const {lat, lon} = coordinates;
    //making grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //making loader visible 
    loadingScreen.classList.add("active");

    //apicall
    try{
       // fetching data through api call
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        
        //conveting response to json formate
        const data = await response.json();

        //deactivating the loading screen
        loadingScreen.classList.remove("active");
        //activating the userweather info container
        userInfoContainer.classList.add("active");
        //calling function to render the fetched data 
        renderWeatherInfo(data);



    }
    catch(err){
        loadingScreen.classList.remove("active");

    }
}

//creating a function that render the weather info to the screen 
function renderWeatherInfo(weatherInfo){
    //first we have to fetch requeried elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
 console.log(weatherInfo);
    //fetch values from weatherInfo object and put it ui elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `http://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText= weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °c`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;



}


//creating grant location button 

//creating getlocation function 
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
       // alert("No loction supported");
    }
}
// creating showposition function
function showPosition(position){
    //getting the coordinates
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    // storeing the coordinates in the session
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));


    //calling the fetch data function 
    fetchUserWeatherInfo(userCoordinates);
}


const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);


//creating for the search 
const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    
    // if (cityName === "")
    //     return;
    // else
        fetchSearchWeatherInfo(cityName);
    
});


//creating a function to fetch the search weather info 
async function  fetchSearchWeatherInfo(city) {
                    
    
          loadingScreen.classList.add("active");
          userInfoContainer.classList.remove("active");
          grantAccessContainer.classList.remove("active");

     try{
           const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?&q=${city}&appid=${API_KEY}&units=metric`);
           const data = await response.json();
           loadingScreen.classList.remove("active");
             userInfoContainer.classList.add("active");
             renderWeatherInfo(data);
             
}
catch(err){
    loadingScreen.classList.remove("active");

    // Display an error image or message when an error occurs
    const errorImage = document.createElement("img");
    errorImage.src = "/assets/not-found.png"; // Replace with the path to your error image
    errorImage.alt = "Error Image";
    notfound.innerHTML = ""; // Clear previous content
    notfound.appendChild(errorImage);
    notfound.classList.add("active");
}
}