const mongoose = require('mongoose');
// src/controllers/tareaController.js
const Tarea = require('../models/Tarea');
const Estado = require('../models/Estado');
const Prioridad = require('../models/Prioridad');
const Usuario = require('../models/Usuario');
const Area = require('../models/Area');
const Rol = require('../models/Rol');

//Obtener todas las tareas
exports.getTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find()
    .populate('estado', 'nombre')
    .populate('prioridad', 'nombre')
    .populate('usuarioAsignado', 'nombre')
    .populate('area', 'nombre')
    console.log(tareas);
    res.render('tareas/listar', { titulo: 'Lista de Tareas', tareas });
  } catch (error) {
    console.error(error);
    res.send('Error al obtener tareas');
  }
};

// Obtener todas las tareas ordenadas
let directionSort = -1;
exports.getTareasOrdenadas = async (req, res) => {
  const { sort } = req.query
  
  const estados = await Estado.find();
  const prioridades = await Prioridad.find();

  const filtros = {
    estado: req.query.estado || '',
    prioridad: req.query.prioridad || '',
    fecha: req.query.fecha || ''
  };

  try {    
    const tareas = await Tarea.find()
    .populate('estado')
    .populate('prioridad')
    .populate('usuarioAsignado')
    .populate('area')
    .sort({[sort]: (directionSort * -1)});
    directionSort *= -1; 
    console.log(tareas);
    res.render('tareas/listar', { titulo: 'Lista de Tareas', tareas, estados, prioridades, filtros  });
  } catch (error) {
    console.error(error);
    res.send('Error al obtener tareas');
  }
};

// Formulario para crear tarea
exports.formCrearTarea = async (req, res) => {
  try {
    const estados = await Estado.find();
    const prioridades = await Prioridad.find();
    const usuarios = await Usuario.find();
    const areas = await Area.find();
    const roles = await Rol.find();
    res.render('tareas/crear', {
      titulo: 'Crear Tarea',
      estados,
      prioridades,
      usuarios,
      areas,
      roles,
    });
  } catch (error) {
    console.error(error);
    res.send('Error al cargar formulario');
  }
};

// Crear nueva tarea
exports.crearTarea = async (req, res) => {
  const { titulo, tarea_padre, descripcion, prioridad, usuarioAsignado,
    fechaVencimiento } = req.body;

  console.log('Request Body:', req.body);
  const roles_con_permiso = {
    modificar: req.body['roles_con_permiso.modificar']
      ? req.body['roles_con_permiso.modificar'].map(id => new mongoose.Types.ObjectId(id))
      : [],
    avance: req.body['roles_con_permiso.avance']
      ? req.body['roles_con_permiso.avance'].map(id => new mongoose.Types.ObjectId(id))
      : [],
    caducar: req.body['roles_con_permiso.caducar']
      ? req.body['roles_con_permiso.caducar'].map(id => new mongoose.Types.ObjectId(id))
      : [],
  };
  try {
    const nuevaTarea = new Tarea({
      
      area: req.session.user.area,
      titulo,
      descripcion,
      tarea_padre: tarea_padre,
      estado: await Estado.findOne({nombre: 'Inicializada'}),
      prioridad: prioridad || null,
      usuarioAsignado: usuarioAsignado || null,
      usuarioResponsable: req.session.user.id,
      roles_con_permiso,
      fechaVencimiento,
    });
    console.log('nuevatarea: ', nuevaTarea)
    await nuevaTarea.save();
    res.redirect('/tareas/ordenadas');
  } catch (error) {
    console.error(error);
    res.send('Error al crear tarea');
  }
};

// Formulario para editar tarea
exports.formEditarTarea = async (req, res) => {
  const { id } = req.params;

  try {
    const tarea = await Tarea.findById(id);
    const estados = await Estado.find();
    const prioridades = await Prioridad.find();
    const usuarios = await Usuario.find();
    res.render('tareas/editar', {
      titulo: 'Editar Tarea',
      tarea,
      estados,
      prioridades,
      usuarios,
    });
  } catch (error) {
    console.error(error);
    res.send('Error al obtener tarea');
  }
};

// Editar tarea
exports.editarTarea = async (req, res) => {
  const { id } = req.params;
  const { area, titulo, descripcion, estado, prioridad, usuarioAsignado, fechaVencimiento } = req.body;

  try {
    await Tarea.findByIdAndUpdate(id, {
      area,
      titulo,
      descripcion,
      estado: estado || null,
      prioridad: prioridad || null,
      usuarioAsignado: usuarioAsignado || null,
      fechaVencimiento,
    });
    res.redirect('/tareas');
  } catch (error) {
    console.error(error);
    res.send('Error al editar tarea');
  }
};

// Eliminar tarea
exports.eliminarTarea = async (req, res) => {
  const { id } = req.params;

  try {
    await Tarea.findByIdAndDelete(id);
    res.redirect('/tareas');
  } catch (error) {
    console.error(error);
    res.send('Error al eliminar tarea');
  }
};

exports.getTareas = async (req, res) => {
    try {
      const { estado, prioridad, fecha } = req.query; // Obtener filtros de la URL
  
      // Construir el objeto de consulta
      let query = {};
  
      if (estado && estado !== '') {
        query.estado = estado;
      }
  
      if (prioridad && prioridad !== '') {
        query.prioridad = prioridad;
      }
  
      if (fecha && fecha !== '') {
        // Suponiendo que deseas filtrar tareas con fecha de vencimiento igual a la fecha seleccionada
        // Puedes ajustar esto según tus necesidades (por ejemplo, mayor o menor que una fecha)
        // Aquí filtramos tareas cuya fechaVencimiento es el mismo día
        const selectedDate = new Date(fecha);
        const start = new Date(selectedDate.setUTCHours(0, 0, 0, 0));
        const end = new Date(selectedDate.setUTCHours(23, 59, 59, 999));
        query.fechaVencimiento = { $gte: start, $lte: end };
      }
  
      // Obtener las tareas filtradas
      const tareas = await Tarea.find(query)
        .populate('estado prioridad usuarioAsignado')
        .sort({ fechaVencimiento: 1 }); // Opcional: ordenar por fecha de vencimiento
  
      // Obtener todos los estados y prioridades para los filtros
      const Estado = require('../models/Estado');
      const Prioridad = require('../models/Prioridad');
      const estados = await Estado.find();
      const prioridades = await Prioridad.find();
  
      res.render('tareas/listar', { 
        titulo: 'Lista de Tareas', 
        tareas,
        estados,
        prioridades,
        filtros: { estado, prioridad, fecha }
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al obtener tareas');
      res.redirect('/dashboard');
    }
  };

// src/controllers/tareaController.js


  
