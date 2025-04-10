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
- **Alertes météo** : Recevez des alertes pour les conditions météorologiques importantes
- **Géolocalisation** : Obtenez la météo de votre position actuelle
- **Fond dynamique** : Le fond change en fonction des conditions météorologiques

## 🚀 Installation

1. Clonez le dépôt :
```bash
git clone [URL_DU_REPO]
```

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
- Barre de recherche avec autocomplétion
- Affichage de la température actuelle
- Description détaillée du temps
- Icônes météorologiques dynamiques

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
- Alertes météorologiques
- Fond dynamique selon le temps

## 🔑 Configuration

Pour utiliser l'application, vous devez :

1. Obtenir une clé API OpenWeatherMap :
   - Créez un compte sur [OpenWeatherMap](https://openweathermap.org/)
   - Générez une clé API
   - Ajoutez la clé dans le fichier `.env`

2. Configurer le serveur :
   - Le serveur utilise le port 3000 par défaut
   - Les requêtes API sont limitées selon votre plan OpenWeatherMap

## 📦 Structure du projet

```
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── server.js
├── package.json
├── .env
└── README.md
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- [Votre Nom]

## 🙏 Remerciements

- OpenWeatherMap pour leur API
- Chart.js pour les graphiques
- Font Awesome pour les icônes 