// EVENT LISTENERS
function toggleHistoryOpen() {
  document.querySelector(".history").classList.toggle("open");
  const icon = document.querySelector("#history-toggle-icon");
  icon.className === "fa fa-angle-down"
    ? (icon.className = "fa fa-angle-up")
    : (icon.className = "fa fa-angle-down");
}

// API CALL
async function apiCall(passedSearch, result) {
  const key = "219eeebee89bb95abff246f577c10545";
  //   let searchResponse = {};
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${passedSearch}&appid=${key}`
  )
    .then((cityResponse) => {
      return cityResponse.status === 200
        ? cityResponse.json()
        : Promise.reject("No city was found with this name.");
    })
    .then((cityData) => {
      console.log(cityData);
      result.name = cityData.name;
      const cityLat = cityData.coord.lat;
      const cityLon = cityData.coord.lon;
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=${key}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          result.current = data.current;
          result.daily = data.daily;
        });
    })
    .catch((err) => window.alert(err));
}

const result = {};
apiCall("dallas", result);
console.log("result: ", result);
