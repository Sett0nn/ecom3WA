module.exports = (UserModel) => {
    //controller permettant la gestion de la reconnexion par token (avec le front qui jouera aussi avec redux)
    const checkToken = async (req, res) => {
         res.json({ message: 'Token valide' });
        try {
            
            const user = await UserModel.getOneUser(req.id)
            if(user.code){
                res.json({status: 500, msg: "Oups, une erreur est survenue!"})
            } else {
                const myUser = {
                    id: user[0].id,
                    firstName: user[0].firstName,
                    lastName: user[0].lastName,
                    email: user[0].email,
                    address: user[0].address,
                    zip: user[0].zip,
                    city: user[0].city,
                    phone: user[0].phone,
                    role: user[0].role
                }
                res.json({status: 200, user: myUser})
            }
        } catch(err) {
            res.json({status: 500, msg: "Oups, une erreur est survenue!"})
        }
    }
 
    return {
        checkToken
    }   
}