// src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Formulario de inicio de sesión
router.get('/login', authController.formLogin);

// Procesar inicio de sesión
router.post('/login', authController.login);

// Cerrar sesión
router.get('/logout', authController.logout);

module.exports = router;
