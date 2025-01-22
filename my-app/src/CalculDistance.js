/**
 * Calcul de la distance en kilomètres entre deux points géographiques donnés en latitude et longitude.
 * Utilise la formule de la distance haversine.
 * @param {number} lat1 - Latitude du premier point en degrés.
 * @param {number} lon1 - Longitude du premier point en degrés.
 * @param {number} lat2 - Latitude du deuxième point en degrés.
 * @param {number} lon2 - Longitude du deuxième point en degrés.
 * @returns {number} La distance entre les deux points en kilomètres.
 */
const distance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Rayon de la Terre en kilomètres.
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Différence de latitude convertie en radians.
    const dLon = (lon2 - lon1) * (Math.PI / 180); // Différence de longitude convertie en radians.
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2); // Calcul de la formule de la distance haversine.
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Calcul de l'angle central.
    const d = R * c; // Distance calculée en multipliant l'angle central par le rayon de la Terre.
    return d; // Retourne la distance en kilomètres.
}

/**
 * Trouve les toilettes les plus proches de la position de l'utilisateur parmi une liste de toilettes données.
 * @param {number[]} userLocation - Position de l'utilisateur sous forme de tableau [latitude, longitude].
 * @param {object[]} toilets - Liste des toilettes avec leurs informations.
 * @param {number} toilets[].latitude - Latitude de la toilette.
 * @param {number} toilets[].longitude - Longitude de la toilette.
 * @returns {object|null} Les informations de la toilette la plus proche ou null s'il n'y a pas de toilettes.
 */
const findNearestToilet = (userLocation, toilets) => {
    if (userLocation[0] < -90 || userLocation[0] > 90 || userLocation[1] < -180 || userLocation[1] > 180){
        throw Error("userLocation Invalid")
    }
    let nearestToilet = null; // Initialisation de la toilette la plus proche.
    let minDistance = Infinity; // Initialisation de la distance minimale avec une valeur infinie.

    // Parcours de la liste des toilettes.
    toilets.forEach(toilet => {
        // Calcul de la distance entre la position de l'utilisateur et la toilette actuelle.
        const d = distance(userLocation[0], userLocation[1], toilet.latitude, toilet.longitude);
        // Vérification si la distance calculée est inférieure à la distance minimale.
        if (d < minDistance) {
            minDistance = d; // Mise à jour de la distance minimale.
            nearestToilet = toilet; // Mise à jour de la toilette la plus proche.
        }
    });

    return nearestToilet; // Retourne les informations de la toilette la plus proche ou null.
}

//Même chose pour la findNearestToilet mais avec les stations de vélos.
const findNearestBike = (userLocation, bikes) => {
    if (userLocation[0] < -90 || userLocation[0] > 90 || userLocation[1] < -180 || userLocation[1] > 180){
        throw Error("userLocation Invalid")
    }
    let nearestBike = null;
    let minDistance = Infinity;

    bikes.forEach(bike => {
        const d = distance(userLocation[0], userLocation[1], bike.latitude, bike.longitude);
        if (d < minDistance) {
            minDistance = d;
            nearestBike = bike;
        }
    });

    return nearestBike;
}

module.exports = { findNearestToilet, findNearestBike };
