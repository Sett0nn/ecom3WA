const jwt = require('jsonwebtoken')
const dotenv = require("dotenv")
dotenv.config()
//middleware qui va autoriser ou non la reconnexion automatique d'un utilisateur ou autoriser ou non l'accés aux routes protégées de node
const withAuthAdmin = (req, res, next) => {
    //on récupère notre token dans le header de la requète AJAX HTTP
    const token = req.headers['x-access-token'] //Bearer-token
    //si il ne trouve pas ce fameux token dans le headers de la requète ajax
    if(token === undefined){
        //on retourne une erreur (l'utilsateur ne pourra pas accéder au controller de la route protégé ou ne pourra pas être reconnecté)
        res.json({status: 404, msg: "Error, token not found..."})
    } else {
        //sinon il y'a un token, on vérifie sa véricité à l'aide de la fonction verify de la librairie jsonwebtoken
        jwt.verify(token, process.env.SECRET, (err, decoded) =>{
            //si il y'a une erreur (le token n'est pas valide)
            if(err){
                res.json({status: 401, msg: "Error, your token is invalid!"})
            } else {
                if(decoded.role !== "admin"){
                    res.json({status: 401, msg: "Error, you are not and admin!"})
                } else {
                    //le token est valide et le payload est décrypté dans l'argument decoded
                    req.id = decoded.id
                    //on sort de la fonction on autorise l'accés au controller (callback) de la route
                    next()
                }
            }
        })
    }
    
}

module.exports = withAuthAdmin