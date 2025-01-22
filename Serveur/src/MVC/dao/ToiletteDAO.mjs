import {mongoose} from 'mongoose';
import res from "../../../HttpServer.mjs";
import ToilettesModel from "../model/ToilettesModel.mjs";

//Schema d'un WC
const wcSchema = new mongoose.Schema({
    identifiant: {type: Number, required: true},
    nom: {type: String, required: true},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    ranking: {type: Number, required: true},
    nbr_avis: {type: Number, required: true}
})
const MongoWC = new mongoose.model('toiletCollection', wcSchema)

const toiletteDAO = {

    //Renvoie un tableau de toilette
    findAll: async () => {
        await toiletteDAO.deleteAll()
        for (let i = 0; i < res.resWC.length; i++) {

            let donneeWC = {
                identifiant: parseInt(res.resWC[i].identifiant),
                nom: res.resWC[i].nom,
                latitude: parseFloat(res.resWC[i].latitude),
                longitude: parseFloat(res.resWC[i].longitude)
            }
            let WC = new ToilettesModel(donneeWC)

            await WC.calculMoyenne()
            await toiletteDAO.addToilette(WC)
        }

        const data = await MongoWC.find({}, {_id: 0, __v: 0}).lean()
        return data.map(toilet => new ToilettesModel(toilet))
    },
    //Renvoie une toillete en fonction de son id
    findById: async (idWC) => {
        const myToilette = await MongoWC.findOne({identifiant: idWC}, {_id: 0}).lean()
        return myToilette == null ? null : new ToilettesModel(myToilette)
    },
    //Supprime toutes les toiletes
    deleteAll: async () => {
        await MongoWC.deleteMany({})
    },
    //Ajoute  une toilete
    addToilette: async (Toilette) => {

        await MongoWC.collection.insertOne({
            identifiant: Toilette.identifiant,
            nom: Toilette.nom,
            latitude: Toilette.latitude,
            longitude: Toilette.longitude,
            ranking: Toilette.ranking,
            nbr_avis: Toilette.nbr_avis
        })
    }



}

export default toiletteDAO
