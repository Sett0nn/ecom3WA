module.exports = (_db)=>{
    db = _db
    return OrderModel
}

class OrderModel {
    //validation d'une commande
    static saveOneOrder(userId, totalAmount){
        //le status sera "not payed" par défaut
        return db.query('INSERT INTO orders (user_id, totalAmount, creationTimestamp, status) VALUES (?, ?, NOW(), "not payed")', [userId, totalAmount])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    //sauvegarde d'un orderDetail
    static saveOneOrderDetail(orderId, product){
        //ici product est un objet représentant un produit, il aura des propriétées nécéssaires pour notre requer product.id et product.quantityInCart
        const total = parseInt(product.quantityInCart) * parseFloat(product.safePrice)
        return db.query('INSERT INTO orderdetails (order_id, product_id, quantity, total) VALUES (?, ?, ?, ?)', [orderId, product.id, product.quantityInCart, total])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    
    }
    
    //modification du montant total
    static updateTotalAmount(orderId, totalAmount){
        return db.query('UPDATE orders SET totalAmount = ? WHERE id = ?', [totalAmount, orderId])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    //récupération d'une commande en fonction d'un id
    static getOneOrder(id){
        return db.query('SELECT * FROM orders WHERE id = ?', [id])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    //modification d'un status de commande
    static updateStatus(orderId, status){
        return db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    //récupération de toutes les commandes
    static getAllOrders(){
        return db.query('SELECT * FROM orders')
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }
    
    //récupération des détails d'une commande
    static getAllDetails(orderId){
        return db.query('SELECT orderdetails.id, orderdetails.quantity, total, name, description, photo FROM orderdetails INNER JOIN products ON product.id = orderdetails.beer_id WHERE order_id = ?', [orderId])
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        })
    }
}