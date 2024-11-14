// src/routes/roles.js
const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// Obtener todas los roles
router.get('/', rolController.getRoles);

// Formulario para crear roles
router.get('/crear', rolController.formCrearRol);


module.exports = router;