function initPage() {
  const inputEl = document.getElementById("city-input");
  const searchEl = document.getElementById("search-button");
  const clearEl = document.getElementById("clear-history");
  const nameEl = document.getElementById("city-name");
  const currentPicEl = document.getElementById("current-pic");
  const currentTempEl = document.getElementById("temperature");
  const currentHumidityEl = document.getElementById("humidity");
  const currentWindEl = document.getElementById("wind-speed");
  const historyEl = document.getElementById("history");
  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

  const APIKey = "f0b2c5f4179b10336e50a5c84bf88b95";
  function getWeather(cityName) {
    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      APIKey + "&units=imperial"
    fetch(queryURL)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      const currentDate = new Date(data.dt * 1000);
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      nameEl.innerHTML =
        data.name + " (" + month + "/" + day + "/" + year + ") ";
      let weatherPic = data.weather[0].icon;
      currentPicEl.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png"
      );
      currentPicEl.setAttribute("alt", data.weather[0].description);
      currentTempEl.innerHTML =
        "Temperature: " + data.main.temp + " &#176F";
      currentHumidityEl.innerHTML =
        "Humidity: " + data.main.humidity + "%";
      currentWindEl.innerHTML =
        "Wind Speed: " + data.wind.speed + " MPH";
      let cityID = data.id;
      let forecastQueryURL =
        "https://api.openweathermap.org/data/2.5/forecast?id=" +
        cityID +
        "&appid=" +
        APIKey + "&units=imperial";
      fetch(forecastQueryURL)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        const forecastEls = document.querySelectorAll(".forecast");
        for (i = 0; i < forecastEls.length; i++) {
          forecastEls[i].innerHTML = "";
          const forecastIndex = i * 8 + 4;
          const forecastDate = new Date(
            data.list[forecastIndex].dt * 1000
          );
          const forecastDay = forecastDate.getDate();
          const forecastMonth = forecastDate.getMonth() + 1;
          const forecastYear = forecastDate.getFullYear();
          const forecastDateEl = document.createElement("p");
          forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
          forecastDateEl.innerHTML =
            forecastMonth + "/" + forecastDay + "/" + forecastYear;
          forecastEls[i].append(forecastDateEl);
          const forecastWeatherEl = document.createElement("img");
          forecastWeatherEl.setAttribute(
            "src",
            "https://openweathermap.org/img/wn/" +
              data.list[forecastIndex].weather[0].icon +
              "@2x.png"
          );
          forecastWeatherEl.setAttribute(
            "alt",
            data.list[forecastIndex].weather[0].description
          );
          forecastEls[i].append(forecastWeatherEl);
          const forecastTempEl = document.createElement("p");
          forecastTempEl.innerHTML =
            "Temp: " +
            data.list[forecastIndex].main.temp +
            " &#176F";
          forecastEls[i].append(forecastTempEl);
          const forecastWindEl = document.createElement("p");
          forecastWindEl.innerHTML =
            "Wind: " + data.list[forecastIndex].wind.speed + " MPH";
          forecastEls[i].append(forecastWindEl);
          const forecastHumidityEl = document.createElement("p");
          forecastHumidityEl.innerHTML =
            "Humidity: " +
            data.list[forecastIndex].main.humidity +
            "%";
          forecastEls[i].append(forecastHumidityEl);
        }
      });
    })
  }

  searchEl.addEventListener("click", function () {
    const searchTerm = inputEl.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
  });

  clearEl.addEventListener("click", function () {
    searchHistory = [];
    renderSearchHistory();
  });

  function renderSearchHistory() {
    historyEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
      const historyItem = document.createElement("input");
      historyItem.setAttribute("type", "text");
      historyItem.setAttribute("style", "margin-bottom: 10px;");
      historyItem.setAttribute("readonly", true);
      historyItem.setAttribute("class", "form-control d-block bg-grey");
      historyItem.setAttribute("value", searchHistory[i]);
      historyItem.addEventListener("click", function () {
        getWeather(historyItem.value);
      });
      historyEl.append(historyItem);
    }
  }

  renderSearchHistory();
  if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
  }
}
initPage();
