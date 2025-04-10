// Variables pour les éléments DOM
const weatherInfo = document.querySelector('.weather-info');
const forecastContainer = document.querySelector('.forecast-container');
const loadingContainer = document.querySelector('.loading-container');
const weatherAlerts = document.querySelector('.weather-alerts');
const chartsContainer = document.querySelector('.charts-container');
const favoritesContainer = document.querySelector('.favorites-container');
const favoriteBtn = document.getElementById('favorite-btn');
const locationBtn = document.getElementById('location-btn');

// Variables pour les graphiques
let tempChart = null;
let humidityChart = null;

// Fonction pour mettre à jour l'heure
function updateTime() {
    const timeElement = document.querySelector('.current-time');
    const now = new Date();
    timeElement.textContent = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Mettre à jour l'heure toutes les secondes
setInterval(updateTime, 1000);

// Fonction pour changer le fond selon le temps
function updateBackground(weatherCode) {
    const body = document.body;

    // Supprimer toutes les classes de fond
    body.classList.remove('sunny', 'cloudy', 'rainy', 'snowy', 'default');

    // Ajouter la classe appropriée selon le code météo
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

// Fonction pour obtenir la météo actuelle
async function getWeather(city) {
    try {
        // Afficher l'animation de chargement
        loadingContainer.style.display = 'block';
        weatherInfo.classList.remove('active');
        forecastContainer.classList.remove('active');
        chartsContainer.classList.remove('active');
        weatherAlerts.style.display = 'none';

        // Utiliser l'API Node.js
        const response = await fetch(`/api/weather/${city}`);
        const data = await response.json();

        if (response.ok) {
            // Mettre à jour le fond selon le temps
            updateBackground(data.weather[0].id);

            // Masquer l'animation de chargement
            loadingContainer.style.display = 'none';

            displayWeather(data);
            getForecast(city); // Appeler la fonction pour obtenir les prévisions
            checkWeatherAlerts(city); // Vérifier les alertes météo

            // Mettre à jour le bouton favoris
            updateFavoriteButton(city);
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

// Fonction pour obtenir les prévisions sur 5 jours
async function getForecast(city) {
    try {
        // Utiliser l'API Node.js
        const response = await fetch(`/api/forecast/${city}`);
        const data = await response.json();

        if (response.ok) {
            displayForecast(data);
            createCharts(data); // Créer les graphiques
        }
    } catch (error) {
        console.error('Erreur prévisions:', error);
    }
}

// Fonction pour vérifier les alertes météo
async function checkWeatherAlerts(city) {
    try {
        // Vérifier si city est un objet avec lat et lon ou une chaîne de caractères
        let url;
        if (typeof city === 'object' && city.lat && city.lon) {
            url = `/api/alerts?lat=${city.lat}&lon=${city.lon}`;
        } else {
            // Si c'est une chaîne de caractères, d'abord obtenir les coordonnées
            const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=6468fbaf5dc4d5c79fa066e77ead3d3a`);
            const geoData = await geoResponse.json();

            if (geoData.length > 0) {
                url = `/api/alerts?lat=${geoData[0].lat}&lon=${geoData[0].lon}`;
            } else {
                throw new Error('Ville non trouvée');
            }
        }

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok && data.alerts && data.alerts.length > 0) {
            displayWeatherAlerts(data.alerts);
        } else {
            weatherAlerts.style.display = 'none';
        }
    } catch (error) {
        console.error('Erreur alertes:', error);
        weatherAlerts.style.display = 'none';
    }
}

// Fonction pour afficher les alertes météo
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

// Fonction pour afficher les informations météo actuelles
function displayWeather(data) {
    const cityName = document.querySelector('.city-name');
    const temperature = document.querySelector('.temperature');
    const weatherIcon = document.querySelector('.weather-icon');
    const weatherDescription = document.querySelector('.weather-description');
    const windSpeed = document.querySelector('.wind-speed');
    const humidity = document.querySelector('.humidity');
    const feelsLike = document.querySelector('.feels-like');

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;

    // Afficher les détails supplémentaires
    windSpeed.textContent = `${Math.round(data.wind.speed)} km/h`;
    humidity.textContent = `${data.main.humidity}%`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;

    // Afficher l'icône météo avec animation
    const iconCode = data.weather[0].icon;
    weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon">`;

    // Afficher les informations
    weatherInfo.classList.add('active');
    updateTime();
}

// Fonction pour afficher les prévisions
function displayForecast(data) {
    const forecastList = document.querySelector('.forecast-list');
    forecastList.innerHTML = ''; // Nettoyer les prévisions précédentes

    // Filtrer pour n'avoir qu'une prévision par jour (à midi)
    const dailyForecasts = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <div class="forecast-date">${dayName}</div>
            <img class="forecast-icon" src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather icon">
            <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
            <div class="forecast-desc">${forecast.weather[0].description}</div>
        `;

        forecastList.appendChild(forecastCard);
    });

    // Afficher le conteneur des prévisions
    forecastContainer.classList.add('active');
}

// Fonction pour créer les graphiques
function createCharts(data) {
    // Préparer les données pour les graphiques
    const labels = [];
    const temperatures = [];
    const humidities = [];

    // Filtrer pour n'avoir qu'une prévision par jour (à midi)
    const dailyForecasts = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });

        labels.push(dayName);
        temperatures.push(Math.round(forecast.main.temp));
        humidities.push(forecast.main.humidity);
    });

    // Créer le graphique de température
    const tempCtx = document.getElementById('temp-chart').getContext('2d');

    // Détruire le graphique existant s'il existe
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

    // Créer le graphique d'humidité
    const humidityCtx = document.getElementById('humidity-chart').getContext('2d');

    // Détruire le graphique existant s'il existe
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

    // Afficher les graphiques
    chartsContainer.classList.add('active');
}

// Fonction pour obtenir la météo par géolocalisation
function getWeatherByLocation() {
    if (navigator.geolocation) {
        loadingContainer.style.display = 'block';
        weatherInfo.classList.remove('active');
        forecastContainer.classList.remove('active');
        chartsContainer.classList.remove('active');
        weatherAlerts.style.display = 'none';

        // Options pour améliorer la précision de la géolocalisation
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    console.log(`Position obtenue: ${lat}, ${lon}`);

                    // Utiliser l'API Node.js
                    const response = await fetch(`/api/weather/coordinates?lat=${lat}&lon=${lon}`);
                    const data = await response.json();

                    if (response.ok) {
                        // Mettre à jour le fond selon le temps
                        updateBackground(data.weather[0].id);

                        // Masquer l'animation de chargement
                        loadingContainer.style.display = 'none';

                        displayWeather(data);
                        getForecastByCoords(lat, lon);
                        checkWeatherAlerts({ lat, lon });

                        // Mettre à jour le bouton favoris
                        updateFavoriteButton(data.name);
                    } else {
                        loadingContainer.style.display = 'none';
                        alert('Impossible d\'obtenir la météo pour votre position.');
                    }
                } catch (error) {
                    loadingContainer.style.display = 'none';
                    console.error('Erreur:', error);
                    alert('Une erreur est survenue. Veuillez réessayer.');
                }
            },
            (error) => {
                loadingContainer.style.display = 'none';
                console.error('Erreur de géolocalisation:', error);

                // En cas d'erreur de géolocalisation, utiliser Paris 17e comme position par défaut
                console.log('Utilisation de Paris 17e comme position par défaut');
                getWeather('Paris,FR');
            },
            options
        );
    } else {
        alert('La géolocalisation n\'est pas supportée par votre navigateur. Utilisation de Paris comme position par défaut.');
        getWeather('Paris,FR');
    }
}

// Fonction pour obtenir les prévisions par coordonnées
async function getForecastByCoords(lat, lon) {
    try {
        // Utiliser l'API Node.js
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

// Fonction pour gérer les favoris
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

            // Ajouter un écouteur d'événements pour cliquer sur la ville
            favoriteItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('remove-favorite')) {
                    document.getElementById('city-input').value = city;
                    getWeather(city);
                }
            });

            // Ajouter un écouteur d'événements pour supprimer la ville
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

// Fonction pour ajouter une ville aux favoris
function addFavorite(city) {
    const favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];

    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
        loadFavorites();
    }

    updateFavoriteButton(city);
}

// Fonction pour supprimer une ville des favoris
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

// Fonction pour mettre à jour le bouton favoris
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

// Écouteur d'événements pour le bouton de recherche
document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        getWeather(city);
    }
});

// Écouteur d'événements pour la touche Entrée
document.getElementById('city-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = e.target.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});

// Écouteur d'événements pour le bouton de géolocalisation
locationBtn.addEventListener('click', getWeatherByLocation);

// Écouteur d'événements pour le bouton favoris
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

// Charger les favoris au démarrage
loadFavorites(); 