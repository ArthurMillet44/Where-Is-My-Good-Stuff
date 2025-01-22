"use strict";

// Import des modules de test
import * as chai from "chai";
// import {mongoose} from "mongoose"; (si nécessaire)

// Import de la fonction à tester depuis le module CalculDistance
import CalculDistance from "../src/CalculDistance.js";
const { findNearestToilet, findNearestBike } = CalculDistance;

// Définition des outils de test
let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

// Tests pour la fonction findNearestToilet()
describe("findNearestToilet()", function () {

    it("should return the nearest toilet", function () {
        // Emplacement utilisateur fictif
        const userLocation = [47.1234, -1.5678];

        // Tableau fictif de toilettes
        const toilets = [
            { id: 1, latitude: 47.1235, longitude: -1.5679 },
            { id: 2, latitude: 47.124, longitude: -1.566 },
            { id: 3, latitude: 47.125, longitude: -1.568 },
            { id: 4, latitude: 47.126, longitude: -1.569 }
        ];

        // Toilette la plus proche attendue
        const expectedNearestToilet = { id: 1, latitude: 47.1235, longitude: -1.5679 };

        // Appel de la fonction
        const nearestToilet = findNearestToilet(userLocation, toilets);

        // Vérification que la toilette la plus proche correspond à celle attendue
        expect(nearestToilet).to.eql(expectedNearestToilet);
    });

    it("should return null if no toilets are provided", function () {
        // Emplacement utilisateur fictif
        const userLocation = [47.1234, -1.5678];

        // Tableau vide de toilettes
        const toilets = [];

        // Appel de la fonction
        const nearestToilet = findNearestToilet(userLocation, toilets);

        // Vérification que la toilette la plus proche est nulle
        expect(nearestToilet).to.be.null;
    });

    // Tests pour les cas où l'emplacement utilisateur est invalide
    it("should throw an error if userLocation is invalid (latitude out of range)", function () {
        // Emplacement utilisateur invalide avec une latitude hors plage
        const invalidUserLocation = [-100, -1.5678];

        // Tableau fictif de toilettes
        const toilets = [
            { id: 1, latitude: 47.1235, longitude: -1.5679 },
            { id: 2, latitude: 47.124, longitude: -1.566 },
            { id: 3, latitude: 47.125, longitude: -1.568 },
            { id: 4, latitude: 47.126, longitude: -1.569 }
        ];

        // Appel de la fonction avec un emplacement utilisateur invalide et vérification qu'elle lance une erreur
        expect(() => findNearestToilet(invalidUserLocation, toilets)).to.throw("userLocation Invalid");
    });

    it("should throw an error if userLocation is invalid (longitude out of range)", function () {
        // Emplacement utilisateur invalide avec une longitude hors plage
        const invalidUserLocation = [47.1234, 200];

        // Tableau fictif de toilettes
        const toilets = [
            { id: 1, latitude: 47.1235, longitude: -1.5679 },
            { id: 2, latitude: 47.124, longitude: -1.566 },
            { id: 3, latitude: 47.125, longitude: -1.568 },
            { id: 4, latitude: 47.126, longitude: -1.569 }
        ];

        // Appel de la fonction avec un emplacement utilisateur invalide et vérification qu'elle lance une erreur
        expect(() => findNearestToilet(invalidUserLocation, toilets)).to.throw("userLocation Invalid");
    });

    it("should throw an error if userLocation is invalid (latitude out of range)", function () {

        const invalidUserLocation = [100, -1.5678];


        const toilets = [
            { id: 1, latitude: 47.1235, longitude: -1.5679 },
            { id: 2, latitude: 47.124, longitude: -1.566 },
            { id: 3, latitude: 47.125, longitude: -1.568 },
            { id: 4, latitude: 47.126, longitude: -1.569 }
        ];


        expect(() => findNearestToilet(invalidUserLocation, toilets)).to.throw("userLocation Invalid");
    });






});

// Tests pour la fonction findNearestBike()
describe("findNearestBike()", function () {

    it("should return the nearest bike", function () {
        // Emplacement utilisateur fictif
        const userLocation = [47.1234, -1.5678];

        // Tableau fictif de stations de vélos
        const bikes = [
            { id: 1, latitude: 47.1235, longitude: -1.5679 },
            { id: 2, latitude: 47.124, longitude: -1.566 },
            { id: 3, latitude: 47.125, longitude: -1.568 },
            { id: 4, latitude: 47.126, longitude: -1.569 }
        ];

        // Vélo le plus proche attendu
        const expectedNearestBike = { id: 1, latitude: 47.1235, longitude: -1.5679 };

        // Appel de la fonction
        const nearestBike = findNearestBike(userLocation, bikes);

        // Vérification que le vélo le plus proche correspond à celui attendu
        expect(nearestBike).to.eql(expectedNearestBike);
    });

    it("should return null if no bikes are provided", function () {
        // Emplacement utilisateur fictif
        const userLocation = [47.1234, -1.5678];

        // Tableau vide de stations de vélos
        const bikes = [];

        // Appel de la fonction
        const nearestBike = findNearestBike(userLocation, bikes);

        // Vérification que le vélo le plus proche est nul
        expect(nearestBike).to.be.null;
    });

    // Tests pour les cas où l'emplacement utilisateur est invalide
    it("should throw an error if userLocation is invalid (latitude out of range)", function () {
        // Emplacement utilisateur invalide avec une latitude hors plage
        const invalidUserLocation = [-100, -1.5678];

        // Tableau fictif de stations de vélos
        const bikes = [
            { id: 1, latitude: 47.1235, longitude: -1.5679 },
            { id: 2, latitude: 47.124, longitude: -1.566 },
            { id: 3, latitude: 47.125, longitude: -1.568 },
            { id: 4, latitude: 47.126, longitude: -1.569 }
        ];

        // Appel de la fonction avec un emplacement utilisateur invalide et vérification qu'elle lance une erreur
        expect(() => findNearestBike(invalidUserLocation, bikes)).to.throw("userLocation Invalid");
    });

    it("should throw an error if userLocation is invalid (longitude out of range)", function () {
        // Emplacement utilisateur invalide avec une longitude hors plage
        const invalidUserLocation = [47.1234, 200];

        // Tableau fictif de stations de vélos
        const bikes = [
            { id: 1, latitude: 47.1235, longitude: -1.5679 },
            { id: 2, latitude: 47.124, longitude: -1.566 },
            { id: 3, latitude: 47.125, longitude: -1.568 },
            { id: 4, latitude: 47.126, longitude: -1.569 }
        ];

        // Appel de la fonction avec un emplacement utilisateur invalide et vérification qu'elle lance une erreur
        expect(() => findNearestBike(invalidUserLocation, bikes)).to.throw("userLocation Invalid");
    });

    it("should throw an error if userLocation is invalid (latitude out of range)", function () {

        const invalidUserLocation = [100, -1.5678];


        const bikes = [
            { id: 1, latitude: 47.1235, longitude: -1.5679 },
            { id: 2, latitude: 47.124, longitude: -1.566 },
            { id: 3, latitude: 47.125, longitude: -1.568 },
            { id: 4, latitude: 47.126, longitude: -1.569 }
        ];


        expect(() => findNearestBike(invalidUserLocation, bikes)).to.throw("userLocation Invalid");
    });

    it("should throw an error if userLocation is invalid (longitude out of range)", function () {

        const invalidUserLocation = [47.1234, -200];


        const bikes = [
            { id: 1, latitude: 47.1235, longitude: -1.5679 },
            { id: 2, latitude: 47.124, longitude: -1.566 },
            { id: 3, latitude: 47.125, longitude: -1.568 },
            { id: 4, latitude: 47.126, longitude: -1.569 }
        ];


        expect(() => findNearestBike(invalidUserLocation, bikes)).to.throw("userLocation Invalid");
    });

});

