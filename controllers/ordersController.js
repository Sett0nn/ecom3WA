const dotenv = require("dotenv")
dotenv.config()
const stripe = require('stripe')(process.env.STRIPE_SECRET)

module.exports = (UserModel, ProductModel, OrderModel) => {
    
    //controller de sauvegarde complète d'une commande
    const saveOrder = async (req, res) => {
        try {
            let totalAmount = 0
            //enregistrement d'une commande (order)
            const orderInfos = await OrderModel.saveOneOrder(req.body.user_id, totalAmount)
            //si code d'erreur
            if(orderInfos.code){
                //reponse d'erreur
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            //sinon
            } else {
                console.log("orderInfos", orderInfos)
                //on récup dans l'objet de la réponse l'insertId (l'id qu'il vient d'insérer dans la bdd)
                const id = orderInfos.insertId
                //on boucle sur le panier passé dans un req.body.basket (pour enregistrer le detail pour chaque produit acheté)
                req.body.map(async (b) => {
                    //on récup les infos d'un produit par son id
                    const product = await ProductModel.getOneProduct(b.id)
                    //si code d'erreur
                    if(product.code){
                        //reponse d'erreur
                        res.json({status: 500, msg: "Oups, une erreur est survenue!"})
                    //sinon
                    } else {
                        //on ajoute une propriété safePrice à l'objet du tour de boucle (produit du panier) en lui affectant le prix du produit récupérée dans la bdd
                        b.safePrice = parseFloat(product[0].price)
                        //on appel la fonction pour sauvegarder un détail de cette commande en envoyant l'id de la commande et le produit du tour de boucle
                        const detail = await OrderModel.saveOneOrderDetail(id, b)
                        //si code d'erreur
                        if(detail.code){
                            //reponse d'erreur
                            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
                        //sinon
                        } else {
                            //on additonne au totalAmount la quantité du produit demandé multiplié par le safePrice
                            totalAmount += parseInt(b.quantityInCart) * parseFloat(b.safePrice)
                            //on met à jour le montant total de la commande
                            const update = await OrderModel.updateTotalAmount(id, totalAmount)
                            if(update.code){
                                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
                            }
                        } 
                    }
                })
                res.json({status: 200, orderId: id})
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
                    
    }
    //controller de gestion du paiement (va analyser le bon fonctionnement du paiement)
    const payment = async (req, res) => {
        try {
            const order = await OrderModel.getOneOrder(req.body.orderId)
            if(order.code) {
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                //on lance le suivi du paiement
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: order[0].totalAmount * 100, //il est en cents donc on mutliplie par 100
                    currency: "eur", //indique la devise de paiement à effectuer
                    metadata: {integration_check: 'accept_a_payment'}, //on consulte si le paiement est valide ou non
                    receipt_email: req.body.email //l'utilisateur recoit sa confirmation de paiement par email
                })
                console.log(paymentIntent)
                res.json({status: 200, client_secret: paymentIntent['client_secret']})
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    //controller de modification du status de paiement de la commande
    const updateStatus = async (req, res) => {
        try {
            const validate = await OrderModel.updateStatus(req.body.orderId, req.body.status)
            if(validate.code){
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                res.json({status: 200, msg: "Status mis à jour!"})
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    //controller de récupération de toutes les commandes
    const getAllOrders = async (req, res) => {
        try {
            const orders = await OrderModel.gerAllOrders()
            if(orders.code){
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                res.json({status: 200, result: orders})
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    //controller de récupération d'une commande
    const getOneOrder = async (req, res) => {
        try {
            const order = await OrderModel.getOneOrder(req.params.id)
            if(order.code) {
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                //on récup toutes les infos de l'utilisateur
                const user = await UserModel.getOneUser(order[0].user_id)
                if(user.code){
                    res.json({status: 500, msg: "Oups, une erreur est survenue!"})
                } else {
                    const myUser = {
                        firstName: user[0].firstName,
                        lastName: user[0].lastName,
                        address: user[0].address,
                        zip: user[0].zip,
                        city: user[0].city,
                        phone: user[0].phone
                    }
                    //récupération de tous les détails de la commande
                    const details = await OrderModel.getAllDetails(req.params.id)
                    if(details.code){
                        res.json({status: 500, msg: "Oups, une erreur est survenue!"})
                    } else {
                        res.json({status: 200, order: order[0], user: myUser, orderDetail: details})
                    }
                }
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    
    return {
        saveOrder,
        payment,
        updateStatus,
        getAllOrders,
        getOneOrder
    }   
}