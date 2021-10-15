// UTILITY / GENERAL
citySearchEl = document.getElementById("city-search");

function searchHandler() {
  apiCall(citySearchEl.value);
}

citySearchEl.addEventListener("keypress", (e) =>
  e.key === "Enter" ? searchHandler() : 0
);

function toggleHistoryOpen() {
  LS.renderHistory();
  document.querySelector(".history").classList.toggle("open");
  const icon = document.querySelector("#history-toggle-icon");
  icon.className === "fa fa-angle-down"
    ? (icon.className = "fa fa-angle-up")
    : (icon.className = "fa fa-angle-down");
}

function formatDate(unixDT) {
  return new Date(unixDT * 1000).toLocaleDateString();
}

function iconToUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@4x.png`;
}

// INTERFACE WITH LOCAL STORAGE
LS = {
  key: "SERVER-SIDE-API-CHALLENGE-weather-dashboard-mikeyrod22",
  renderHistory: function () {
    let historyItemsEl = document.querySelector(".history-items");
    while (historyItemsEl.firstChild)
      historyItemsEl.removeChild(historyItemsEl.firstChild);
    JSON.parse(localStorage.getItem(this.key)).forEach((city) => {
      let button = document.createElement("button");
      button.innerText = city;
      button.onclick = () => apiCall(city);
      button.className = "search_button";
      document.querySelector(".history-items").appendChild(button);
    });
  },
  saveCity: function (cityName) {
    let store = JSON.parse(localStorage.getItem(this.key)) || [];
    store = store.filter((item) => item !== cityName);
    store.unshift(cityName);
    localStorage.setItem(this.key, JSON.stringify(store));
    this.renderHistory();
  },
  clearStorage: function () {
    localStorage.setItem(this.key, JSON.stringify([]));
    this.renderHistory();
  },
};

// DISPLAY DATA TO PAGE
function renderUV(uvIndex) {
  let color;
  if (uvIndex < 3) color = "#8DC443";
  else if (uvIndex > 3 && uvIndex < 6) color = "#FDD835";
  else if (uvIndex > 6 && uvIndex < 8) color = "#FFB301";
  else color = "#D1394A";

  return `<li>UV Index: <span style="background-color: ${color};" class="uv-span">${uvIndex}</span></li>`;
}

function renderFiveDayItem(data) {
  let div = document.createElement("div");
  div.className = "five-day-item";
  div.innerHTML = `
      <h3>${formatDate(data.dt)}<h3>
      <img src="${iconToUrl(data.weather[0].icon)}" />
      <p>Temp: ${Math.floor(data.temp.day)}°F</p>
      <p>Wind: ${Math.floor(data.wind_speed)}MPH</p>
      <p>Humidity: ${data.humidity}%</p>  
    `;
  document.getElementById("five-day-wrapper").appendChild(div);
}

function renderPage(data) {
  // today's forecast
  document.getElementById("current-day-h1").innerText = `
  ${data.name} ${formatDate(data.current.dt)}
  `;
  document.getElementById("current-day-icon").src = iconToUrl(
    data.current.weather[0].icon
  );
  document.getElementById(
    "current-temp"
  ).innerText = `Temperature: ${Math.floor(data.current.temp)}°F`;
  document.getElementById("current-wind").innerText = `Wind: ${Math.floor(
    data.current.wind_speed
  )} MPH`;
  document.getElementById(
    "current-humidity"
  ).innerText = `Humidity: ${data.current.humidity}%`;
  document.getElementById("current-uv").innerHTML = renderUV(data.current.uvi);

  // five day forecast
  document.getElementById("five-day-wrapper").innerHTML = "";
  for (let i = 1; i < 6; i++) renderFiveDayItem(data.daily[i]);

  // display page
  document.getElementById("forecast").style.display = "unset";
}

// MAKE API CALL AND UPDATE STORAGE / DISPLAY DATA
async function apiCall(passedSearch) {
  const key = "4931892c7d3eaa85553448497029548d";
  let searchResult = {};
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${passedSearch}&appid=${key}`
  )
    .then((cityResponse) => {
      if (cityResponse.status === 200) {
        citySearchEl.value = "";
        document.getElementById("invalid-message-el").innerText = "";
        return cityResponse.json();
      } else {
        return Promise.reject("No results were found for this search...");
      }
    })
    .then((cityData) => {
      searchResult.name = cityData.name;
      LS.saveCity(searchResult.name);
      const cityLat = cityData.coord.lat;
      const cityLon = cityData.coord.lon;
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&units=imperial&exclude=minutely,hourly,alerts&appid=${key}`
      )
        .then((response) => response.json())
        .then((data) => {
          searchResult.current = data.current;
          searchResult.daily = data.daily;
          console.log("Search Result:", searchResult);
          renderPage(searchResult);
        });
    })
    .catch((err) => {
      document.getElementById("invalid-message-el").innerText = err;
      console.log(err);
    });
}
