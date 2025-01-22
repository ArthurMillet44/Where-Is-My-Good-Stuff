"use strict"
import express from 'express'
import bikeController from "../controller/BikeController.mjs";
import toiletteController from "../controller/ToiletteController.mjs";
import userController from "../controller/userController.mjs";
import User from "../model/userModel.mjs";
import ToilettesModel from "../model/ToilettesModel.mjs";

const router = express.Router()

router
    .route('/bike')
    .get(async (req, res) =>{
        // #swagger.summary = 'renvoie tous les vélo'
        // #swagger.description = 'renvoie tous les vélo'

        res.status(200).send(await bikeController.findAll())
    })

router
    .route('/wc')
    .get(async (req, res) =>{
        // #swagger.summary = 'renvoie tous les WC'
        // #swagger.description = 'renvoie tous les WC'

        res.status(200).send(await toiletteController.findAll())
    })
    .post(async (req,res)=>{
        // #swagger.summary = 'ajoute un WC'
        // #swagger.description = 'ajoute un WC'
        try {
            const newtoilet = new ToilettesModel({identifiant:req.body.identifiant,nom:req.body.nom,latitude:req.body.latitude,longitude:req.body.longitude,ranking:-1,nbr_avis:0})
            const toilet = toiletteController.add(newtoilet)
            res.status(201).send(toilet)
        }catch (e) {
            return res.status(400).send({message: 'not added'})
        }
    })
router
    .route('/wc/:idToilette')
    .get(async (req, res) =>{
        // #swagger.summary = 'renvoie un WC en fonction de son id'
        // #swagger.description = 'renvoie un WC en fonction de son id'
        const myId = decodeURIComponent(req.params.idToilette)
        const monToilette = await toiletteController.findById(myId)
        if (monToilette==null)
            return res.status(404).send({message: "Toilette Non Trouvé"})
        else
            return res.status(200).send(monToilette)

    })
router
    .route('/user')
    .get(async (req, res) =>{
        // #swagger.summary = 'renvoie tous les users'
        // #swagger.description = 'renvoie tous les users'
        res.status(200).send(await userController.findAll())})
    .post(async (req, res) =>{
        // #swagger.summary = 'ajoute un user'
        // #swagger.description = 'ajoute un user si il est valide et qu'il n'existe pas déjà'
        try {

            const newUser = new User({login:req.body.login,password:req.body.password,avisdonnees:[]})
            const user = await  userController.add(newUser)
            return res.status(201).send(user)
        }
        catch (e) {
            return res.status(400).send({message: 'not added'})
        }
    })
    .delete(async (req,res)=> {
        // #swagger.summary = 'supprime tous les users'
        // #swagger.description = 'supprime tous les users'
        return res.status(200).send(await userController.remove())
    })
router
    .route('/user/:login')
    .get(async (req, res) =>{
        // #swagger.summary = 'renvoie un user selon son login'
        // #swagger.description = 'renvoie un user selon son login'
        const login = decodeURIComponent(req.params.login)
        const user = await userController.findByLogin(login)
        if (user==null)
            return res.status(404).send({message: "user not found"})
        else
            return res.status(200).send(user)
    })

router
    .route('/user/login')
    .post( async (req, res) =>{
        // #swagger.summary = 'identification'
        // #swagger.description = 'vérifie si les identifiants du user et le renvoie si ils sont valident'
        try {
            const user = await userController.verifLogin(req.body.login,req.body.password)
            return res.status(200).send(user)
        }catch (e) {
            return res.status(404).send({message: "user not found"})
        }
    })
router
    .route('/user/:login/:idToilette/:note')
    .get(async (req, res) =>{
        // #swagger.summary = 'ajoute un avis'
        // #swagger.description = 'ajoute un avis dans un user pour un idToilette et une note donnée'
        const login = decodeURIComponent(req.params.login)
        const idToilette = parseInt(decodeURIComponent(req.params.idToilette))
        const note = decodeURIComponent(req.params.note)
        try {
            return res.status(200).send(await userController.addAvis(idToilette,login,note))
        }catch (e) {
            console.log(e)
            return res.status(400).send({message: "review not added"})
        }
    })



export default router