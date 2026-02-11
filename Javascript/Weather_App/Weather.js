const apiKey = "304061fc2534711e29aa708c99ceeaad";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.getElementById("city-input");
const searchBtn = document.querySelector("#weather-form button");
const weatherIcon = document.getElementById("weather-icon");
const weatherForm = document.getElementById("weather-form");

async function checkWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

        if (response.status == 404) {
            alert("Invalid city name");
            return;
        }

        var data = await response.json();

        document.getElementById("city").innerHTML = data.name;
        document.getElementById("temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.getElementById("humidity").innerHTML = data.main.humidity + "%";
        document.getElementById("wind").innerHTML = data.wind.speed + " km/h";

        const condition = data.weather[0].main.toLowerCase();

        if (condition.includes("clouds")) {
            weatherIcon.src = "images/clouds.png";
        } else if (condition.includes("clear")) {
            weatherIcon.src = "images/clear.png";
        } else if (condition.includes("rain")) {
            weatherIcon.src = "images/rain.png";
        } else if (condition.includes("drizzle")) {
            weatherIcon.src = "images/drizzle.png";
        } else if (condition.includes("mist")) {
            weatherIcon.src = "images/mist.png";
        } else if (condition.includes("snow")) {
            weatherIcon.src = "images/snow.png";
        }

        console.log(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

weatherForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (searchBox.value.trim() !== "") {
        checkWeather(searchBox.value);
    }
});


checkWeather("Mumbai");
