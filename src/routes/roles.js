// src/routes/roles.js
const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// Obtener todas los roles
router.get('/', rolController.getRoles);

// Formulario para crear roles
router.get('/crear', rolController.formCrearRol);

// Crear rol
router.post('/crear', rolController.crearRol);

// Formulario para editar roles
router.get('/editar/:id', rolController.formEditarRol);

// Editar rol
router.post('/editar/:id', rolController.editarRol);

// Eliminar rol
router.get('/eliminar/:id', rolController.eliminarRol);

module.exports = router;