import "./style.css";
import Swal from 'sweetalert2';
import { useState, useEffect, useRef } from 'react';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from 'leaflet';
import MarkerClusterGroup from "react-leaflet-cluster";
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import {Rating} from '@mui/material';


//import des fonctions qui concernent les icons leaflet
import {toiletClusterCustomIcon} from "./LeafletIcons";
import {bikeClusterCustomIcon} from "./LeafletIcons";
import {toiletIcon} from "./LeafletIcons";
import {bikeIcon} from "./LeafletIcons";
import {customIcon} from "./LeafletIcons";

//import des const qui concernent la customisation des popUp leaflet
import {CustomPopupToilet} from "./customPopUp";
import {CustomPopupBike} from "./customPopUp";

//import de la fonction Login permettant de se connecter ou de s'enregistrer sur le site
import {Login} from "./Login";

//import des fonctions permettant de renvoyer les toilettes/station de vélo la plus proche
import {findNearestToilet} from "./CalculDistance";
import {findNearestBike} from "./CalculDistance";

//Une latitude et une longitude par défault dans la ville de Nantes
const defaultLatitude = 47.14;
const defaultLongitude = -1.55;


/**
 * Affiche une alerte personnalisée avec du texte et un titre personnalisés.
 * @param {string} customText - Le texte personnalisé à afficher dans l'alerte.
 * @param {string} customTitle - Le titre personnalisé à afficher dans l'alerte.
 * @param {string} [icon='info'] - L'icône à afficher dans l'alerte (par défaut, 'info').
 */
export function showCustomAlert(customText,customTitle,icon) {
    Swal.fire({
        title: customTitle ,
        text: customText,
        icon: 'info',
        confirmButtonText: 'OK',
        customClass: {
            popup: 'custom-popup',
        },
    });
}


/**
 * Fonction principale de l'application.
 */
function App() {
    // État pour le contrôle de routing pour les toilettes.
    const [routingControl, setRoutingControl] = useState(null);
    // État pour le contrôle de routing pour les vélos.
    const [routingControl2, setRoutingControl2] = useState(null);

    // État pour les waypoints (points de passage) utilisés dans le routing.
    let waypoints = useState([]);

    // Gestionnaire de clic sur un marqueur de toilette.
    const handleToiletMarkerClick = (toilet) => {
        if (routingControl) {
            // Supprimer le contrôle de routing existant.
            mapRef.current.removeControl(routingControl);
            // Initialiser le routing vers la toilette sélectionnée.
            initRouting(userLocation, [toilet.latitude, toilet.longitude]);
        }
    };

    // Gestionnaire de clic sur un marqueur de vélo.
    const handleBikeMarkerClick = (bike) => {
        if (routingControl2) {
            // Supprimer le contrôle de routing existant.
            mapRef.current.removeControl(routingControl2);
            // Initialiser le routing vers le vélo sélectionné.
            initRouting2(userLocation, [bike.latitude, bike.longitude]);
        }
    };

    // État pour le terme de recherche.
    const [searchTerm, setSearchTerm] = useState("");

    // État pour l'emplacement de recherche.
    const [searchLocation, setSearchLocation] = useState(null);

    // État pour indiquer si la recherche a été soumise.
    const [searchSubmitted, setSearchSubmitted] = useState(false);

    // État pour filtrer les vélos.
    const [filterBike, setBikeChecked] = useState(true);

    // État pour filtrer les toilettes.
    const [filterToilet, setToiletChecked] = useState(true);

    // État pour la liste des vélos.
    const [bikes, setBikes] = useState([]);

    // État pour la liste des toilettes.
    const [toilets, setToilets] = useState([]);

    // État pour la position de l'utilisateur.
    const [userLocation, setUserLocation] = useState(null);

    // Référence au composant de la carte.
    const mapRef = useRef();

    // État pour le composant de connexion.
    const [state, setState] = useState(false);

    // État pour l'utilisateur connecté.
    const [loggedUser, setLoggedUser] = useState("");

    // État pour un nouvel avis.
    const [newAvis, setNewAvis] = useState("KO");

    // Gestionnaire de changement de terme de recherche.
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Gestionnaire de soumission de recherche.
    const handleSearchSubmit = () => {
        setSearchSubmitted(true);
        setSearchLocation(searchTerm);
    };

    // Composant pour gérer la recherche sur la carte.
    const SearchMap = ({ searchLocation }) => {
        const map = useMap();

        useEffect(() => {
            if (searchLocation) {
                // Effectuer une recherche de géocodage grâce à l'API Open Street Map.
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${searchLocation}`;
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.length > 0) {
                            const { lat, lon } = data[0];
                            if (parseFloat(lat) > 47.17 && parseFloat(lat) < 47.26 && parseFloat(lon) > -1.68 && parseFloat(lon) < -1.49) {
                                setSearchSubmitted(false);
                                // Centrer la carte sur le résultat de la recherche.
                                map.setView([parseFloat(lat), parseFloat(lon)], 16);
                            } else {
                                setSearchSubmitted(false);
                                showCustomAlert("La localisation que vous recherchez n'est pas dans la ville de Nantes ou elle est mal écrite.", "Localisation Alert");
                            }
                        } else {
                            showCustomAlert("La localisation que vous recherchez n'est pas dans la ville de Nantes ou elle est mal écrite.", "Localisation Alert");
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching location data:", error);
                    });
            }
        }, [searchLocation, map]);

        return null;
    };

    // Gestionnaire de clic sur le bouton de connexion.
    const handleLoginButtonClick = () => {
        setState(!state);
    };

    /**
     * Gestionnaires de filtres
     */

        // Gestionnaire de changement de filtre pour les vélos.
    const handleBikeFilterChange = () => {
        // Contrôler l'affichage des itinéraires si un contrôle de routing existe.
        if (routingControl2 != null) {
            let routing = routingControl2;
            if (filterBike) {
                mapRef.current.removeControl(routingControl2);
            } else {
                routing.addTo(mapRef.current);
                setRoutingControl2(routing);
            }
        }
        // Inverser l'état du filtre.
        setBikeChecked(!filterBike);
    };

    // Gestionnaire de changement de filtre pour les toilettes.
    const handleToiletFilterChange = () => {
        // Contrôler l'affichage des itinéraires si un contrôle de routing existe.
        if (routingControl != null) {
            let routing = routingControl;
            if (filterToilet) {
                mapRef.current.removeControl(routingControl);
            } else {
                routing.addTo(mapRef.current);
                setRoutingControl(routing);
            }
        }
        // Inverser l'état du filtre.
        setToiletChecked(!filterToilet);
    };

    /**
     * Gestionnaire de connexion
     * @param user
     */


    const handleLogin = (user) => {
        setLoggedUser(user);
    };

    // Filtrer les vélos en fonction de l'utilisateur connecté.
    const filteredBikes = filterBike ? bikes : [];

    // Filtrer les toilettes en fonction de l'utilisateur connecté.
    const filteredToilets = filterToilet ? toilets : [];

    // Effets pour récupérer les données des vélos et des toilettes lors du chargement de l'application.
    useEffect(() => {

        /**
         * Fonction qui nous permet de récupérer les données de l'API Bike via notre route
         * On récupère ensuite la réponse dans un Json avant de filtrer les possibles doublons.
         * puis on set notre attribut bikes avec la réponse obtenu
         * Si jamais il y a un problème dans la récupération on renvoie une erreur console.
         */
        const fetchDataBike = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/bike');
                const data = await response.json();

                // Filtrer les doublons dans les données des vélos.
                const uniqueBikes = data.filter((bike, index, self) =>
                        index === self.findIndex(b =>
                            b.latitude === bike.latitude && b.longitude === bike.longitude
                        )
                );
                //Passer le résultat à bikes pour le réutiliser ailleurs
                setBikes(uniqueBikes);
            } catch (error) {
                console.error('Une erreur s\'est produite:', error);
            }
        };

        /**
         * Fonction qui nous permet de récupérer les données de l'API Toilet via notre route
         * On récupère ensuite la réponse dans un Json avant de filtrer les possibles doublons.
         * puis on set notre attribut toilets avec la réponse obtenu
         * Si jamais il y a un problème dans la récupération on renvoie une erreur console.
         */
        const fetchDataToilet = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/wc');
                const data = await response.json();

                // Filtrer les doublons dans les données des toilettes.
                const uniqueToilets = data.filter((toilet, index, self) =>
                        index === self.findIndex(t =>
                            t.latitude === toilet.latitude && t.longitude === toilet.longitude
                        )
                );
                //Passer le résultat à toilets pour le réutiliser ailleurs
                setToilets(uniqueToilets);
            } catch (error) {
                console.error('Une erreur s\'est produite:', error);
            }
        };

        fetchDataBike();
        fetchDataToilet();
    }, []);


    /**
     * Fonction permettant de récupérer la localisation de l'utilisateur via le navigateur
     * Une fois que le navigateur récupère la localisation on le set dans une variable UserLocation
     * Si la récupération de la localisation a échouée ou est bloquée par l'utilisateur on renvoie une erreur
     * Si le navigateur n'autorise pas la récupération de la localisation on renvoie également une erreur
     */
    const getUserLocation = () => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                error => {
                    console.error('Une erreur s\'est produite lors de la récupération de la position:', error);
                    showCustomAlert("Une erreur s\'est produite lors de la récupération de votre position veuillez changer les paramètres de votre navigateur pour vous localiser à nouveau","Position Alert")
                }
            );
        } else {
            console.error('La géolocalisation n\'est pas prise en charge par ce navigateur.');
            setUserLocation([defaultLatitude, defaultLongitude]);
        }
    };

    // Effet pour récupérer la position de l'utilisateur.
    useEffect(() => {
        getUserLocation();
    }, []);

    // Effet pour centrer la carte sur la position de l'utilisateur lors de son chargement.
    useEffect(() => {
        if (userLocation && mapRef.current) {
            mapRef.current.setView(userLocation, 15);
        }
    }, [userLocation, mapRef.current]);

    // Effet pour réinitialiser l'état de la recherche soumise après qu'elle a été traitée.
    useEffect(() => {
        if (searchSubmitted && searchLocation) {
            setSearchSubmitted(false);
        }
    }, [searchSubmitted, searchLocation]);


    /**
     * Initialise le contrôle de routage pour afficher l'itinéraire entre la position de l'utilisateur et la toilette la plus proche.
     * @param {Array} userLocation - Les coordonnées de la position de l'utilisateur [latitude, longitude].
     * @param {Array} nearestLocation - Les coordonnées de la toilette la plus proche [latitude, longitude].
     */
    const initRouting = (userLocation, nearestLocation) => {
        // Utilise Promise.all pour importer les dépendances de leaflet-routing-machine
        Promise.all([
            import('leaflet-routing-machine'),
            import('leaflet-routing-machine/dist/leaflet-routing-machine.css')
        ]).then(([LRoutingMachine, css]) => {
            // Définit les points de passage pour l'itinéraire
            const waypoints = [
                L.latLng(userLocation), // Position de l'utilisateur
                L.latLng(nearestLocation[0], nearestLocation[1]) // Position de la toilette la plus proche
            ];

            // Fonction pour créer les marqueurs sur l'itinéraire
            const createMarker = (waypoint, options) => {
                if (waypoint && waypoint.latLng) {
                    // Vérifie si c'est le dernier point de passage pour afficher un marqueur spécial
                    if (waypoint.isLast) {
                        const nextWp = waypoint._plan[waypoint._index + 1];
                        if (nextWp && nextWp.latLng) {
                            return L.marker(waypoint.latLng, {icon: toiletIcon}); // Utilise une icône spéciale pour la toilette
                        }
                    }
                    return L.marker(waypoint.latLng); // Utilise l'icône par défaut
                } else {
                    return null; // Retourne null si le waypoint est invalide
                }
            };

            // Initialise le contrôle de routage avec les waypoints et les options spécifiées
            const routing = L.Routing.control({
                waypoints: waypoints,
                createMarker: createMarker,
                waypointIndices: [0, waypoints.length - 1], // Indique les indices des points de passage dans le tableau des waypoints
                routeWhileDragging: false, // Empêche le calcul automatique de l'itinéraire lors du déplacement des points de passage
                lineOptions: {
                    styles: [{color: 'blue', opacity: 1, weight: 3}] // Options de style pour la ligne d'itinéraire
                },
            }).addTo(mapRef.current); // Ajoute le contrôle de routage à la carte
            setRoutingControl(routing); // Met à jour l'état du contrôle de routage
        }).catch(error => {
            console.error('Erreur lors du chargement du contrôle de routing :', error); // Gère les erreurs de chargement
        });
    };

    /**
     * Même chose que la fonction précédente mais pour les vélos
     * @param userLocation
     * @param nearestLocation
     */
    const initRouting2 = (userLocation, nearestLocation) => {

        Promise.all([
            import('leaflet-routing-machine'),
            import('leaflet-routing-machine/dist/leaflet-routing-machine.css')
        ]).then(([LRoutingMachine, css]) => {
            waypoints = [
                L.latLng(userLocation),
                L.latLng(nearestLocation[0], nearestLocation[1])
            ];

            const createMarker = (waypoint, options) => {
                if (waypoint && waypoint.latLng) {
                    if (waypoint.isLast) {
                        const nextWp = waypoint._plan[waypoint._index + 1];
                        if (nextWp && nextWp.latLng) {
                            return L.marker(waypoint.latLng, {icon: bikeIcon});
                        }
                    }
                    return L.marker(waypoint.latLng);
                } else {
                    console.error("Waypoint is undefined or missing latLng property:", waypoint);
                    return null;
                }
            };

            const routing2 = L.Routing.control({
                waypoints: waypoints,
                createMarker: createMarker,
                waypointIndices: [0, waypoints.length - 1],
                routeWhileDragging: false,
                lineOptions: {
                    styles: [{color: 'red', opacity: 1, weight: 3}]
                },
            }).addTo(mapRef.current);
            setRoutingControl2(routing2);
        }).catch(error => {
            console.error('Erreur lors du chargement du contrôle de routing :', error);
        });
    };

    /**
     * Effet pour initialiser le routing vers la toilette la plus proche lors du chargement de l'application.
     */
    useEffect(() => {
        if (userLocation && mapRef.current) {
            const nearestToilet = findNearestToilet(userLocation, toilets);
            if (nearestToilet) {
                const nearestToiletLocation = [nearestToilet.latitude, nearestToilet.longitude];
                initRouting(userLocation, nearestToiletLocation, true);
            }
        }
    }, [userLocation, toilets]);

    /**
     * Effet pour initialiser le routing vers le vélo le plus proche lors du chargement de l'application.
     */
    useEffect(() => {
        if (userLocation && mapRef.current) {
            const nearestBike = findNearestBike(userLocation, bikes);
            if (nearestBike) {
                const nearestBikeLocation = [nearestBike.latitude, nearestBike.longitude];
                initRouting2(userLocation, nearestBikeLocation, false);
            }
        }
    }, [userLocation, bikes]);

    /**
     * Marqueur qui affiche une popUp sur la position de l'utilisateur
     * @type {[{popUp: string, geocode: *[]}]|*[]}
     */
    const markers = userLocation ? [
        {
            geocode: [userLocation[0], userLocation[1]],
            popUp: "Vous êtes ici"
        }
    ] : [];

    /**
     * Fonction asynchrone pour laisser un avis sur une toilette en effectuant une requête vers l'API.
     * Cette fonction prend en paramètres l'identifiant de la toilette, l'identifiant de l'utilisateur et la note attribuée.
     */
    const LaisserAvis = async (idToilet, idUser, note) => {
        try {
            // Envoi d'une requête GET à l'API avec les données nécessaires pour laisser un avis
            const response = await fetch(`http://127.0.0.1:8080/api/v1/user/${idUser}/${idToilet}/${note}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // Vérification du statut de la réponse de la requête
            if (response.status === 200) {
                // Si la requête est réussie (statut 200), définir l'état "newAvis" sur "OK"
                setNewAvis("OK");
            } else {
                // Si la requête échoue, définir l'état "newAvis" sur "KO"
                setNewAvis("KO");
            }
        } catch (error) {
            // Gestion des erreurs en cas d'échec de la requête
            console.error("Erreur lors de l'envoi de la requête :", error);
        }
    };

    /**
    * Fonction pour laisser un avis sur une toilette avec vérification de la connexion de l'utilisateur.
    * Cette fonction prend en paramètres l'identifiant de la toilette et la note attribuée.
    */
    const Avis = (idToilet, note) => {
        // Vérifier si un utilisateur est connecté et si l'identifiant de la toilette est défini
        if (loggedUser != null && idToilet != null) {
            // Si un utilisateur est connecté et l'identifiant de la toilette est défini, appeler la fonction pour laisser un avis
            LaisserAvis(idToilet, loggedUser.login, note);
        } else {
            // Sinon, afficher une alerte demandant à l'utilisateur de se connecter
            showCustomAlert("Veuillez vous connecter !", "Connexion Alert");
        }
    };

    /**
    * Effet déclenché après avoir laissé un avis sur une toilette. Cette fonction effectue les opérations suivantes :
    *  Si le nouvel avis est "OK", cela signifie qu'un avis a été laissé avec succès :
    *      Les données des toilettes sont récupérées à partir de l'API pour mettre à jour l'affichage.
    *      Les doublons dans les données des toilettes sont filtrés pour éviter les répétitions.
    *      Les données mises à jour sont définies dans l'état toilets.
    *  L'état "newAvis" est réinitialisé à "KO" pour attendre le prochain avis.
     */
    useEffect(() => {
        if (newAvis === "OK") {
            // Fonction asynchrone pour récupérer les données des toilettes après avoir laissé un avis
            const fetchDataToilet = async () => {
                try {
                    // Récupération des données des toilettes depuis l'API
                    const response = await fetch('http://localhost:8080/api/v1/wc');
                    const data = await response.json();

                    // Filtrage des doublons dans les données des toilettes pour éviter les répétitions
                    const uniqueToilets = data.filter((toilet, index, self) =>
                            index === self.findIndex(t =>
                                t.latitude === toilet.latitude && t.longitude === toilet.longitude
                            )
                    );

                    // Mise à jour des données des toilettes dans l'état de l'application
                    setToilets(uniqueToilets);
                } catch (error) {
                    console.error('Une erreur s\'est produite lors de la récupération des données des toilettes:', error);
                }
            };

            // Appel de la fonction pour récupérer les données des toilettes
            fetchDataToilet();

            // Suppression du contrôle de routing existant de la carte après avoir laissé un nouvel avis
            if (routingControl != null) {
                mapRef.current.removeControl(routingControl);
            }

            // Réinitialisation de l'état "newAvis" à "KO" pour attendre le prochain avis
            setNewAvis("KO");
        }
    }, [newAvis]);

    /**
    * Cette fonction vérifie les autorisations de géolocalisation de l'utilisateur.
    * Elle tente d'obtenir la position actuelle de l'utilisateur et met à jour la carte en conséquence.
    * Si la position est obtenue avec succès, elle met à jour l'état de l'emplacement de l'utilisateur.
    * Si une erreur se produit lors de la récupération de la position, elle est capturée et affichée dans la console.
     */
    const checkGeolocationPermission = async () => {
        try {
            const position = await getUserLocation();
            //Cette fonction est lié au bouton Me Localiser, cela veut donc dire que la localisation de l'utilisateur est peut-être déjà active.
            //C'est pour cela qu'on supprime les itinéraires liés à l'ancienne position de l'utilisateur
            mapRef.current.removeControl(routingControl);
            mapRef.current.removeControl(routingControl2);
            //si la position existe on change la userLocation
            if (position) {
                setUserLocation([position.coords.latitude, position.coords.longitude]);
            }
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération de la position:', error);
        }
    };

    return (

        <div>
            <div className="grid-container">
                <div className="col-1">
                    <div className="line">
                        <button id="loc" className="custom-btn btn-12" onClick={checkGeolocationPermission}><span>Cliquez !</span><span>Me localiser</span></button>
                    </div>
                    <div className="line log">
                        <button className="custom-btn btn-12" onClick={handleLoginButtonClick}><span>Cliquez !</span><span>Login</span></button>
                        <Login state={state} setState={setState} onLogin={handleLogin}/>
                    </div>
                    <div className="column_checkbox">
                        <label>
                            Afficher les vélos :
                            <input
                                className="checkbox"
                                type="checkbox"
                                checked={filterBike}
                                onChange={handleBikeFilterChange}
                            />
                        </label>
                        <label>
                            Afficher les toilettes :
                            <input
                                className="checkbox"
                                type="checkbox"
                                checked={filterToilet}
                                onChange={handleToiletFilterChange}
                            />
                        </label>
                    </div>
                    <div className="column">
                        <div className="line">
                            <div className="form__group field">
                                <input type="input" className="form__field" placeholder="Recherchez une localisation" name="name" id='name' onChange={handleSearchChange}
                                       required/>
                                <label htmlFor="name" className="form__label">Localisation</label>
                            </div>
                        </div>
                        <div className="line">
                            <button className="custom-btn btn-12" onClick={handleSearchSubmit}><span>Cliquez !</span><span>Validez</span></button>
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <MapContainer id="mapid" center={[47.216671, -1.55]} zoom={10} minZoom={12}
                                  style={{ height: "95%", width: "90%" }} ref={mapRef}>
                        {searchSubmitted && <SearchMap searchLocation={searchLocation}/>}
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        {markers.map((marker, index) => (
                            <Marker key={index} position={marker.geocode} icon={customIcon}>
                                <Popup>{marker.popUp}</Popup>
                            </Marker>
                        ))}
                        <MarkerClusterGroup
                            showCoverageOnHover={false}
                            disableClusteringAtZoom={15}
                            iconCreateFunction={bikeClusterCustomIcon}
                        >
                            {filteredBikes.map(bike => (
                                <Marker key={bike.id} position={[bike.latitude, bike.longitude]} icon={bikeIcon}
                                        eventHandlers={{ click: () => handleBikeMarkerClick(bike) }}>
                                    <CustomPopupBike>
                                        <strong>Nom de la station :</strong> {bike.nom}<br/>
                                        <p>Nombre de vélos disponibles : {bike.nombreDeVeloDisponibles}</p>
                                        <p>Nombre de bornes disponibles : {bike.nombreDeBorneDisponible}</p>
                                    </CustomPopupBike>
                                </Marker>
                            ))}
                        </MarkerClusterGroup>
                        <MarkerClusterGroup
                            showCoverageOnHover={false}
                            disableClusteringAtZoom={15}
                            iconCreateFunction={toiletClusterCustomIcon}
                        >
                            {filteredToilets.map(toilet => (
                                <Marker key={toilet.id} position={[toilet.latitude, toilet.longitude]} icon={toiletIcon} eventHandlers={{ click: () => handleToiletMarkerClick(toilet) }}>
                                    <CustomPopupToilet>
                                        <br/>
                                        <strong>Nom :</strong> {toilet.nom}
                                        <br/>
                                        <br/>
                                        <div className="rating-container">
                                            <strong> Rang: </strong>
                                            <div className="rating-wrapper">
                                                <Rating name="rating" value={toilet.ranking} readOnly precision={0.1}/>
                                            </div>
                                            <span>Avis ({toilet.nbr_avis} Avis)</span>
                                        </div>
                                        <br/>
                                        <div className="noteRating">
                                            <div>
                                                <label >Noter
                                                    <input className="labelNote" type="number" id="note" min="1" max="5" step="0.5"/>
                                                </label>
                                            </div>
                                            <div className="laisseAvis">
                                                <button className="custom-btn btn-12"
                                                        onClick={() => Avis(toilet.identifiant, document.getElementById("note").value)}><span>Cliquez !</span><span>Laissez Avis</span>
                                                </button>
                                            </div>
                                        </div>
                                    </CustomPopupToilet>
                                </Marker>
                            ))}
                        </MarkerClusterGroup>
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
export default App;
