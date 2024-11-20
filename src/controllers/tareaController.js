const mongoose = require('mongoose');
// src/controllers/tareaController.js
const Tarea = require('../models/Tarea');
const Estado = require('../models/Estado');
const Prioridad = require('../models/Prioridad');
const Usuario = require('../models/Usuario');
const Area = require('../models/Area');
const Rol = require('../models/Rol');
const { formatDate } = require('../tools/formatDate');


//Obtener todas las tareas
exports.getTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find()
    .populate('area', 'nombre')
    .populate('estado', 'nombre')
    .populate('prioridad', 'nombre')
    .populate('usuarioAsignado', 'nombre')    
    const userID = req.session.user.id;
    const rolID = req.session.user.rol;
    //const incluyeModificar = tareas[0].roles_con_permiso.modificar.map(id => id.toString()).includes(String(rolID));
    //const incluyeAvance = tareas[0].roles_con_permiso.avance.map(id => id.toString()).includes(String(userID));
    //console.log('tareas:',tareas);
    console.log('userID: ', String(userID) )
    console.log('logID: ', String(rolID))
    console.log('tareasConPermisoModificar:', tareas[0].roles_con_permiso.modificar.map(id => id.toString()));
    console.log('tareasConPermisoAvance:', tareas[0].roles_con_permiso.avance.map(id => id.toString()));
    //console.log('incluyeModificar:', incluyeModificar);
    //console.log('incluyeAvance:', incluyeAvance);
    res.render('tareas/listar', { 
      titulo: 'Lista de Tareas', 
      tareas, 
      // estados, 
      // prioridades, 
      filtros, 
      userID, 
      rolID, 
      // incluyeModificar,
      // incluyeAvance,
    });
  } catch (error) {
    console.error(error);
    res.send('Error al obtener tareas');
  }
};

// Obtener todas las tareas ordenadas
let directionSort = -1;
exports.getTareasOrdenadas = async (req, res) => {
  console.log('req.session.user: ', req.session.user);
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
    const userID = req.session.user.id;
    const rolID = req.session.user.rol;
    //const incluyeModificar = tareas[0].roles_con_permiso.modificar.map(id => id.toString()).includes(String(rolID));
    //const incluyeAvance = tareas[0].roles_con_permiso.avance.map(id => id.toString()).includes(String(userID));
    //console.log('tareas:',tareas);
    console.log('userID: ', String(userID) )
    console.log('logID: ', String(rolID))
    console.log('tareasConPermisoModificar:', tareas[0].roles_con_permiso.modificar.map(id => id.toString()));
    console.log('tareasConPermisoAvance:', tareas[0].roles_con_permiso.avance.map(id => id.toString()));
    // console.log('incluyeModificar:', incluyeModificar);
    // console.log('incluyeAvance:', incluyeAvance);
    res.render('tareas/listar', { 
      titulo: 'Lista de Tareas', 
      tareas, 
      estados, 
      prioridades, 
      filtros, 
      userID, 
      rolID, 
      // incluyeModificar,
      // incluyeAvance,
    });
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

  //console.log('Request Body:', req.body);
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
  const estadoInicializada = await Estado.findOne({nombre: 'Inicializada'})
  try {
    const nuevaTarea = new Tarea({
      
      area: req.session.user.area,
      titulo,
      descripcion,
      tarea_padre: tarea_padre,
      estado: estadoInicializada._id,
      prioridad: prioridad || null,
      usuarioAsignado: usuarioAsignado || null,
      usuarioResponsable: req.session.user.id,
      roles_con_permiso,
      fechaVencimiento,
    });
    console.log('nuevatarea: ', nuevaTarea)
    console.log('req.session.user: ', req.session.user);
    await nuevaTarea.save();
    req.flash('success_msg', 'Tarea creada exitosamente');
    res.redirect('/tareas/ordenadas');
  } catch (error) {
    console.error(error);
    res.send('Error al crear tarea');
  }
};

// Formulario para avance tarea
exports.formAvanceTarea = async (req, res) => {
   const { id } = req.params;
   console.log('Controlador formAvanceTarea ejecutado con ID:', id);
  

  try {
    const tarea = await Tarea.findById(id)
    .populate('area')
    .populate('estado')
    .populate('prioridad')
    .populate('usuarioAsignado')
    .populate('avance.usuario_ejecutor')
    const estados = await Estado.find();
    const prioridades = await Prioridad.find();
    const usuarios = await Usuario.find();
    const roles = await Rol.find();
    const areas = await Area.find();
    

    res.render('tareas/avance', {
      titulo: 'Avanzar Tarea',
      tarea: tarea,
      estados,
      prioridades,
      usuarios,
      roles,
      areas,
      //fecha_vencimiento: formatDate(tarea.fechaVencimiento),
      //usuario_ejecutor: req.session.user.nombre,
      fecha_avance: new Date(Date.now()),
      formatDate,
    });
  } catch (error) {
    console.error(error);
    res.send('Error al obtener tarea');
  }
};

// Avance tarea
exports.avanceTarea = async (req, res) => {
  const { id } = req.params;
  const tarea = await Tarea.findById(id)
  .populate('estado')
  .populate('prioridad')
  .populate('usuarioAsignado')
  .populate('area');
  const { titulo, descripcion, estado, prioridad, usuarioAsignado, descripcion_avance
   } = req.body;
  console.log('requst Body:', req.body)

  
  const updateData = {
    titulo,
    descripcion,
    estado: estado || null,
    prioridad: prioridad || null,
    usuarioAsignado: usuarioAsignado || null,
    $push: { avance: [] },
  };
  
  if (descripcion.trim() !== '' && tarea.descripcion !== descripcion) {
    console.log('ENtro, Se Actualizo Descripcion', tarea.descripcion, descripcion);
    updateData.descripcion = descripcion;
    updateData.$push.avance.push({      
      descripcion_avance: `Se actualizo descripcion: old: ${tarea.descripcion} >> new: ${descripcion}`,
      usuario_ejecutor: req.session.user.id,
      fecha_avance: new Date(Date.now()),      
    });
  };
  if (titulo.trim() !== '' && tarea.titulo !== titulo) {
    updateData.titulo = titulo;
    updateData.$push.avance.push({
      descripcion_avance: `Se actualizo titulo: old: ${tarea.titulo} >> new: ${titulo}`,
      usuario_ejecutor: req.session.user.id,
      fecha_avance: new Date(Date.now()),      
    });
  };
  if (tarea.estado._id != estado) {
    updateData.estado = estado;
    const state = await Estado.findById(estado)
    updateData.$push.avance.push({      
      descripcion_avance: `Se actualizo estado: old: ${tarea.estado.nombre} >> new: ${state.nombre}`,
      usuario_ejecutor: req.session.user.id,
      fecha_avance: new Date(Date.now()),      
    });
  };
  if (tarea.prioridad._id != prioridad) {
    updateData.prioridad = prioridad;
    const prio = await Prioridad.findById(prioridad)
    updateData.$push.avance.push({      
      descripcion_avance: `Se actualizo prioridad: old: ${tarea.prioridad.nombre} >> new: ${prio.nombre}`,
      usuario_ejecutor: req.session.user.id,
      fecha_avance: new Date(Date.now()),      
    });
  };
  if (tarea.usuarioAsignado._id != usuarioAsignado) {
    updateData.usuarioAsignado = usuarioAsignado;
    const usrAsig = await Usuario.findById(usuarioAsignado)
    updateData.$push.avance.push({      
      descripcion_avance: `Se actualizo usuarioAsignado: old: ${tarea.usuarioAsignado.nombre} >> new: ${usrAsig.nombre}`,
      usuario_ejecutor: req.session.user.id,
      fecha_avance: new Date(Date.now()),      
    });
  };


  if (descripcion_avance && descripcion_avance.trim() !== '') {
    updateData.$push.avance.push({      
      descripcion_avance: descripcion_avance,
      usuario_ejecutor: req.session.user.id,
      fecha_avance: new Date(Date.now()),      
    });
  }
  console.log('descripcion:',(tarea.descripcion == descripcion));
  console.log('tarea.d:', tarea.descripcion);
  console.log('d:', descripcion);
  console.log('estado:',(tarea.estado._id == estado));
  console.log('prioridad:',(tarea.prioridad._id == prioridad));
  console.log('usuarioAsignado:',(tarea.usuarioAsignado._id == usuarioAsignado));
  console.log('avance:', updateData.$push.avance);
  try {
    await Tarea.findByIdAndUpdate(id, updateData);      
    req.flash('success_msg', 'Avance registrado exitosamente');

    res.redirect('/tareas');
  } catch (error) {
    console.error(error);
    res.send('Error al editar tarea');
  }
};

// Formulario para editar tarea
exports.formEditarTarea = async (req, res) => {
  const { id } = req.params;

  try {
    const tarea = await Tarea.findById(id)
    .populate('area')
    .populate('estado')
    .populate('roles_con_permiso');
    const estados = await Estado.find();
    const prioridades = await Prioridad.find();
    const usuarios = await Usuario.find();
    const roles = await Rol.find();
    const areas = await Area.find();
    const allowedUsers = [];

    for (const permiso of tarea.roles_con_permiso.modificar) {
      const userPermitido = await Rol.findById(permiso);
      allowedUsers.push(userPermitido)
      console.log(userPermitido);
    }
    req.flash('success_msg', 'Avance permitido');
    res.render('tareas/editar', {
      titulo: 'Editar Tarea',
      tarea,
      estados,
      prioridades,
      areas,
      roles,
      usuarios,
      allowedUsers,
      formatDate
    });
  } catch (error) {
    console.error(error);
    res.send('Error al obtener tarea');
  }
};

// Editar tarea
exports.editarTarea = async (req, res) => {
  const { id } = req.params;
  const { area, titulo, descripcion, usuarioAsignado } = req.body;
  const areaTarea = await Area.findById(area);
  console.log('Request Body:', req.body);
  const tarea = await Tarea.findById(id)
  .populate('area')
  .populate('usuarioAsignado')
  .populate('roles_con_permiso')
  .populate('usuarioAsignado');
  const roles_con_permiso = {
    modificar: req.body['roles_con_permiso.modificar']
      ? req.body['roles_con_permiso.modificar'].map(id => new mongoose.Types.ObjectId(id))
      : [],
    avance: req.body['roles_con_permiso.avance']
      ? req.body['roles_con_permiso.avance'].map(id => new mongoose.Types.ObjectId(id))
      : [],
  };

  const updateData = {
    area,
    titulo,
    descripcion,
    usuarioAsignado,
    roles_con_permiso,
  };
  const avances = [];
  if (area.trim() && tarea.area._id != area) {
    console.log('Se Edito Area');
    updateData.area = area;
    avances.push({      
      descripcion_avance: `Se edito area: old: ${tarea.area.nombre} >> new: ${areaTarea.nombre}`,
      usuario_ejecutor: req.session.user.id,
      fecha_avance: new Date(Date.now()),      
    });
  };
  if (descripcion.trim() !== '' && tarea.descripcion !== descripcion) {
    console.log('Se Edito Descripcion');
    updateData.descripcion = descripcion;
    avances.push({      
      descripcion_avance: `Se edito descripcion: old: ${tarea.descripcion} >> new: ${descripcion}`,
      usuario_ejecutor: req.session.user.id,
      fecha_avance: new Date(Date.now()),      
    });
  };
  if (titulo.trim() !== '' && tarea.titulo !== titulo) {
    console.log('Se Edito Titulo');
    updateData.titulo = titulo;
    avances.push({
      descripcion_avance: `Se edito titulo: old: ${tarea.titulo} >> new: ${titulo}`,
      usuario_ejecutor: req.session.user.id,
      fecha_avance: new Date(Date.now()),      
    });
  };
  if (tarea.usuarioAsignado._id.toString() !== usuarioAsignado) {
    console.log('Se Edito usuarioAsignado');
    updateData.usuarioAsignado = usuarioAsignado;
    const usrAsig = await Usuario.findById(usuarioAsignado)
    avances.push({      
      descripcion_avance: `Se edito usuarioAsignado: old: ${tarea.usuarioAsignado.nombre} >> new: ${usrAsig.nombre}`,
      usuario_ejecutor: req.session.user.id,
      fecha_avance: new Date(Date.now()),      
    });
  };
  if (JSON.stringify(tarea.roles_con_permiso.modificar) !== JSON.stringify(roles_con_permiso.modificar) ||
      JSON.stringify(tarea.roles_con_permiso.avance) !== JSON.stringify(roles_con_permiso.avance)) {
    console.log('Se Edito roles');
    console.log(JSON.stringify(tarea.roles_con_permiso));
    console.log(JSON.stringify(roles_con_permiso));
    avances.push({
      descripcion_avance: `Se actualizaron los roles permitidos.`,
      usuario_ejecutor: req.session.user.id,
      fecha_avance: new Date(),
    });
  }
  // if (JSON.stringify(tarea.roles_con_permiso) != JSON.stringify(roles_con_permiso)) {
  //   updateData.roles_con_permiso = roles_con_permiso;
  //   const txtRCP = async () => {
  //     for (let action in roles_con_permiso) {
  //       if (action.length > 0) {
  //         for (let permiso in action) {
  //           if (action == 'modificar') {
  //             const rolAllowed = await Rol.findById({permiso})
  //             if (rolAllowed) {
  //               avances.push({
  //                 descripcion_avance: `Cambiaron los roles permitidos en editar: old: ${tarea.roles_con_permiso[action]} >> new: ${rolAllowed.nombre}`,
  //                 fecha_avance: new Date(),
  //               });
  //             }
  //           } else if (action == 'avance') {
  //             const usuarioAllowed = await Usuario.findById({permiso})
  //             if (usuarioAllowed) {
  //               avances.push({
  //                 descripcion_avance: `Cambiaron los usuarios permitidos en Avance: old: ${tarea.roles_con_permiso[action]} >> new: ${usuarioAllowed.nombre}`,
  //                 fecha_avance: new Date(),
  //               });
  //             }
              
  //           }
  //         }
  //       }
  //     }
  //   }
  //   // updateData.$push = { avance: avances };
    
  // };
  console.log('updateData: ', updateData);
  console.log('avances: ', avances);
  try {
    await Tarea.findByIdAndUpdate(id,
      {
        $set: {
          area,
          titulo,
          descripcion,
          usuarioAsignado,
          roles_con_permiso, // Actualiza todo el objeto roles_con_permiso
        },
        $push: { avance: { $each: avances } }, // Agrega avances como un array
      },
      { new: true } // Retorna el documento actualizado);
    )
    req.flash('success_msg', 'Edicion exitosa');
    res.redirect('/tareas');
  } catch (error) {
    console.error(error);    
    req.flash('error_msg', 'Error editar tarea');
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
      .populate('estado prioridad usuarioAsignado area')
      .sort({ fechaVencimiento: 1 }); // Opcional: ordenar por fecha de vencimiento

      const estados = await Estado.find();
      const prioridades = await Prioridad.find();
      const areas = await Area.find();
      const userID = req.session.user.id;
      const userName = req.session.user.nombre
      const rolID = req.session.user.rol;
      //const incluyeModificar = tareas[0].roles_con_permiso.modificar.map(id => id.toString()).includes(String(rolID));
      //const incluyeAvance = tareas[0].roles_con_permiso.avance.map(id => id.toString()).includes(String(userID));
      //console.log('tareas:',tareas);
      console.log('userID: ', String(userID) )
      console.log('rolID: ', String(rolID))
      console.log('tareasConPermisoModificar:', tareas[0].roles_con_permiso.modificar.map(id => id.toString()));
      console.log('tareasConPermisoAvance:', tareas[0].roles_con_permiso.avance.map(id => id.toString()));
      //console.log('incluyeModificar:', incluyeModificar);
      //console.log('incluyeAvance:', incluyeAvance);
      res.render('tareas/listar', { 
        titulo: 'Lista de Tareas', 
        tareas, 
        estados, 
        prioridades,
        areas,
        userID,
        userName,
        rolID, 
        // incluyeModificar,
        // incluyeAvance,
        filtros: { estado, prioridad, fecha }
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al obtener tareas');
      res.redirect('/dashboard');
    }
  };

// src/controllers/tareaController.js


  
