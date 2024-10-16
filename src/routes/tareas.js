// src/routes/tareas.js
const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');


// Obtener todas las tareas
router.get('/', tareaController.getTareas);

// Obtener tareas ordenadas
router.get('/ordenadas', tareaController.getTareasOrdenadas);

// Formulario para crear tarea
router.get('/crear', tareaController.formCrearTarea);

// Todas las rutas de tareas requieren autenticación
router.use(ensureAuthenticated);

// Ruta para listar tareas con filtros
router.get('/', tareaController.getTareas);

// Crear nueva tarea
router.post('/crear', tareaController.crearTarea);

// Formulario para editar tarea
router.get('/editar/:id', tareaController.formEditarTarea);

// Editar tarea
router.post('/editar/:id', tareaController.editarTarea);

// Eliminar tarea
router.get('/eliminar/:id', tareaController.eliminarTarea);

module.exports = router;
