// src/controllers/areaController.js
const mongoose = require('mongoose');
const Area = require('../models/Area');
const Usuario = require('../models/Usuario');

//Obtener todas las areas
exports.getAreas = async (req, res) => {
  try {
    const areas = await Area.find()
    res.render('areas/listar', { titulo: 'Lista de Areas', areas });
  } catch (error) {
    console.error(error);
    res.send('Error al obtener areas');
  }
};

// Formulario para crear tarea
exports.formCrearArea = async (req, res) => {
    try {
      res.render('areas/crear', {
        titulo: 'Crear Areas',
      });
    } catch (error) {
      console.error(error);
      res.send('Error al cargar formulario');
    }
  };

  // Crear nueva Area
  exports.crearArea= async (req, res) => {
  const { nombre, area } = req.body;
  
  try {
    const nuevaArea= new Area({
      area,
      nombre,
    });

    await nuevaArea.save();
    req.flash('success_msg', 'Areacreado exitosamente')
    res.redirect('/areas');
  } catch (error) {
    console.error(error);
    res.send('Error al crear Area');
  }
};

//formEditarArea 
exports.formEditarArea = async (req,res) => {
  const { id } = req.params;
  const area = await Area.findById(id);

  try {
    res.render('areas/editar', {
      titulo: 'Editar Area',
      id,
      area,
    });
  } catch (error) {
    console.error(error);
    res.send('Error al cargar formulario');
  }
}
//editarArea 
exports.editarArea = async (req,res) => {
  const { id } = req.params;
  console.log(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash('error_msg', 'ID inválido');
    return res.redirect('/areas');
  }
  const { nombre } = req.body;
  const updateData = {
    nombre,
  };
  
  try {
    await Area.findByIdAndUpdate(id, updateData);
    req.flash('success_msg', 'Area editada exitosamente')
    res.redirect('/areas');
  } catch (error) {
    console.error(error);
    res.send('Error al editar Area');
  }
};

//eliminarArea 
exports.eliminarArea = async (req,res) => {
  const { id } = req.params;
  console.log('id eliminar ', id)
  try {
    const userConArea = await Usuario.findOne({area: id});
    console.log('Usuario de esa area: ', userConArea)
    if (userConArea) {
      req.flash('error_msg', 'Existen usuarios con esa Area, no se puede borrar');
      return res.redirect('/areas');
    } else {
      const deletedArea = await Area.findByIdAndDelete(id);

      if (!deletedArea) {
        req.flash('error_msg', 'Area no encontrado');
        return res.redirect('/areas');
      }
      req.flash('success_msg', 'Area eliminado exitosamente')
      res.redirect('/areas');
    }
  } catch (error) {
    console.error(error);
    res.send('Error al eliminar Area');
  }
}