Vous trouverez sur ce git différents dossiers. Voici où trouver ce dont vous avez besoin.

Vous retrouverez tous rapports de chaque matière dans le dossier qui lui est associé à la racine du git.

Vous pourrez trouver tout ce qui concerne le côté serveur(NodeJs) du site dans le dossier Serveur.

    le Dao : Serveur/src/MVC/dao
    le model : Serveur/src/MVC/model
    le controller : Serveur/src/MVC/controller
    les routes : Serveur/src/MVC/route

Dans le dossier myApp vous trouverez toute la partie Js,Html,Css.

    le js principal : myApp/src/App.js


Afin de fractionner le code dans App.js nous avons plusieurs autres fichiers js qui regroupent des fonctions ayant des utilités similaires.\
    les différents fichiers : 

        myApp/src/CalculDistance.js
        myApp/src/Login.js
        myApp/src/customPopUp.js
        myApp/src/LeafletIcons.js
        myApp/src/index.js

Le css de notre application est dans ce dossier :

    myApp/src/style.css

L'html se situe ici :

    myApp/public/index.html

En ce qui concerne les tests vous en trouverez à ces différents endroits :

    Serveur->test
    myApp->test
