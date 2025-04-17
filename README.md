# Application Météo

Une application météo moderne et interactive développée avec HTML, CSS et JavaScript, utilisant l'API OpenWeatherMap.

## 🌟 Fonctionnalités

- **Recherche de météo** : Recherchez la météo de n'importe quelle ville
- **Prévisions sur 5 jours** : Visualisez les prévisions météorologiques sur 5 jours
- **Mode sombre/clair** : Basculez entre les thèmes clair et sombre
- **Unités personnalisables** : Choisissez entre °C/°F et km/h/mph
- **Historique des recherches** : Accédez rapidement à vos dernières recherches
- **Système de favoris** : Sauvegardez vos villes préférées
- **Graphiques** : Visualisez les tendances de température et d'humidité
- **Géolocalisation** : Obtenez la météo de votre position actuelle

## 🚀 Installation

1. Téléchargez ou clonez le projet

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet et ajoutez votre clé API OpenWeatherMap :
```
OPENWEATHER_API_KEY=votre_clé_api
```

4. Démarrez le serveur :
```bash
npm start
```

5. Ouvrez votre navigateur et accédez à `http://localhost:3000`

## 🛠️ Technologies utilisées

- HTML5
- CSS3
- JavaScript (ES6+)
- Node.js
- Express.js
- OpenWeatherMap API
- Chart.js
- Font Awesome

## 📱 Fonctionnalités détaillées

### Recherche et affichage
- Barre de recherche
- Affichage de la température actuelle
- Description détaillée du temps
- Icônes météorologiques

### Prévisions
- Vue sur 5 jours
- Température minimale et maximale
- Description du temps
- Icônes représentatives

### Personnalisation
- Bascule entre mode clair et sombre
- Choix des unités de mesure
- Historique des recherches
- Gestion des favoris

### Visualisation
- Graphiques de température
- Graphiques d'humidité

## 📦 Structure du projet

```
├── public/
│   ├── index.html    # Page principale
│   ├── styles.css    # Styles de l'application
│   ├── script.js     # Code JavaScript client
│   └── assets/       # Images et ressources
├── server.js         # Serveur Node.js
├── package.json      # Dépendances du projet
├── .env             # Configuration (clés API)
└── README.md        # Documentation
```

## 🔑 Configuration

Pour utiliser l'application, vous devez :

1. Obtenir une clé API OpenWeatherMap :
   - Créez un compte sur [OpenWeatherMap](https://openweathermap.org/)
   - Générez une clé API
   - Ajoutez la clé dans le fichier `.env`

2. Configurer le serveur :
   - Le serveur utilise le port 3000 par défaut
   - Les requêtes API sont limitées selon votre plan OpenWeatherMap

## 👥 Auteurs

- Aya Moustaquim

## 🙏 Remerciements

- OpenWeatherMap pour leur API
- Chart.js pour les graphiques
- Font Awesome pour les icônes 