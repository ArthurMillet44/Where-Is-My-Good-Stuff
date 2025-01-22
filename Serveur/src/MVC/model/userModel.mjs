export default class User {
    login
    password
    avisdonnees=[]
    constructor(obj) {
        this.login = obj.login
        this.password = obj.password
        this.avisdonnees=obj.avisdonnees
    }
}
