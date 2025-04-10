const API_KEY = '6468fbaf5dc4d5c79fa066e77ead3d3a';
const weatherInfo = document.querySelector('.weather-info');
const forecastContainer = document.querySelector('.forecast-container');
const loadingContainer = document.querySelector('.loading-container');
const weatherAlerts = document.querySelector('.weather-alerts');
const chartsContainer = document.querySelector('.charts-container');
const favoritesContainer = document.querySelector('.favorites-container');
const favoriteBtn = document.getElementById('favorite-btn');
const locationBtn = document.getElementById('location-btn');

let tempChart = null;
let humidityChart = null;

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

let currentTempUnit = localStorage.getItem('tempUnit') || 'metric';
let currentWindUnit = localStorage.getItem('windUnit') || 'metric';

const searchHistoryContainer = document.querySelector('.search-history-container');
const MAX_HISTORY_ITEMS = 10;

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

toggleSwitch.addEventListener('change', switchTheme);

function updateTime() {
    const timeElement = document.querySelector('.current-time');
    const now = new Date();
    timeElement.textContent = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

setInterval(updateTime, 1000);

function updateBackground(weatherCode) {
    const body = document.body;

    body.classList.remove('sunny', 'cloudy', 'rainy', 'snowy', 'default');

    if (weatherCode >= 200 && weatherCode < 600) {
        body.classList.add('rainy');
    } else if (weatherCode >= 600 && weatherCode < 700) {
        body.classList.add('snowy');
    } else if (weatherCode >= 700 && weatherCode < 800) {
        body.classList.add('cloudy');
    } else if (weatherCode === 800) {
        body.classList.add('sunny');
    } else if (weatherCode > 800) {
        body.classList.add('cloudy');
    } else {
        body.classList.add('default');
    }
}

function convertTemp(celsius) {
    if (currentTempUnit === 'imperial') {
        return (celsius * 9 / 5) + 32;
    }
    return celsius;
}

function convertWindSpeed(kmh) {
    if (currentWindUnit === 'imperial') {
        return kmh * 0.621371;
    }
    return kmh;
}

function getTempSymbol() {
    return currentTempUnit === 'metric' ? '°C' : '°F';
}

function getWindSymbol() {
    return currentWindUnit === 'metric' ? 'km/h' : 'mph';
}

function updateDisplayWithUnits(data) {
    const temperature = document.querySelector('.temperature');
    const windSpeed = document.querySelector('.wind-speed');
    const feelsLike = document.querySelector('.feels-like');

    const tempC = data.main.temp;
    const feelsLikeC = data.main.feels_like;
    const windSpeedKmh = data.wind.speed;

    temperature.textContent = `${Math.round(convertTemp(tempC))}${getTempSymbol()}`;
    windSpeed.textContent = `${Math.round(convertWindSpeed(windSpeedKmh))} ${getWindSymbol()}`;
    feelsLike.textContent = `${Math.round(convertTemp(feelsLikeC))}${getTempSymbol()}`;
}

function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
        return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (hours < 24) {
        return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
        return `il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
}

function addToSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    searchHistory = searchHistory.filter(item => item.city !== city);

    searchHistory.unshift({
        city: city,
        timestamp: new Date().toISOString()
    });

    if (searchHistory.length > MAX_HISTORY_ITEMS) {
        searchHistory = searchHistory.slice(0, MAX_HISTORY_ITEMS);
    }

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory();
}

function displaySearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const historyList = document.querySelector('.search-history-list');
    historyList.innerHTML = '';

    if (searchHistory.length > 0) {
        searchHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            const searchDate = new Date(item.timestamp);

            historyItem.innerHTML = `
                <span>${item.city}</span>
                <span class="search-time">${formatDate(searchDate)}</span>
                <span class="remove-history" data-city="${item.city}">×</span>
            `;

            historyItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('remove-history')) {
                    document.getElementById('city-input').value = item.city;
                    getWeather(item.city);
                }
            });

            const removeBtn = historyItem.querySelector('.remove-history');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFromSearchHistory(item.city);
            });

            historyList.appendChild(historyItem);
        });

        searchHistoryContainer.classList.add('active');
    } else {
        searchHistoryContainer.classList.remove('active');
    }
}

function removeFromSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory = searchHistory.filter(item => item.city !== city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory();
}

function clearSearchHistory() {
    localStorage.removeItem('searchHistory');
    displaySearchHistory();
}

async function getWeather(city) {
    try {
        loadingContainer.style.display = 'block';
        weatherInfo.classList.remove('active');
        forecastContainer.classList.remove('active');
        chartsContainer.classList.remove('active');
        weatherAlerts.style.display = 'none';

        const response = await fetch(`/api/weather/${city}`);
        const data = await response.json();

        if (response.ok) {
            updateBackground(data.weather[0].id);

            loadingContainer.style.display = 'none';

            displayWeather(data);
            getForecast(city);
            checkWeatherAlerts(city);

            updateFavoriteButton(city);

            addToSearchHistory(city);
        } else {
            loadingContainer.style.display = 'none';
            alert('Ville non trouvée. Veuillez réessayer.');
        }
    } catch (error) {
        loadingContainer.style.display = 'none';
        console.error('Erreur:', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
    }
}

async function getForecast(city) {
    try {
        const response = await fetch(`/api/forecast/${city}`);
        const data = await response.json();

        if (response.ok) {
            displayForecast(data);
            createCharts(data);
        }
    } catch (error) {
        console.error('Erreur prévisions:', error);
    }
}

async function checkWeatherAlerts(city) {
    try {
        let url;
        if (typeof city === 'object' && city.lat && city.lon) {
            const response = await fetch(`/api/alerts?lat=${city.lat}&lon=${city.lon}`);
            const data = await response.json();

            if (response.ok && data.alerts && data.alerts.length > 0) {
                displayWeatherAlerts(data.alerts);
            } else {
                weatherAlerts.style.display = 'none';
            }
        } else {
            const geoResponse = await fetch(`/api/weather/${city}`);
            const geoData = await geoResponse.json();

            if (geoData.coord) {
                const response = await fetch(`/api/alerts?lat=${geoData.coord.lat}&lon=${geoData.coord.lon}`);
                const data = await response.json();

                if (response.ok && data.alerts && data.alerts.length > 0) {
                    displayWeatherAlerts(data.alerts);
                } else {
                    weatherAlerts.style.display = 'none';
                }
            } else {
                weatherAlerts.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Erreur alertes:', error);
        weatherAlerts.style.display = 'none';
    }
}

function displayWeatherAlerts(alerts) {
    const alertsContainer = document.querySelector('.alerts-container');
    alertsContainer.innerHTML = '';

    alerts.forEach(alert => {
        const alertItem = document.createElement('div');
        alertItem.className = 'alert-item';
        alertItem.innerHTML = `
            <strong>${alert.event}</strong>
            <p>${alert.description}</p>
        `;
        alertsContainer.appendChild(alertItem);
    });

    weatherAlerts.style.display = 'block';
}

function displayWeather(data) {
    const cityName = document.querySelector('.city-name');
    const weatherIcon = document.querySelector('.weather-icon');
    const weatherDescription = document.querySelector('.weather-description');
    const humidity = document.querySelector('.humidity');

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherDescription.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;

    const iconCode = data.weather?.[0]?.icon || "01d"; // Icône par défaut si vide
    weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon">`;

    updateDisplayWithUnits(data);
    weatherInfo.classList.add('active');
    updateTime();
}

function displayForecast(data) {
    const forecastList = document.querySelector('.forecast-list');
    forecastList.innerHTML = '';

    const dailyForecasts = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
        const tempC = forecast.main.temp;

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <div class="forecast-date">${dayName}</div>
            <img class="forecast-icon" src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather icon">
            <div class="forecast-temp">${Math.round(convertTemp(tempC))}${getTempSymbol()}</div>
            <div class="forecast-desc">${forecast.weather[0].description}</div>
        `;

        forecastList.appendChild(forecastCard);
    });

    forecastContainer.classList.add('active');
}

function createCharts(data) {
    const labels = [];
    const temperatures = [];
    const humidities = [];

    const dailyForecasts = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });

        labels.push(dayName);
        temperatures.push(Math.round(forecast.main.temp));
        humidities.push(forecast.main.humidity);
    });

    const tempCtx = document.getElementById('temp-chart').getContext('2d');

    if (tempChart) {
        tempChart.destroy();
    }

    tempChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Température (°C)',
                data: temperatures,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    const humidityCtx = document.getElementById('humidity-chart').getContext('2d');

    if (humidityChart) {
        humidityChart.destroy();
    }

    humidityChart = new Chart(humidityCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Humidité (%)',
                data: humidities,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    chartsContainer.classList.add('active');
}

async function getWeatherByLocation() {
    try {
        loadingContainer.style.display = 'block';
        weatherInfo.classList.remove('active');
        forecastContainer.classList.remove('active');
        chartsContainer.classList.remove('active');
        weatherAlerts.style.display = 'none';

        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const response = await fetch(`/api/weather/coordinates?lat=${latitude}&lon=${longitude}`);
        const data = await response.json();

        if (response.ok) {
            updateBackground(data.weather[0].id);
            loadingContainer.style.display = 'none';
            displayWeather(data);
            getForecastByCoords(latitude, longitude);
            checkWeatherAlerts({ lat: latitude, lon: longitude });
        } else {
            loadingContainer.style.display = 'none';
            alert('Erreur lors de la récupération de la météo. Veuillez réessayer.');
        }
    } catch (error) {
        loadingContainer.style.display = 'none';
        console.error('Erreur géolocalisation:', error);
        alert('Erreur de géolocalisation. Veuillez réessayer.');
    }
}

async function getForecastByCoords(lat, lon) {
    try {
        const response = await fetch(`/api/forecast/coordinates?lat=${lat}&lon=${lon}`);
        const data = await response.json();

        if (response.ok) {
            displayForecast(data);
            createCharts(data);
        }
    } catch (error) {
        console.error('Erreur prévisions:', error);
    }
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
    const favoritesList = document.querySelector('.favorites-list');
    favoritesList.innerHTML = '';

    if (favorites.length > 0) {
        favorites.forEach(city => {
            const favoriteItem = document.createElement('div');
            favoriteItem.className = 'favorite-item';
            favoriteItem.innerHTML = `
                <span>${city}</span>
                <span class="remove-favorite" data-city="${city}">×</span>
            `;

            favoriteItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('remove-favorite')) {
                    document.getElementById('city-input').value = city;
                    getWeather(city);
                }
            });

            const removeBtn = favoriteItem.querySelector('.remove-favorite');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFavorite(city);
            });

            favoritesList.appendChild(favoriteItem);
        });

        favoritesContainer.classList.add('active');
    } else {
        favoritesContainer.classList.remove('active');
    }
}

function addFavorite(city) {
    const favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];

    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
        loadFavorites();
    }

    updateFavoriteButton(city);
}

function removeFavorite(city) {
    const favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];

    const index = favorites.indexOf(city);
    if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
        loadFavorites();
    }

    updateFavoriteButton(city);
}

function updateFavoriteButton(city) {
    const favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];

    if (favorites.includes(city)) {
        favoriteBtn.textContent = '⭐ Retirer des favoris';
        favoriteBtn.classList.add('active');
    } else {
        favoriteBtn.textContent = '⭐ Ajouter aux favoris';
        favoriteBtn.classList.remove('active');
    }
}

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        getWeather(city);
    }
});

document.getElementById('city-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = e.target.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});

locationBtn.addEventListener('click', getWeatherByLocation);

favoriteBtn.addEventListener('click', () => {
    const city = document.querySelector('.city-name').textContent.split(',')[0].trim();

    if (city) {
        const favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];

        if (favorites.includes(city)) {
            removeFavorite(city);
        } else {
            addFavorite(city);
        }
    }
});

loadFavorites();

document.getElementById('temp-unit').addEventListener('change', (e) => {
    currentTempUnit = e.target.value;
    localStorage.setItem('tempUnit', currentTempUnit);
    const city = document.querySelector('.city-name').textContent.split(',')[0].trim();
    if (city) {
        getWeather(city);
    }
});

document.getElementById('wind-unit').addEventListener('change', (e) => {
    currentWindUnit = e.target.value;
    localStorage.setItem('windUnit', currentWindUnit);
    const city = document.querySelector('.city-name').textContent.split(',')[0].trim();
    if (city) {
        getWeather(city);
    }
});

document.getElementById('temp-unit').value = currentTempUnit;
document.getElementById('wind-unit').value = currentWindUnit;

displaySearchHistory(); 