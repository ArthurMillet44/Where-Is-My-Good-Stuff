"use strict"
import * as chai from "chai";
let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;
import supertest from "supertest"
import server from "../server.mjs";
import {mongoose} from "mongoose";
const requestWithSupertest = supertest(server)

describe("GET /bike", function () {
    before(async () => {
        await mongoose.connection.close()
        const {MongoMemoryServer} = await import('mongodb-memory-server')
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri)
    })

    after(async () => {
        await mongoose.connection.close()
    })
    it("GET /bike", async () => {
        const response = await requestWithSupertest.get("/api/v1/bike");
        expect(response.status).to.eql(200)

    });
});
describe("GET /wc", function () {
    before(async () => {
        await mongoose.connection.close()
        const {MongoMemoryServer} = await import('mongodb-memory-server')
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri)
    })

    after(async () => {
        await mongoose.connection.close()
    })
    it("GET /wc", async () => {
        const response = await requestWithSupertest.get("/api/v1/wc");
        expect(response.status).to.eql(200)

    });
    it("GET /wc/1 toilet not found", async () => {
        const response = await requestWithSupertest.get("/api/v1/wc/1");
        expect(response.status).to.eql(404)
        expect(response.body).to.be.deep.equal({ message: 'Toilette Non Trouvé' })
    });
    it("GET /wc/1 toilet exist", async () => {
        await requestWithSupertest.post("/api/v1/wc")
            .set('Content-type', 'application/json')
            .send({
                identifiant: 1,
                nom: "Jean_pierre",
                latitude: -1,
                longitude: -1,

            })
        const response = await requestWithSupertest.get("/api/v1/wc/1");
        expect(response.status).to.eql(200)
        expect(response.body).to.be.deep.equal({
            identifiant: 1,
            nom: "Jean_pierre",
            latitude: -1,
            longitude: -1,
            ranking:-1,
            nbr_avis:0
        })

    });
});

describe("GET /user", function () {
    before(async ()=>{
        await mongoose.connection.close()
        const {MongoMemoryServer}  = await import('mongodb-memory-server')
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri)
    })

    after(async ()=>{
        await mongoose.connection.close()
    })
    it("GET /user", async ()=> {
        const response = await requestWithSupertest.get("/api/v1/user");
        expect(response.status).to.eql(200)

    });

    it("GET /user/XXX not found", async  ()=> {
        const response = await requestWithSupertest.get("/api/v1/user/XXX");
        expect(response.status).to.eql(404)
        expect(response.body).to.be.deep.equal({ message: 'user not found' })

    });

    it("POST /user add a valid user", async  ()=> {
        const response = await requestWithSupertest.post("/api/v1/user")
            .set('Content-type', 'application/json')
            .send({login: 'JoJo', password: 'pass',avisdonnees:[]})
        expect(response.status).to.eql(201)
    });

    it("POST /user add a invalid user wrong attribut", async  ()=> {
        const response = await requestWithSupertest.post("/api/v1/user")
            .set('Content-type', 'application/json')
            .send({loginnnnnnnn: 'JoJo', password: 'pass',avisdonnees:[]})
        expect(response.status).to.eql(400)
        expect(response.body).to.be.deep.equal({message: "not added"})
    });

    it("POST /user add a invalid user missing attribut on existing login", async  ()=> {
        const response = await requestWithSupertest.post("/api/v1/user")
            .set('Content-type', 'application/json')
            .send({login: 'JoJo'})
        expect(response.status).to.eql(400)
        expect(response.body).to.be.deep.equal({message: "not added"})
    });

    it("POST /user an existing user", async  ()=> {
        const response = await requestWithSupertest.post("/api/v1/user")
            .set('Content-type', 'application/json')
            .send({login: 'JoJo', password : '4321',avisdonnees:[]})
        expect(response.status).to.eql(400)
        expect(response.body).to.be.deep.equal({message: "not added"})
    });

    it("DELETE /user all user", async  ()=> {
        const response = await requestWithSupertest.delete("/api/v1/user")
        expect(response.status).to.eql(200)
    });
    it("GET /user find an existing user", async  ()=> {
        await requestWithSupertest.delete("/api/v1/user")
        await requestWithSupertest.post("/api/v1/user")
            .set('Content-type', 'application/json')
            .send({login: 'JoJo', password : '4321',avisdonnees:[]})
        const response = await requestWithSupertest.get("/api/v1/user/JoJo")
        expect(response.status).to.eql(200)
    });
    it("POST /user/login log an existing user", async  ()=> {
        await requestWithSupertest.delete("/api/v1/user")
        await requestWithSupertest.post("/api/v1/user")
            .set('Content-type', 'application/json')
            .send({login: 'JoJo', password : '4321',avisdonnees:[]})
        const response = await requestWithSupertest.post("/api/v1/user/login")
            .set('Content-type', 'application/json')
            .send({login: 'JoJo', password : '4321',avisdonnees:[]})
        expect(response.status).to.eql(200)
    });
    it("POST /user/login log an invalid user", async  ()=> {
        await requestWithSupertest.delete("/api/v1/user")
        await requestWithSupertest.post("/api/v1/user")
            .set('Content-type', 'application/json')
            .send({login: 'JoJo', password : '4321',avisdonnees:[]})
        const response = await requestWithSupertest.post("/api/v1/user/login")
            .set('Content-type', 'application/json')
            .send({login: 'JoJo', password : '5678',avisdonnees:[]})
        expect(response.status).to.eql(404)
        expect(response.body).to.be.deep.equal({message: "user not found"})
    });
    it("GET /user add review", async  ()=> {
        await requestWithSupertest.delete("/api/v1/user")
        await requestWithSupertest.post("/api/v1/user")
            .set('Content-type', 'application/json')
            .send({login: 'JoJo', password : '4321',avisdonnees:[]})
        await requestWithSupertest.post("/api/v1/wc")
            .set('Content-type', 'application/json')
            .send({
                identifiant: 1,
                nom: "Jean_pierre",
                latitude: -1,
                longitude: -1,
            })
        const response = await requestWithSupertest.get("/api/v1/user/JoJo/1/2")
        expect(response.status).to.eql(200)
        expect(response.body.avisdonnees).to.be.deep.equal([{idToilette: 1,ranking:2}])
    });
    it("GET /user add second review on same toilet", async  ()=> {
        await requestWithSupertest.delete("/api/v1/user")
        await requestWithSupertest.post("/api/v1/user")
            .set('Content-type', 'application/json')
            .send({login: 'JoJo', password : '4321',avisdonnees:[]})
        await requestWithSupertest.post("/api/v1/wc")
            .set('Content-type', 'application/json')
            .send({
                identifiant: 1,
                nom: "Jean_pierre",
                latitude: -1,
                longitude: -1,
            })
        await requestWithSupertest.get("/api/v1/user/JoJo/1/2")
        const response = await requestWithSupertest.get("/api/v1/user/JoJo/1/4")
        expect(response.status).to.eql(200)
        expect(response.body.avisdonnees).to.be.deep.equal([{idToilette: 1,ranking:4}])
    });

});
