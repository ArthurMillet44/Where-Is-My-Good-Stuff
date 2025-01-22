import {mongoose} from 'mongoose';
import User from "../model/userModel.mjs";
import toiletteDAO from "./ToiletteDAO.mjs";
import Avis from "../model/AvisModel.mjs";
import {avisSchema} from "./AvisDAO.mjs";
import bcrypt from "bcrypt";

//Schema pour un user
const schema = new mongoose.Schema({
    login: {type: String, required: true},
    password: {type: String, required: true},
    avisdonnees: [avisSchema]
})
const MongoUser = new mongoose.model('userCollection', schema)

const userDAO = {

    //Renvoie un tableau de user
    findAll: async () => {
        const data = await MongoUser.find({},{_id:0})
        return data.map((user) => new User(user))
    },
    //Renvoie un user en fonction de son login ou null si il n'existe pas
    findByLogin: async (login) => {
        let data = await MongoUser.findOne({login: login})
        if (data != null)
            data = new User(data)
        return data
    },
    //Ajoute un user si il n'existe pas déjà et si il est valide. Si oui le renvoie sinon une promise.reject
    add: async (user) => {
        if (await userDAO.findByLogin(user.login))
            return Promise.reject("User already exists")
        try {
            const login =user.login
            const hashedPassword = await bcrypt.hash(user.password, 10)
            const newUser = new User({login:login,password: hashedPassword,avisdonnees:user.avisdonnees})
            const mongoUser = new MongoUser({...newUser})
            await mongoUser.save()
            return await userDAO.findByLogin(user.login)
        } catch (e) {
            return Promise.reject("Not a valid user")
        }
    },
    //Ajoute un avis dans user si le user existe. Si un avis existe déjà pour cette toilette il est remplacer
    addAvis: async (idToilette,login,note) =>{
        const data = await userDAO.findByLogin(login)
        if (data != null){
            let tab = data.avisdonnees
            if (tab == undefined){
                tab = []
            }
            //Supprime les doublons
            let newtab = []
            for (let i = 0; i<tab.length; i++){
                if (tab[i].idToilette != idToilette){
                    newtab.push(tab[i])
                }
            }
            tab = newtab
            tab.push({idToilette:idToilette,ranking:note})
            await MongoUser.updateOne({login:data.login}, {$set:{avisdonnees:tab}})
            const toilet = await toiletteDAO.findById(idToilette)
            await toilet.calculMoyenne()
            return MongoUser.findOne({login:login},{_id:0,__v:0,'avisdonnees._id':0})
        }else {
            return null
        }
    },
    //Prend un login et un password hasher et verifie si ils sont présent dans la BD
    verifLogin: async (login,password) =>{
        let data =  await userDAO.findByLogin(login)
        if (data != null) {
            if (await bcrypt.compare(password, data.password)) {
                return new User(data)
            } else {
                return Promise.reject("Invalid password")
            }
        }
        return Promise.reject("Invalid user")
    },

    //Supprime tous les users
    deleteAll: async ()=>{
        await MongoUser.deleteMany({})
    }
}
export default userDAO
