// src/controllers/usuarioController.js
const Usuario = require('../models/Usuario');
const Rol = require('../models/Rol');
const Area = require('../models/Area');

// Obtener todos los usuarios
exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find()
    .populate('area')
    .populate('rol');
    res.render('usuarios/listar', { titulo: 'Lista de Usuarios', usuarios });
  } catch (error) {
    console.error(error);
    res.send('Error al obtener usuarios');
  }
};

// Formulario para crear usuario
exports.formCrearUsuario = async (req, res) => {
  const areas = await Area.find({ nombre: { $ne: 'Todas' } });
  const roles = await Rol.find();
  res.render('usuarios/crear', { 
    titulo: 'Crear Usuario',
    roles,
    areas,
   });
};

// Crear nuevo usuario
exports.crearUsuario = async (req, res) => {
  const { nombre, email, contraseña, rol, area } = req.body;
  const rolNewUsr = await Rol.findById(rol);
  const areaNewUsr = await Area.findById(area);  
  try {
    if (!rolNewUsr.nombre.includes(areaNewUsr.nombre)) {
      console.log('El rol debe coincidir con el área');
      req.flash('error_msg', 'El rol debe coincidir con el área');
      return res.redirect('/usuarios/crear');
    }
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      contraseña,
      rol,
      area,
    });

    await nuevoUsuario.save();
    req.flash('success_msg', 'Usuario creado exitosamente');
    res.redirect('/usuarios');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error al crear usuario');
    res.redirect('/usuarios/crear');
  }  
};

// Formulario para editar usuario
exports.formEditarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findById(id);
    res.render('usuarios/editar', { titulo: 'Editar Usuario', usuario });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error al obtener usuario');
    res.redirect('/usuarios');
  }
};

// Editar usuario
exports.editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, contraseña, rol, departamento } = req.body;

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      req.flash('error_msg', 'Usuario no encontrado');
      return res.redirect('/usuarios');
    }

    usuario.nombre = nombre || usuario.nombre;
    usuario.email = email || usuario.email;
    usuario.rol = rol || usuario.rol;
    usuario.departamento = departamento || usuario.departamento;

    if (contraseña) {
      usuario.contraseña = contraseña; // Se encriptará automáticamente
    }

    await usuario.save();
    req.flash('success_msg', 'Usuario actualizado exitosamente');
    res.redirect('/usuarios');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error al editar usuario');
    res.redirect(`/usuarios/editar/${id}`);
  }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    await Usuario.findByIdAndDelete(id);
    req.flash('success_msg', 'Usuario eliminado exitosamente');
    res.redirect('/usuarios');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error al eliminar usuario');
    res.redirect('/usuarios');
  }
};
