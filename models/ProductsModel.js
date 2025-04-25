module.exports = (_db)=>{
    db = _db
    return ProductModel
}

class ProductModel {
    
    //récupération des produits
    static getAllProducts() {
        return db.query('SELECT * FROM products')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
    
    //récupération d'un produit
    static getOneProduct(id){
        return db.query('SELECT * FROM products WHERE id = ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
    
    //sauvegarde d'un produit
    static saveProduct(req){
        return db.query('INSERT INTO products (name, description, price, photo, quantity, creationTimestamp) VALUES (?, ?, ?, ?, ?, NOW())', [req.body.name, req.body.description, req.body.price, req.body.photo, req.body.quantity])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
    
    //modification d'un produit
    static updateProduct(req, id){
        return db.query('UPDATE products SET name = ?, description = ?, price = ?, photo = ?, quantity = ? WHERE id = ?', [req.body.name, req.body.description, req.body.price, req.body.photo, req.body.quantity, id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
    
    //suppression d'un produit
    static deleteProduct(id){
        return db.query('DELETE FROM products WHERE id = ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}