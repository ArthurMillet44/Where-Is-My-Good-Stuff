"use strict"
import fetch from 'node-fetch';
import {HttpsProxyAgent} from 'https-proxy-agent';
const proxy = process.env.https_proxy
let agent = null
if (proxy != undefined) {
    console.log(`Le proxy est ${proxy}`)
    agent = new HttpsProxyAgent(proxy);
}
else {
//pour pouvoir consulter un site avec un certificat invalide
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    console.log("Pas de proxy trouvé")
}
//url de l'api vélo et wc de data.nantesmetropole
const urlBike = 'https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_stations-velos-libre-service-nantes-metropole-disponibilites/'
const urlWC = 'https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_toilettes-publiques-nantes-metropole/'

//limit=-1 permet de récuperer toutes les données
let urlVelo = urlBike+'records?limit=-1'
//on récupere uniqement les toiletes disponibles à nantes
let urlToilet = urlWC+'records?where=commune%3D%2244109%22&limit=-1'

//On récupere les données au format json puis on les exportes
let responseVelo = agent!=null ? await fetch(urlVelo, {agent: agent}):await fetch(urlVelo)
let jsonBike = await responseVelo.json()



    let  resVelo= jsonBike.results.map((result)=> {

            return {
                identifiant: result.number,
                nom : result.name,
                addresse : result.address,
                nombreDeVeloDisponibles : result.available_bikes,
                nombreDeBorneDisponible : result.available_bike_stands,
                latitude:result.position.lat,
                longitude: result.position.lon
        }
        })
let responseWC = agent!=null ? await fetch(urlToilet, {agent: agent}):await fetch(urlToilet)
let jsonWC = await responseWC.json()



    let  resWC= jsonWC.results.map((result)=> {
            return {
                identifiant: result.gid,
                nom : result.nom,
                latitude:result.geo_shape.geometry.coordinates[1],
                longitude: result.geo_shape.geometry.coordinates[0]
        }
        })

export default {resVelo:resVelo,resWC:resWC}

