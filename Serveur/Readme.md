# Rapport Architecture Logicielle

## 1. Notre Application

Notre application vise à fournir des informations sur les stations de vélo et les toilettes en libre-service à Nantes. Voici une vue d'ensemble de son architecture et de son déploiement :

### Configuration
L'application peut être configurée pour fonctionner dans différents environnements. La configuration est basée sur la valeur de la variable d'environnement `env` définie dans le fichier `.env` :

- Si `env` est défini sur `TEST`, l'application utilise une base de données MongoDB en mémoire.
- Si `env` est défini sur `DEV` ou `PROD`, l'application se connecte à une base de données MongoDB locale pour des données persistantes.

Pour lancer le serveur : 

Rendez vous dans le dossier Serveur et faites :
- npm i
- npm start

### Composants Principaux
- **HttpServer.mjs** : Ce fichier récupère les données de l'API de Nantes Métropole sous forme de JSON.
- **app.mjs** : Ce fichier charge les middlewares et les routes de l'application en utilisant le framework Express.
- **server.mjs** : Ce fichier créer la connexion avec mongodb selon l'environnement choisi dans le .env. 

### Gestion des Données
Les DAO (Data Access Objects) sont structurés comme suit :
- Définition de schémas Mongoose.
- Création de collections Mongoose.
- Définition de constantes regroupant les fonctions permettant d'interagir avec la base de données.

### Déploiement
L'application est accessible à l'adresse `127.0.0.1:8080`. L'API est disponible à l'adresse `/api/v1`. Les routes sont documentées et accessibles via Swagger.

## 2. Les Tests

Nous avons mis en place des tests pour assurer la fiabilité et la qualité de notre application. Voici un aperçu des tests effectués :

### Types de Tests
- **Tests des Modèles** : Nous avons écrit des tests pour chaque modèle (Avis, Bike, Toilet, User) pour garantir leur bon fonctionnement.
- **Tests des DAO** : Des tests ont été réalisés pour chaque DAO afin de vérifier leur intégrité et leur cohérence.
- **Tests des Routes** : Nous avons testé les routes de notre application pour nous assurer qu'elles répondent correctement aux requêtes HTTP.

### Outils Utilisés
- **Mocha et Chai** : Nous avons utilisé Mocha comme framework de test et Chai pour effectuer les assertions dans nos tests.
- **Supertest** : Nous avons utilisé Supertest pour simuler les requêtes HTTP lors des tests des routes.

Ces tests garantissent que notre application fonctionne comme prévu et qu'elle répond aux spécifications définies.
