const withAuth = require('../middleware/withAuth')
const withAuthAdmin = require('../middleware/withAuthAdmin')

module.exports = (app, db) => {
    const UserModel = require("../models/UserModel")(db)
    const ProductModel = require("../models/ProductModel")(db)
    const OrderModel = require("../models/OrderModel")(db)
    const orderController = require("../controllers/orderController")(UserModel, ProductModel, OrderModel)
    
    //route de sauvegarde complète d'une commande
    app.post('/api/v1/order/save', withAuth, orderController.saveOrder)
    //route de gestion du paiement (va analyser le bon fonctionnement du paiement)
    app.post('/api/v1/order/payment', withAuth, orderController.payment)
    //route de modification du status de paiement de la commande
    app.put('/api/v1/order/validate', withAuth, orderController.updateStatus)
    //route de récupération de toutes les commandes
    app.get('/api/v1/order/all', withAuth, orderController.getAllOrders)
    //route de récupération d'une commande
    app.get('/api/v1/order/getOneOrder/:id', withAuth, orderController.getOneOrder)
}