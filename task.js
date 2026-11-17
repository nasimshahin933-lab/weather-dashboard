

let cityInput = document.getElementById("cityInput");

let searchBtn = document.getElementById("searchBtn");

let weatherCard = document.getElementById("weatherCard");

let loading = document.getElementById("loading");

let errorMsg = document.getElementById("errorMsg");

let favoritesList = document.getElementById("favoritesList");
   




let themeBtn = document.getElementById("themeBtn");

let forecastList = document.getElementById("forecastList");
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}





const API_KEY="85e86972e21be2e20ee02d8978f55bdb"

async function getWeather(city){

let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

let response =await fetch(url)
if (!response.ok){
    throw new Error("city is not found")
}
let data= await response.json();
return {
    city: data.name,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed
}

}
async function getForecast(city) {

    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    let response = await fetch(url);

    if (!response.ok) {
        throw new Error("Forecast not found");
    }

    let data = await response.json();

    return data.list;
}
function displayFavorites() {
    favoritesList.innerHTML = "";

    favorites.forEach(city => {
        favoritesList.innerHTML += `
            <div class="favorite-item">
                <span>${city}</span>
                <button onclick="removeFavorite('${city}')">
                    
                </button>
            </div>
        `
    })
}

function removeFavorite(city) {
    favorites = favorites.filter(item => item !== city);

    saveFavorites();
    displayFavorites();
}

    searchBtn.addEventListener("click", async () => {

    let city = cityInput.value.trim();

    try {
        if (!city) {
            throw new Error("Please enter a city name");
        }

        loading.style.display = "block";

        let weather = await getWeather(city);
        let favoriteBtn = document.createElement("button");

favoriteBtn.textContent = " Add to Favorites";

favoriteBtn.onclick = () => {
    if (!favorites.includes(weather.city)) {
        favorites.push(weather.city);
        saveFavorites();
        alert("Added to favorites!");
    } else {
        alert("Already in favorites!");
    }
};
displayFavorites();
weatherCard.appendChild(favoriteBtn);
        let forecast = await getForecast(city)
        let dailyForecast = forecast.filter((item, index) => index % 8 === 0);

forecastList.innerHTML = "";

dailyForecast.forEach(item => {
    let date = new Date(item.dt * 1000).toLocaleDateString();

    forecastList.innerHTML += `
        <div class="forecast-card">
            <h4>${date}</h4>
            <p>${item.weather[0].description}</p>
            <h3>${Math.round(item.main.temp)}°C</h3>
        </div>
    `;
});
        weatherCard.style.display = "block";

        weatherCard.innerHTML = `
            <h2>${weather.city}</h2>
            <h1>${weather.temp}°C</h1>
            <p>${weather.description}</p>
            <p>Feels Like: ${weather.feelsLike}°C</p>
            <p>Humidity: ${weather.humidity}%</p>
            <p>Wind Speed: ${weather.windSpeed}</p>
        `;

        errorMsg.style.display = "none";

    } catch (error) {
        errorMsg.style.display = "block";
        errorMsg.textContent = error.message;
        weatherCard.style.display = "none";

    } finally {
        loading.style.display = "none";
    }
});