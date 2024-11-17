// src/routes/tareas.js
const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const { ensureAuthenticated, ensureAdmin, checkUserRole } = require('../middleware/auth');


// Obtener todas las tareas
router.get('/', tareaController.getTareas);

// Obtener tareas ordenadas
router.get('/ordenadas', tareaController.getTareasOrdenadas);

// Formulario para crear tarea
router.get('/crear', tareaController.formCrearTarea);

// Ruta para listar tareas con filtros
router.get('/', tareaController.getTareas);

// Todas las rutas de tareas requieren autenticación
router.use(ensureAuthenticated);

// Crear nueva tarea
router.post('/crear', tareaController.crearTarea);

// Formulario para avance tarea
router.get('/avance/:id', async (req, res, next) => {
    console.log(`Solicitud recibida en /tareas/avance/${req.params.id}`);
    next();
  }, checkUserRole('avance'), tareaController.formAvanceTarea);

// Avance tarea
router.post('/avance/:id',  checkUserRole('avance'), tareaController.avanceTarea);

// Formulario para editar tarea
router.get('/editar/:id',  checkUserRole('modificar'), tareaController.formEditarTarea);

// Editar tarea
router.post('/editar/:id',  checkUserRole('modificar'), tareaController.editarTarea);

// Formulario para Caducar tarea
//router.get('/caducar/:id',checkUserRole('caducar'),   tareaController.formcaducarTarea);

// Caducar tarea
//router.post('/caducar/:id',checkUserRole('caducar'),   tareaController.caducarTarea);

// Eliminar tarea
router.get('/eliminar/:id',  checkUserRole('eliminar'), tareaController.eliminarTarea);

module.exports = router;
