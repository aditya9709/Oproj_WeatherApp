// DOM Module Pattern
const domManip = (() => {
  const searchButton = document.querySelector(".search-button");
  const clearButton = document.querySelector(".reset-button");
  searchButton.addEventListener("click", handleSearch);
  clearButton.addEventListener("click", clearSearch);
  document.addEventListener("DOMContentLoaded", hideBrokenImg);
})();

async function handleSearch() {
  const searchCity = document.getElementById("search-city").value;
  const searchState = document.getElementById("search-state").value;
  const searchCountry = document.getElementById("search-country").value;

  if (!searchCity || !searchCountry) {
    alert("City and Country are required. Please try again!");
    return;
  }

  try {
    const currentWeather = await fetchCurrentWeather(
      searchCity,
      searchState,
      searchCountry
    );
    displayWeather(currentWeather);
    getGiphy(currentWeather.mainWeather);
  } catch (err) {
    console.log(
      "Something went wrong with fetching the current weather data:",
      err
    );
    alert("Something went wrong with fetching the current weather data.");
  }
}

async function fetchCurrentWeather(searchCity, searchState, searchCountry) {
  const apiKey = "7867431b10f2985cec0596714f5c3b11";
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${searchCity},${searchState},${searchCountry}&units=imperial&APPID=${apiKey}`,
    { mode: "cors" }
  );
  const currentData = await response.json();
  return {
    mainWeather: currentData.weather[0].main,
    place: `${currentData.name}, ${searchState.toUpperCase()} ${
      currentData.sys.country
    }`,
    temp: Math.round(currentData.main.temp),
    humidity: currentData.main.humidity + "%",
    wind: Math.round(currentData.wind.speed) + " MPH",
  };
}

function clearSearch() {
  document.getElementById("search-city").value = "";
  document.getElementById("search-state").value = "";
  document.getElementById("search-country").value = "";
  const img = document.querySelector("img");
  img.style.display = "none";
  clearDOM();
}

function displayWeather(currentWeather) {
  const displayDiv = document.querySelector(".display-div");
  clearDOM();

  const weatherData = [
    { label: "Place", value: currentWeather.place },
    { label: "Main Weather", value: currentWeather.mainWeather },
    { label: "Temperature", value: `${currentWeather.temp} Degrees` },
    { label: "Humidity", value: `${currentWeather.humidity} Humidity` },
    { label: "Wind", value: `${currentWeather.wind} Wind` },
  ];

  weatherData.forEach((data) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = `${data.label}: ${data.value}`;
    displayDiv.appendChild(paragraph);
  });
}

async function getGiphy(mainWeather) {
  try {
    const img = document.querySelector("img");
    let keyWord = mainWeather;
    if (keyWord === "Clear") {
      keyWord = "Clear Sky";
    }
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=q7UfXfOHisT5i95JquK4JH45e9dplRAR&wierdness=0&s=${keyWord}`,
      { mode: "cors" }
    );
    const giphyResponse = await response.json();
    img.style.display = "";
    img.src = giphyResponse.data.images.original.url;
  } catch (err) {
    console.log("Something went wrong when trying to fetch the giphy:", err);
  }
}

function clearDOM() {
  const nodeList = document.querySelectorAll("p");
  nodeList.forEach((element) => element.remove());
}
