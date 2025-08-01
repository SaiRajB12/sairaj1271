document.getElementById("fetchWeatherBtn").addEventListener("click", function () {
  const cityName = document.getElementById("cityInput").value.trim();

  if (!cityName) {
    alert("Please enter a city name!");
    return;
  }

  const apiKey = "bd346fe58c0d33eb76d71bbe25bcfc6b"; 
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  // Log the URL for debugging
  console.log("Fetching weather data for URL:", apiUrl);

  fetch(apiUrl)
    .then((response) => {
      console.log("API Response:", response);  // Debugging: Log the response
      if (!response.ok) {
        // If the response status is not OK, throw an error
        throw new Error(`City not found or API Error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Weather data received:", data);  // Log the weather data
      displayWeather(data);
    })
    .catch((error) => {
      console.error("Fetch error:", error);  // Log the error
      alert(error.message);  // Display a user-friendly alert
    });
});

let storedWeatherData = {}; // To store fetched data globally

function displayWeather(data) {
  // Store data for future use
  storedWeatherData = {
    description: data.weather[0].description,
    temperature: data.main.temp,
    precipitation: data.clouds.all,
    wind: data.wind.speed,
    humidity: data.main.humidity,
  };

  const city = data.name;
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Update the weather details UI
  const weatherDetails = document.getElementById("weatherDetails");
  weatherDetails.innerHTML = `
    <div>
      <h2>${city}</h2>
      <img class="weather-icon" src="${iconUrl}" alt="Weather Icon">
      <p><strong>${storedWeatherData.description}</strong></p>
      <p><strong>Temperature:</strong> ${storedWeatherData.temperature}°C</p>
    </div>
    <div id="buttons-container">
      <button class="info-button" onclick="showDetails('overview')">Overview</button>
      <button class="info-button" onclick="showDetails('precipitation')">Precipitation</button>
      <button class="info-button" onclick="showDetails('wind')">Wind</button>
      <button class="info-button" onclick="showDetails('humidity')">Humidity</button>
    </div>
  `;
  weatherDetails.style.display = "block";
}

function showDetails(type) {
  // Hide all other content
  document.getElementById("searchContainer").style.display = "none";
  document.getElementById("weatherDetails").style.display = "none";

  // Create and display the details section
  const appContainer = document.getElementById("appContainer");
  const detailsSection = document.createElement("div");
  detailsSection.id = "detailsSection";

  let detailHeading, detailText;

  switch (type) {
    case "overview":
      detailHeading = "Overview";
      detailText = `
        The current temperature is <strong>${storedWeatherData.temperature}°C</strong> 
        with weather described as <strong>${storedWeatherData.description}</strong>.
      `;
      break;
    case "precipitation":
      detailHeading = "Precipitation";
      detailText = `The current cloud cover is approximately: <strong>${storedWeatherData.precipitation}%</strong>.`;
      break;
    case "wind":
      detailHeading = "Wind";
      detailText = `The wind speed is: <strong>${storedWeatherData.wind} m/s</strong>.`;
      break;
    case "humidity":
      detailHeading = "Humidity";
      detailText = `The humidity level is: <strong>${storedWeatherData.humidity}%</strong>.`;
      break;
    default:
      detailHeading = "Details";
      detailText = "No details available.";
  }

  detailsSection.innerHTML = `
    <h3>${detailHeading}</h3>
    <p>${detailText}</p>
    <button class="back-button" onclick="goBack()">Back</button>
  `;
  appContainer.appendChild(detailsSection);
}

function goBack() {
  // Remove details section
  const detailsSection = document.getElementById("detailsSection");
  if (detailsSection) {
    detailsSection.remove();
  }

  // Show original content
  document.getElementById("searchContainer").style.display = "block";
  document.getElementById("weatherDetails").style.display = "block";
}
