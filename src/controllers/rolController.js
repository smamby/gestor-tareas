// src/controllers/rolController.js
const Area = require('../models/Area');
const Rol = require('../models/Rol');
const Usuario = require('../models/Usuario');

//Obtener todas los roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Rol.find()
      .populate('area');
    //console.log(roles);
    res.render('roles/listar', { titulo: 'Lista de Roles', roles });
  } catch (error) {
    console.error(error);
    res.send('Error al obtener roles');
  }
};

// Formulario para crear tarea
exports.formCrearRol = async (req, res) => {
    try {
      const areas = await Area.find({ nombre: { $ne: 'Todas' } });
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
exports.crearRol = async (req, res) => {
  const { nombre, area } = req.body;
  const areaNewRolName = await Area.findById(area);
  let nombreCompleto = nombre + ' ' + areaNewRolName.nombre;
  
  try {
    const nuevoRol = new Rol({
      area,
      nombre: nombreCompleto,
    });

    await nuevoRol.save();
    req.flash('success_msg', 'Rol creado exitosamente')
    res.redirect('/roles');
  } catch (error) {
    console.error(error);
    res.send('Error al crear Rol');
  }
};

//formEditarRol 
exports.formEditarRol = async (req,res) => {
  const { id } = req.params;
  const rol = await Rol.findById(id)
  .populate('area')

  const areas = await Area.find({ nombre: { $ne: 'Todas' } });
  try {
    res.render('roles/editar', {
      titulo: 'Editar Roles',
      areas,
      rol,
      id,
    });
  } catch (error) {
    console.error(error);
    res.send('Error al cargar formulario');
  }
}
//editarRol 
exports.editarRol = async (req,res) => {
  const { id } = req.params;
  
  const { nombre, area } = req.body;
  const updateData = {
    area,
    nombre,
  };
  
  try {
    await Rol.findByIdAndUpdate(id, updateData);
    req.flash('success_msg', 'Rol editado exitosamente')
    res.redirect('/roles');
  } catch (error) {
    console.error(error);
    res.send('Error al editar Rol');
  }
};

//eliminarRol 
exports.eliminarRol = async (req,res) => {
  const { id } = req.params;
  console.log('id eliminar ', id)
  try {
    const userConRol = await Usuario.findOne({rol: id});
    if (userConRol) {
      req.flash('error_msg', 'Existen usuarios con ese Rol, no se puede borrar');
      return res.redirect('/roles');
    } else {
      const deletedRole = await Rol.findByIdAndDelete(id);

      if (!deletedRole) {
        req.flash('error_msg', 'Rol no encontrado');
        return res.redirect('/roles');
      }
      req.flash('success_msg', 'Rol eliminado exitosamente')
      res.redirect('/roles');
    }
  } catch (error) {
    console.error(error);
    res.send('Error al eliminar Rol');
  }
}