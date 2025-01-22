export default class BikeModel {
    identifiant
    nom
    addresse
    nombreDeVeloDisponibles
    nombreDeBorneDisponible
    latitude
    longitude

    constructor(obj) {
//declare et instancie les attribut en recopiant ceux de obj
        Object.assign(this, obj)
    }

}
