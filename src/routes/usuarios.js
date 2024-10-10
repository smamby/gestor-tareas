// src/routes/usuarios.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// Todas las rutas de usuarios requieren autenticación
router.use(ensureAuthenticated);

// Obtener todos los usuarios (solo administradores)
router.get('/', ensureAdmin, usuarioController.getUsuarios);

// Formulario para crear usuario (solo administradores)
router.get('/crear', ensureAdmin, usuarioController.formCrearUsuario);

// Crear nuevo usuario (solo administradores)
router.post('/crear', ensureAdmin, usuarioController.crearUsuario);

// Formulario para editar usuario (solo administradores)
router.get('/editar/:id', ensureAdmin, usuarioController.formEditarUsuario);

// Editar usuario (solo administradores)
router.post('/editar/:id', ensureAdmin, usuarioController.editarUsuario);

// Eliminar usuario (solo administradores)
router.get('/eliminar/:id', ensureAdmin, usuarioController.eliminarUsuario);

module.exports = router;
