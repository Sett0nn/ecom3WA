const express = require('express');
const router = express.Router();
const UserModel = require('../models/UsersModel');
const userController = require('../controllers/userController')(UserModel); // 👈 tu injectes le modèle ici


const {
 updateUser, // 👈 récupère bien la fonction ici
  deleteUser,
  saveUser,
  connectUser
} = require('../controllers/userController')(UserModel);

const { protect, isAdmin } = require('../middleware/authMiddleware');

// 🧍 Voir son profil (utilisateur connecté)
// router.get('/profile', protect, getUserProfile);

// 🖊️ Modifier son profil
// router.put('/profile', protect, updateUserProfile);

// 🔎 Voir tous les utilisateurs (admin uniquement)
// router.get('/', protect, isAdmin, getAllUsers);


router.put('/profile/:id', protect, updateUser);


module.exports = router;
