const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()

module.exports = (UserModel) => {
    //controller d'enregistrement d'un utilisateur
    const saveUser = async (req, res) => {
        try {
            //en premier on vérifie si un utilisateur dans la bdd possède déjà un compte sur cet email
            const check = await UserModel.getUserByEmail(req.body.email)
            if(check.code){
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                //si check retourne un tableau qui n'est pas vide (il existe déjà un utiliseur pour cet email)
                if(check.length > 0){
                    res.json({status: 401, msg: "Vous ne pouvez pas créer de compte avec ces identifiants!"})
                } else {
                    //ici du coup aucun mail ne correspond dans la bdd, on l'autorise à s'enregistrer
                    const user = await UserModel.saveOneUser(req)
                    if(user.code){
                        res.json({status: 500, msg: "Oups, une erreur est survenue!"})
                    } else {
                        res.json({status: 200, msg: "L'utilisateur a bien été enregistré!"})
                    }
                }
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    
    //controller de connexion d'un utilisateur
    const connectUser = async (req, res) => {
        try {
            //en premier on vérifie si un utilisateur dans la bdd possède un compte pour cet email
            const check = await UserModel.getUserByEmail(req.body.email)
            if(check.code){
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                //si jamais aucun utilisateur n'existe pour ce mail
                if(check.length === 0){
                    res.json({status: 404, msg: "Utilisateur introuvable!"})
                } else {
                    //sinon il existe un utilisateur dans la bdd pour ce mail, du coup on compare les mots de passe
                    const same = await bcrypt.compare(req.body.password, check[0].password)
                    //si c'est true les mots de passes sont identiques
                    if(same){
                        //on crée le payload (contenu qu'on va glisser dans token ATTENTION PAS D'INFOS SENSIBLES)
                        const payload = {id: check[0].id, role: check[0].role}
                        //on crée notre token avec la signature (secret)
                        const token = jwt.sign(payload, process.env.SECRET)
                        const connect = await UserModel.updateConnexion(check[0].id)
                        if(connect.code) {
                            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
                        } else {
                            const user = {
                                id: check[0].id,
                                firstName: check[0].firstName,
                                lastName: check[0].lastName,
                                email: check[0].email,
                                address: check[0].address,
                                zip: check[0].zip,
                                city: check[0].city,
                                phone: check[0].phone,
                                role: check[0].role
                            }
                            res.json({status: 200, token, user})
                        }
                    } else {
                        //sinon mdp pas identiques on retourne une erreur
                        res.json({status: 404, msg: "Utilisateur introuvable!"})
                    }
                }
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    //controller de modification d'un utilisateur
    const updateUser = async (req, res) => {
        try {
            console.log(req.body)
            //on modifie l'utilisateur dans la BDD
            const user = await UserModel.updateUser(req, req.params.id)
            if(user.code){
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                //mon profil a bien été modifié je renvoi les infos de mises à jour vers le front
                const newUser = await UserModel.getOneUser(req.params.id)
                if(newUser.code){
                    res.json({status: 500, msg: "Oups, une erreur est survenue!"})
                } else {
                    const myUser = {
                        id: newUser[0].id,
                        firstName: newUser[0].firstName,
                        lastName: newUser[0].lastName,
                        email: newUser[0].email,
                        address: newUser[0].address,
                        zip: newUser[0].zip,
                        city: newUser[0].city,
                        phone: newUser[0].phone,
                        role: newUser[0].role
                    }
                    res.json({status: 200, newUser: myUser})
                }
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    //controller de suppresion d'un utilisateur
    const deleteUser = async (req, res) => {
        try {
            const deleteUser = await UserModel.deleteOneUser(req.params.id)
            if(deleteUser.code){
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                res.json({status: 200, msg: "Utilisateur supprimé!"})
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    
    return {
        saveUser,
        connectUser,
        updateUser,
        deleteUser
    }   
}