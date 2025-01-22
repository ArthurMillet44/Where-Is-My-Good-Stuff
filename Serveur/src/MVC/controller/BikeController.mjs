"use strict"

import bikeDAO from "../dao/BikeDAO.mjs";

const bikeController = {
    findAll: async () => await bikeDAO.findAll(),
}
export default bikeController