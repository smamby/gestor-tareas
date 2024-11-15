// src/controllers/rolController.js
const Area = require('../models/Area');
const Rol = require('../models/Rol');

//Obtener todas los roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Rol.find()
      .populate('area');
    console.log(roles);
    res.render('roles/listar', { titulo: 'Lista de Roles', roles });
  } catch (error) {
    console.error(error);
    res.send('Error al obtener roles');
  }
};

// Formulario para crear tarea
exports.formCrearRol = async (req, res) => {
    try {
      const areas = await Area.find();
      res.render('roles/crear', {
        titulo: 'Crear Roles',
        areas
      });
    } catch (error) {
      console.error(error);
      res.send('Error al cargar formulario');
    }
  };

  // Crear nueva rol
exports.crearTarea = async (req, res) => {
    const { nombre, area } = req.body;
  
    try {
      const nuevaTarea = new Tarea({
        area,
        titulo,
        descripcion,
        estado: estado || null,
        prioridad: prioridad || null,
        usuarioAsignado: usuarioAsignado || null,
        fechaVencimiento,
      });
  
      await nuevaTarea.save();
      res.redirect('/tareas');
    } catch (error) {
      console.error(error);
      res.send('Error al crear tarea');
    }
  };