import userDAO from "../dao/userDAO.mjs";

export default class ToilettesModel {
    identifiant
    nom
    latitude
    longitude
    ranking=-1
    nbr_avis=0

    constructor(obj) {
        Object.assign(this, obj)
    }
    //récupere tous les users et calculs la note moyenne de la toilet
    async calculMoyenne(){
        let datauser = await userDAO.findAll()
        let occurence = 0
        let totalnote = 0


        for (let i = 0; i < datauser.length; i++) {
            for (let j = 0; j < datauser[i].avisdonnees.length; j++) {

                if (datauser[i].avisdonnees[j].idToilette == this.identifiant) {

                    totalnote += datauser[i].avisdonnees[j].ranking
                    occurence++
                }

            }
        }

        this.ranking=totalnote==0?-1:totalnote/occurence
        this.nbr_avis=occurence
    }


}