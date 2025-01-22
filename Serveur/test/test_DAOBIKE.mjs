"use strict"
import * as chai from "chai";
import {mongoose} from "mongoose";
import res from "../HttpServer.mjs";
import bikeDAO from "../src/MVC/dao/BikeDAO.mjs";
import BikeModel from "../src/MVC/model/BikeModel.mjs";

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


    it("findall bike",async ()=>{

        let data=await bikeDAO.findAll()

        expect(data.length).to.eql(res.resVelo.length)
        const estDuBonType = data.every(bike => bike instanceof BikeModel);
        expect(estDuBonType).to.eql(true)
    });


});

