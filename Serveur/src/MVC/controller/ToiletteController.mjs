"use strict"
import toiletteDAO from "../dao/ToiletteDAO.mjs";

const toiletteController = {
    findAll: async () => await toiletteDAO.findAll(),
    findById:async (idToilette) => await toiletteDAO.findById(idToilette),
    add: async (toilet) => await toiletteDAO.addToilette(toilet)
}
export default toiletteController
