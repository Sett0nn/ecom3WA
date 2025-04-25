const withAuth = require ('../middleware/withAuth')

module.exports = (app, db) => {
    const UserModel = require("../models/UserModel")(db)
    const authController = require("../controllers/authController")(UserModel)
    
    //routes permettant la gestion de la reconnexion par token (avec le front qui jouera aussi avec redux)
    app.get('/api/v1/user/checkToken', withAuth, authController.checkToken)
}