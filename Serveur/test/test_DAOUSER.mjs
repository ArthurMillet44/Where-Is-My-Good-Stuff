"use strict"
import * as chai from "chai";

import {mongoose} from "mongoose";
import res from "../HttpServer.mjs";
import userDAO from "../src/MVC/dao/userDAO.mjs";
import User from "../src/MVC/model/userModel.mjs";
import ToilettesModel from "../src/MVC/model/ToilettesModel.mjs";
import ToiletteDAO from "../src/MVC/dao/ToiletteDAO.mjs";

let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

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


    it("findall user",async ()=>{
        let  donneeUser= {
            login: "toto",
            password: "password",
            avisdonnees:[]
        }
        let user=new User(donneeUser)
        await userDAO.add(user)
        let data=await userDAO.findAll()

        expect(data.length).to.eql(1)
        const estDuBonType = data.every(user => user instanceof User);
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

    it("User introuvable",async ()=>{
        let  donneeUser= {
            login: "toto",
            password: "password",
            avisdonnees:[]
        }
        let user=new User(donneeUser)
        await userDAO.add(user)

        let data=await userDAO.findByLogin("john")

        expect(data).to.eql(null)
    });
    it("User trouvable",async ()=>{
        let  donneeUser= {
            login: "toto",
            password: "password",
            avisdonnees:[]
        }
        let user=new User(donneeUser)
        await userDAO.add(user)

        let data=await userDAO.findByLogin("toto")
        expect(data.login).to.eql(user.login)
    })
})

describe("addAvis()",function (){
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

    it("Avis non ajouté",async ()=>{
        let  donneeUser= {
            login: "toto",
            password: "password",
            avisdonnees:[]
        }
        let  donneeToilette= {
            identifiant: 1,
            nom: "Jean_pierre",
            latitude: -1,
            longitude: -1,
        }

        let user=new User(donneeUser)
        let WC=new ToilettesModel(donneeToilette)
        await userDAO.add(user)
        await ToiletteDAO.addToilette(WC)

        let data= await userDAO.addAvis(1,"john",5)

        expect(data).to.eql(null)
    });
    it("Avis ajouté",async ()=>{
        let  donneeUser= {
            login: "toto",
            password: "password",
            avisdonnees:[]
        }
        let  donneeToilette= {
            identifiant: 1,
            nom: "Jean_pierre",
            latitude: -1,
            longitude: -1,
        }

        let user=new User(donneeUser)
        let WC=new ToilettesModel(donneeToilette)
        await userDAO.add(user)
        await ToiletteDAO.addToilette(WC)

        let data=await userDAO.addAvis(1,"toto",5)

        const expectedData = [{ idToilette: 1, ranking: 5 }];
        const actualData = data.avisdonnees.map(item => ({ idToilette: item.idToilette, ranking: item.ranking }));

        expect(actualData).to.deep.equal(expectedData);



    })
})
