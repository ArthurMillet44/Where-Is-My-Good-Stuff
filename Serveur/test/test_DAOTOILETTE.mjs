"use strict"
import * as chai from "chai";

let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;
import {mongoose} from "mongoose";
import ToiletteDAO from "../src/MVC/dao/ToiletteDAO.mjs";
import res from "../HttpServer.mjs";
import toiletteDAO from "../src/MVC/dao/ToiletteDAO.mjs";
import UserDAO from "../src/MVC/dao/userDAO.mjs";
import ToilettesModel from "../src/MVC/model/ToilettesModel.mjs";
import User from "../src/MVC/model/userModel.mjs";




//Utilise l'environnement du serveur (TEST, DEV, PROD)
describe("CalculMoyenne()", function () {
    beforeEach(async () => {
        await mongoose.connection.close()
        const {MongoMemoryServer} = await import('mongodb-memory-server')
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri)
    })
    afterEach(async () => {
        await mongoose.connection.close()
    })



    it("no user", async () => {
        let  donneeToilette= {
            identifiant: 1,
            nom: "Jean_pierre",
            latitude: -1,
            longitude: -1,
        }
        let WC1=new ToilettesModel(donneeToilette)

        await WC1.calculMoyenne()
        expect(WC1.ranking).to.eql(-1)
        expect(WC1.nbr_avis).to.eql(0)
    });
    it("one user w/out review", async () => {
        let  donneeToilette= {
            identifiant: 1,
            nom: "Jean_pierre",
            latitude: -1,
            longitude: -1,
        }
        let WC1=new ToilettesModel(donneeToilette)

        let user1 = {
            login: "utilisateur1",
            password: "motdepasse1",
            avisdonnees: [
                {idToilette: 2, ranking: 3}
            ]
        }

        await UserDAO.add(user1)
        await WC1.calculMoyenne()
        expect(WC1.ranking).to.eql(-1)
        expect(WC1.nbr_avis).to.eql(0)
    });
    it("one user w/ one review [no match]", async () => {
        let  donneeToilette= {
            identifiant: 1,
            nom: "Jean_pierre",
            latitude: -1,
            longitude: -1,
        }
        let WC1=new ToilettesModel(donneeToilette)

        let user1 = {
            login: "utilisateur1",
            password: "motdepasse1",
            avisdonnees: [
                {idToilette: 2, ranking: 3}
            ]
        }
        await UserDAO.add(user1)

        await WC1.calculMoyenne()
        expect(WC1.ranking).to.eql(-1)
        expect(WC1.nbr_avis).to.eql(0)
    });

    it("one user w/ one review [match]", async () => {
        let  donneeToilette= {
            identifiant: 2,
            nom: "Jean_pierre",
            latitude: -1,
            longitude: -1,
        }
        let WC1=new ToilettesModel(donneeToilette)

        let user1 = {
            login: "utilisateur1",
            password: "motdepasse1",
            avisdonnees: [ {idToilette: 2, ranking: 3}]
        }

        await UserDAO.add(user1)
        await WC1.calculMoyenne()
        expect(WC1.ranking).to.eql(3)
        expect(WC1.nbr_avis).to.eql(1)
    });

    it("two users w/ one review [match]", async () => {
        let  donneeToilette= {
            identifiant: 2,
            nom: "Jean_pierre",
            latitude: -1,
            longitude: -1,
        }
        let WC1=new ToilettesModel(donneeToilette)

        let user1 = {
            login: "utilisateur1",
            password: "motdepasse1",
            avisdonnees: [ {idToilette: 2, ranking: 2.5}]

        }
        let user2 = {
            login: "utilisateur2",
            password: "motdepasse2",
            avisdonnees: [ {idToilette: 2, ranking: 3.7}]
        }
        await UserDAO.add(user1)
        await UserDAO.add(user2)
        await WC1.calculMoyenne()

        expect(WC1.ranking).to.eql(3.1)
        expect(WC1.nbr_avis).to.eql(2)
    });

});


describe("findAll()",function (){
    beforeEach(async () => {
        await mongoose.connection.close()
        const {MongoMemoryServer} = await import('mongodb-memory-server')
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri)
    })
    afterEach(async () => {
        await mongoose.connection.close()
    })


    it("findall toilet",async ()=>{

        let data=await toiletteDAO.findAll()

        expect(data.length).to.eql(res.resWC.length)
        const estDuBonType = data.every(toilette => toilette instanceof ToilettesModel);
        expect(estDuBonType).to.eql(true)
    });


});

describe("findbyID()",function (){
    beforeEach(async () => {
        await mongoose.connection.close()
        const {MongoMemoryServer} = await import('mongodb-memory-server')
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri)
    })
    afterEach(async () => {
        await mongoose.connection.close()
    })

    it("WC introuvable",async ()=>{
        let  donneeToilette= {
            identifiant: 2,
            nom: "Jean_pierre",
            latitude: -1,
            longitude: -1,
        }
        let WC1=new ToilettesModel(donneeToilette)
        await ToiletteDAO.addToilette(WC1)

        let data=await toiletteDAO.findById(-1)

        expect(data).to.eql(null)
    });
    it("WC trouvable",async ()=>{
        let  donneeToilette= {
            identifiant: 2,
            nom: "Jean_pierre",
            latitude: -1,
            longitude: -1,
        }
        let WC1=new ToilettesModel(donneeToilette)
        await ToiletteDAO.addToilette(WC1)

        let data=await toiletteDAO.findById(2)
        expect(data).to.eql(WC1)
    })
})




