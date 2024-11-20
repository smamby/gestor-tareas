// src/routes/roles.js
const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// Obtener todas los roles
router.get('/', areaController.getAreas);

// Formulario para crear roles
router.get('/crear', areaController.formCrearArea);

// Crear Area
router.post('/crear', areaController.crearArea);

// Formulario para editar Areas
router.get('/editar/:id', areaController.formEditarArea);

// Editar Area
router.post('/editar/:id', areaController.editarArea);

// Eliminar Area
router.get('/eliminar/:id', areaController.eliminarArea);

module.exports = router;