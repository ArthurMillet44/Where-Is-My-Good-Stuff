import L, {Icon} from "leaflet";
import bikeIconUrl from "./icons/velo2.png";
import toiletIconUrl from "./icons/toilet.png";
import repereIconUrl from "./icons/repere.png";

/**
 * Fonction pour créer une icône de regroupement personnalisée pour les stations de vélos.
 * @param {L.MarkerClusterGroup} cluster - Groupe de marqueurs de regroupement.
 * @returns {L.DivIcon} Icône de regroupement personnalisée.
 */
export const bikeClusterCustomIcon = function (cluster) {
    return L.divIcon({
        html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
        className: "bike-cluster",
        iconSize: L.point(33, 33, true)
    });
};

/**
 * Fonction pour créer une icône de regroupement personnalisée pour les toilettes.
 * @param {L.MarkerClusterGroup} cluster - Groupe de marqueurs de regroupement.
 * @returns {L.DivIcon} Icône de regroupement personnalisée.
 */
export const toiletClusterCustomIcon = function (cluster) {
    return L.divIcon({
        html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
        className: "toilet-cluster",
        iconSize: L.point(33, 33, true)
    });
};

/**
 * Icône personnalisée pour un marqueur générique.
 */
export const customIcon = new Icon({
    iconUrl: repereIconUrl,
    iconSize: [45, 45]
});

/**
 * Icône pour les stations de vélos.
 */
export const bikeIcon = L.icon({
    iconUrl: bikeIconUrl,
    iconSize: [50, 50],
});

/**
 * Icône pour les toilettes.
 */
export const toiletIcon = L.icon({
    iconUrl: toiletIconUrl,
    iconSize: [75, 75],
});