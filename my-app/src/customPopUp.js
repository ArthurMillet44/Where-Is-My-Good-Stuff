import {Popup} from "react-leaflet";
import toiletIconUrl from "./icons/toilet.png";
import bikeIconUrl from "./icons/velo2.png";

/**
 * Composant de popup personnalisé pour les toilettes.
 * @param {object} props - Propriétés du composant.
 * @param {JSX.Element} props.children - Contenu du popup.
 * @returns {JSX.Element} Popup personnalisé pour les toilettes.
 */
export const CustomPopupToilet = ({ children }) => {
    return (
        <Popup className="popUp">
            <div>
                <h3>Informations Complémentaires :</h3>
                <br/>
                <img src={toiletIconUrl} width="150" height="130"/>
                <div>
                    {children}
                </div>
            </div>
        </Popup>
    );
};

/**
 * Composant de popup personnalisé pour les vélos.
 * @param {object} props - Propriétés du composant.
 * @param {JSX.Element} props.children - Contenu du popup.
 * @returns {JSX.Element} Popup personnalisé pour les vélos.
 */
export const CustomPopupBike = ({ children }) => {
    return (
        <Popup className="popUp">
            <div>
                <h3>Informations Complémentaires :</h3>
                <br/>
                <img src={bikeIconUrl} width="100" height="100"/>
                <div>
                    {children}
                </div>
            </div>
        </Popup>
    );
};