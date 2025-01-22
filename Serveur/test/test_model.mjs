"use strict"
import * as chai from "chai";
import User from '../src/MVC/model/userModel.mjs'
import BikeModel from "../src/MVC/model/BikeModel.mjs";
import ToilettesModel from "../src/MVC/model/ToilettesModel.mjs";
import Avis from "../src/MVC/model/AvisModel.mjs";
let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

describe("Test du model User", function () {
    it("create", async ()=> {
        const user = new User({login: "JoJo", password: "1234",avisdonnees:[]})
        expect(user).to.have.property('login','JoJo')
        expect(user).to.have.property('password','1234')
        expect(user).to.have.property('avisdonnees').that.is.an('array').and.is.empty;
        expect(user).to.have.all.keys('login','password','avisdonnees')});
});
describe("Test du model Bike", function () {
    it("create", async ()=> {
        const bike = new BikeModel({identifiant:1001,
            nom:"test",
            addresse:"test rue du test",
            nombreDeVeloDisponibles:10,
            nombreDeBorneDisponible:5,
            latitude:47,
            longitude:1
        })
        expect(bike).to.have.property('identifiant',1001)
        expect(bike).to.have.property('nom',"test")
        expect(bike).to.have.property('addresse',"test rue du test")
        expect(bike).to.have.property('nombreDeVeloDisponibles',10)
        expect(bike).to.have.property('nombreDeBorneDisponible',5)
        expect(bike).to.have.property('latitude',47)
        expect(bike).to.have.property('longitude',1)
        expect(bike).to.have.all.keys('identifiant','nom','addresse','nombreDeVeloDisponibles','nombreDeBorneDisponible','latitude','longitude')});
});
describe("Test du model Toilet", function () {
    it("create", async ()=> {
        const toilet = new ToilettesModel({identifiant:1,
            nom:"test",
            latitude:47,
            longitude:1,
            ranking:-1,
            nbr_avis:0
        })
        expect(toilet).to.have.property('identifiant',1)
        expect(toilet).to.have.property('nom',"test")
        expect(toilet).to.have.property('latitude',47)
        expect(toilet).to.have.property('longitude',1)
        expect(toilet).to.have.property('ranking',-1)
        expect(toilet).to.have.property('nbr_avis',0)
        expect(toilet).to.have.all.keys('identifiant','nom','latitude','longitude','ranking','nbr_avis')});
});
describe("Test du model Avis", function () {
    it("create", async ()=> {
        const avis = new Avis({idToilette: 1, ranking:2})
        expect(avis).to.have.property('idToilette',1)
        expect(avis).to.have.property('ranking',2)
        expect(avis).to.have.all.keys('idToilette','ranking')});
});
