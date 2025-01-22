"use strict"
import userDAO from '../dao/userDAO.mjs'

const userController = {
    findAll: async () => await userDAO.findAll(),
    findByLogin : async (login)=> {
        const user = await userDAO.findByLogin(login)
        return user
    },
    add : async (user) => await userDAO.add(user),
    addAvis: async (idToilette,login,note) => await userDAO.addAvis(idToilette,login,note),
    verifLogin: async (login,password) => await userDAO.verifLogin(login,password),
    remove: async() => await userDAO.deleteAll()
}
export default userController
