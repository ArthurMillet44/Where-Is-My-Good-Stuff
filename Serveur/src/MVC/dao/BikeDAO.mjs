import {mongoose} from 'mongoose';
import BikeModel from "../model/BikeModel.mjs";
import res from "../../../HttpServer.mjs";

//Schema pour un vélo
const bikeSchema = new mongoose.Schema({
    identifiant: {type: Number, required: true},
    nom: {type: String, required: true},
    addresse: {type: String, required: true},
    nombreDeVeloDisponibles: {type: Number, required: true},
    nombreDeBorneDisponible: {type: Number, required: true},
    latitude:{type: Number, required: true},
    longitude:{type: Number, required: true}
})
const MongoBike = new mongoose.model('bikeCollection', bikeSchema)

const bikeDAO = {

    //Renvoie un tableau de vélo
    findAll: async () => {
        await bikeDAO.deleteAll()
        await MongoBike.insertMany(res.resVelo)
        const data = await MongoBike.find({},{_id:0,__v:0}).lean()
        return data.map(bike=>new BikeModel(bike))
    },
    //Supprime tous les vélos
    deleteAll:  async()=>{
        await MongoBike.deleteMany({})
    }



}







export default bikeDAO
