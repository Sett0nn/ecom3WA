const withAuthAdmin = require ('../middleware/withAuthAdmin')

module.exports = (app, db) => {
    const ProductModel = require("../models/ProductModel")(db)
    const productController = require("../controllers/productController")(ProductModel)
    
    //route permettant de récupérer toutes les produits
    app.get('/api/v1/product/all', productController.getAllProducts)
    //route permettant de récupérer un seul produit
    app.get('/api/v1/product/one/:id', productController.getOneProduct)
    //route permettant d'enregistrer un produit
    app.post('/api/v1/product/save', withAuthAdmin, productController.saveProduct)
    //route d'ajout d'une image dans l'api (stock l'image et retourne le nom)
    app.post('/api/v1/product/pict', withAuthAdmin, productController.savePicture)
    //route de modification d'un produit
    app.put('/api/v1/product/update/:id', withAuthAdmin, productController.updateProduct)
    //route de suppression d'un produit
    app.delete('/api/v1/product/delete/:id', withAuthAdmin, productController.deleteProduct)
}