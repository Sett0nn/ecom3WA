const bcrypt = require('bcryptjs')
const saltRounds = 10

module.exports = (_db)=>{
    db=_db
    return UserModel
}

class UserModel {
    //sauvegarde d'un utilisateur
    static saveOneUser(req) {
        return bcrypt.hash(req.body.password, saltRounds)
        .then((hash) => {
            return db.query('INSERT INTO users (firstName, lastName, email, password, role, address, zip, city, phone) VALUES (?, ?, ?, ?, "user", ?, ?, ?, ?)', [req.body.firstname, req.body.lastname, req.body.email, hash, req.body.address, req.body.zip, req.body.city, req.body.phone])
            .then((res)=>{
                return res
            })
            .catch((err) => {
                return err
            })
        })
        .catch(err=>console.log(err))
    }
    
    //récupération d'un utilisateur en fonction de son mail
    static getUserByEmail(email){
        return db.query("SELECT * FROM users WHERE email = ?", [email])
        .then((res)=>{
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    //récupération d'un utilisateur par son id
    static getOneUser(id){
        return db.query("SELECT * FROM users WHERE id = ?", [id])
        .then((res)=>{
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    //modification d'un utilisateur
    static updateUser(req, userId) {
        return db.query("UPDATE users SET firstName = ?, lastName = ?, address = ?, zip = ?, city = ?, phone = ? WHERE id = ?", [req.body.firstname, req.body.lastname, req.body.address, req.body.zip, req.body.city, req.body.phone, userId])
        .then((res)=>{
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    //modification de la dernière connexion d'un utilisateur
    static updateConnexion(id) {
        return db.query("UPDATE users SET connexionTimestamp = NOW() WHERE id = ?", [id])
        .then((res)=>{
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    //suppression d'un compte utilisateur
    static deleteOneUser(id){
        return db.query("DELETE FROM users WHERE id = ?", [id])
        .then((res)=>{
            return res
        })
        .catch((err) => {
            return err
        })
    }
}