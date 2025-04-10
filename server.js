require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API pour obtenir la météo par ville
app.get('/api/weather/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données météo' });
    }
});

// API pour obtenir les prévisions par ville
app.get('/api/forecast/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=fr`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des prévisions' });
    }
});

// API pour obtenir la météo par coordonnées
app.get('/api/weather/coordinates', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données météo' });
    }
});

// API pour obtenir les prévisions par coordonnées
app.get('/api/forecast/coordinates', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des prévisions' });
    }
});

// API pour obtenir les alertes météo
app.get('/api/alerts', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${API_KEY}&units=metric&lang=fr`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des alertes météo' });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
}); 