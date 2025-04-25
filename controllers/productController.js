const fs = require('fs')//va nous permettre de supprimer des images locales
module.exports = (ProductModel) => {
    
    //controller permettant de récupérer toutes les produits
    const getAllProducts = async (req, res) =>{
        try {
            const products = await ProductModel.getAllProducts()
            if(products.code){
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                res.json({status: 200, result: products})
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    //controller permettant de récupérer un seule produit
    const getOneProduct = async (req, res) =>{
        try {
            const product = await ProductModel.getOneProduct(req.params.id)
            if(product.code){
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                res.json({status: 200, result: product[0]})
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    //controller permettant d'enregistrer un produit
    const saveProduct = async (req, res) =>{
        try {
            const product = await ProductModel.saveOneProduct(req)
            if(product.code){
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                res.json({status: 200, msg: "Le produit a bien été enregistrée!"})
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    //controller d'ajout d'une image dans l'api (stock l'image et retourne le nom)
    const savePicture = async (req, res) =>{
        try {
            //si on a pas envoyé de fichier via le front ou que cet objet ne possède aucune propriété
            if(!req.files || Object.keys(req.files).length === 0){
                //on retourne une errer
                res.json({status: 400, msg: "La photo n'a pas pu être récupérée!"})
            } else {
                //on va envoyer l'image ver les dossier /public/images
                req.files.image.mv(`public/images/${req.files.image.name}`, (err) => {
                    if(err){
                        res.json({status: 500, msg: "La photo n'a pas pu être enregistrée"})
                    } else {
                        //c'est good c'est enregistrée on retourne le nome de l'img enregistrée vers le front
                        res.json({status: 200, msg: "L'image a bien été enregistrée", url: req.files.image.name})
                    }
                })
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    //controller de modification d'un produit
    const updateProduct = async (req, res) =>{
        try {
            const product = await ProductModel.updateOneProduct(req, req.params.id)
            if(product.code){
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                res.json({status: 200, msg: "Le produit a bien été modifiée!"})
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    //controller de suppression d'un produit
    const deleteProduct = async (req, res) =>{
        try {
            //avant de supprimer, je stock en mémoire les infos du produit, ce qui me permettra de supprimer l'image uniquement si le produit est bien supprimée
            const product = await ProductModel.getOneProduct(req.params.id)
            if(product.code){
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                //on supprime le produit
                const deleteProduct = await ProductModel.deleteOneProduct(req.params.id)
                if(deleteProduct.code){
                    res.json({status: 500, msg: "Oups, une erreur est survenue!"})
                } else {
                    //le produit est supprimée, on supprime l'image du produit
                    if(product[0].photo !== "no-pict.jpg"){
                        //supprime le fichier (photo) correspondant au nom de la photo
                        fs.unlink(`public/images/${product[0].photo}`, (err) => {
                            if(err){
                                res.json({status: 500, msg: "Problème de suppression d'image!"})
                            }
                            res.json({status: 200, result: deleteProduct})
                        })
                    }
                }
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
    
    return {
        getAllProducts,
        getOneProduct,
        saveProduct,
        savePicture,
        updateProduct,
        deleteProduct
    }   
}