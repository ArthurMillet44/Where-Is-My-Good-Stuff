# Notre application


## Scripts
Notre application fonctionne avec la version de Node : 20.12.2

Dans le dossier du projet vous pouvez lancer:

### `npm i`

Installe toutes les dépendances nécessaire à l'application

### `npm start`

Lance l'application à l'addresse [http://localhost:3000]

### `npm test`

Lance les tests présent dans le dossier /test

Si jamais des problèmes sont rencontrés pour lancer des tests faites en plus de npm i :
* npm i c8
* npm i nyc
* npm i mocha

## Fonctionnalité

### Carte intéractive
Notre application possède une carte interactive créer grâce à leaflet et implémenté grâce au plugin react-leaflet. Sur cette carte est répertorié:
* La localisation de l'utilisateur si jamais celui-ci l'a autorisé (elle met un peu de temps à être récupérer). Elle est récupérer grâce au navigateur.
* Les icones des toilettes et stations de vélo en libre service à Nantes que nous récupérons avec des appels vers notre serveur Node.
* Si la localisation de l'utilisateur est activé alors la toilette et stations de vélo la plus proche sera indiqué par le trajet pour s'y rendre. De plus, un clique sur une icone (toilette ou vélo) affiche le trajet pour s'y rendre ainsi qu'une popup avec des informations supplémentaire. Si le clique est sur une toilette il est possible de laisser un avis qui est réprésenté par un nombre d'étoile et qui est modifié dynamiquement.
### Identification
Lors du clique sur le bouton login un modal s'ouvre. Il y a un champ login et un champ password. Le clique sur le bouton register envoie une requete au serveur pour ajouter un utilisateur (le login ne doit pas être déjà présent sinon l'utilisateur ne sera pas ajouté). Le clique sur le bouton login envoie une requete au serveur pour vérifier les identifiants. Lors d'une authentification valide une alert est affiché et est customisée à l'aide du plugin SweetAlert.
### Filtres
Les deux switchs permette d'afficher/masquer dynamiquement les vélos et toilettes.
### Localisation
Un champ de texte "Localisation" permet de localiser des endroits dans Nantes grâce à l'api d'Open street map (Certains nom ne fonctionne pas, tout dépend de comment ils sont stocker dans open street map).

## Différents fichier
### App.js
Fichier principale qui regroupe la carte ainsi que toute les fonctions utile pour son fonctionnement.
### CalculDistance.js
Fonction qui calul la distance entre deux points gps. Deux fonctions pour récuperer la toilette ainsi que le vélo le plus proche de la position de l'utilisateur.
### customPopUp.js
Permet de définir des popups personnaliser lors du clic sur une icone.
### index.js
Render l'application en strict mode.
### LeafletIcon.js
Défini toutes nos icones ainsi que le cluster pour le regroupement des vélos et des toiletes lors du dezoom.
### Login.js
Affichage du modal avec requete vers le serveur.

~ A noter que l'entièreter du code est commenté. ~