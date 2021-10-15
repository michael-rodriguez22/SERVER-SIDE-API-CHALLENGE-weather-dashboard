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
function renderPage(data) {}

// MAKE API CALL AND UPDATE STORAGE / DISPLAY DATA
async function apiCall(passedSearch) {
  const key = "219eeebee89bb95abff246f577c10545";
  let result = {};
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
      //   console.log(cityData);
      result.name = cityData.name;
      LS.saveCity(result.name);
      const cityLat = cityData.coord.lat;
      const cityLon = cityData.coord.lon;
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=${key}`
      )
        .then((response) => response.json())
        .then((data) => {
          //   console.log(data);
          result.current = data.current;
          result.daily = data.daily;
          console.log(result);
        });
    })
    .catch((err) => {
      document.getElementById("invalid-message-el").innerText = err;
      console.log(err);
    });
}
