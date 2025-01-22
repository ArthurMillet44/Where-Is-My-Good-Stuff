import {useEffect, useRef, useState} from "react";

//import des customAlter depuis App
import {showCustomAlert} from "./App";
/**
 * Composant de connexion qui gère le processus de connexion et d'inscription.
 * @param {boolean} state - État du composant de connexion (ouvert ou fermé).
 * @param {function} setState - Fonction pour modifier l'état du composant de connexion.
 * @param {function} onLogin - Fonction à appeler lorsqu'un utilisateur est connecté.
 */
export function Login({state, setState, onLogin}) {
    const [log, setLog] = useState(null); // État de la connexion (true, false ou null).
    const [valid, setValid] = useState(""); // État de validation de la connexion.
    const [loggedUser, setUser] = useState(null); // Utilisateur connecté.
    const loginRef = useRef(null); // Référence au composant de connexion.

    // Effet pour gérer l'état de validation de la connexion.
    useEffect(() => {
        let newVarValue = "";

        if (log === false) {
            newVarValue = "INVALID";
        } else if (log === true) {
            newVarValue = "VALID";
        }
        setValid(newVarValue);
    }, [log]);

    // Effet pour appeler la fonction onLogin lorsque l'utilisateur est connecté.
    useEffect(() => {
        onLogin(loggedUser);
    }, [loggedUser, onLogin]);

    // Effet pour fermer la boite de connexion lorsqu'un clic est effectué en dehors de celui-ci.
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (loginRef.current && !loginRef.current.contains(event.target)) {
                // Si le clic est en dehors de la boite Login, ferme la boite
                setState(false);
            }
        };

        // Ajoute un gestionnaire d'événements pour détecter les clics sur l'ensemble de la page
        document.addEventListener('mousedown', handleClickOutside);

        // Retire le gestionnaire d'événements lorsque le composant est démonté
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fonction pour gérer le processus de connexion.
    const login = async () => {
        const user = document.getElementById("login") == null ? null : document.getElementById("login").value;
        const password = document.getElementById("password") == null ? null : document.getElementById("password").value;
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/v1/user/login`, {
                method: "POST",
                body: JSON.stringify({
                    login: user,
                    password: password,
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                setLog(true); // Définit l'état de connexion comme réussie.
                document.getElementById("statut").innerHTML = "Login: " + user; // Affiche le nom d'utilisateur.
                showCustomAlert("Vous êtes connecté !", "Connexion Alert"); // Affiche une alerte custom de connexion réussie.
                setUser(await response.json()); // Enregistre les informations de l'utilisateur connecté.
            } else {
                setLog(false); // Définit l'état de connexion comme échouée.
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi de la requête :", error);
        }
    };

    // Fonction pour gérer le processus d'inscription.
    const register = async () => {
        const user = document.getElementById("login") == null ? null : document.getElementById("login").value;
        const password = document.getElementById("password") == null ? null : document.getElementById("password").value;
        try {
            const response = await fetch("http://127.0.0.1:8080/api/v1/user", {
                method: "POST",
                body: JSON.stringify({
                    login: user,
                    password: password,
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 201) {
                setLog(true); // Définit l'état de connexion comme réussie.
                document.getElementById("statut").innerHTML = "Login: " + user; // Affiche le nom d'utilisateur.
                showCustomAlert("Vous êtes connecté !", "Connexion Alert"); // Affiche une alerte de connexion réussie.
                setUser({login: user, password: password}); // Enregistre les informations de l'utilisateur connecté.
            } else {
                setLog(false); // Définit l'état de connexion comme échouée.
            }

        } catch (error) {
            console.error("Erreur lors de l'envoi de la requête :", error);
        }
    };

    // Fonction pour fermer le composant de connexion.
    const handleClose = () => {
        setState(!state);
    };

    return (
        <div>
            {state && <div className="overlay"></div>}
            <div className={state ? 'login-box displayBlock' : 'login-box'} ref={loginRef}>
                <h1>Login</h1>
                <span onClick={handleClose} className="close">&times;</span>
                <div className="content">

                    <div className="input-field">
                        <input type="text" id="login" placeholder="LOGIN" />
                    </div>
                    <div className="input-field">
                        <input type="password" id="password" placeholder="PASSWORD" />
                    </div>
                </div>
                <div id="validation">{valid}</div>
                <div className="action">
                    <button id="btn-register" onClick={register}>Register</button>
                    <button id="btn-login" onClick={login}>Login</button>
                </div>
            </div>
        </div>
    );
}