// src/database/seed.js
const mongoose = require('mongoose');
const connectDB = require('./connect');
const Estado = require('../models/Estado');
const Prioridad = require('../models/Prioridad');
const Usuario = require('../models/Usuario');
const Area = require('../models/Area');
const Rol = require('../models/Rol');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  await connectDB();

  const admExist = async () => await Usuario.findOne({nombre: 'Administrador'});
  const initDB = async () => {
    const inicializedDB = await admExist()
    console.log('admExist: ', inicializedDB );
       
    if (!inicializedDB) {
      // Limpiar colecciones existentes
      await Estado.deleteMany({});
      await Prioridad.deleteMany({});
      await Usuario.deleteMany({});
      await Area.deleteMany({});
      await Rol.deleteMany({});
    
      // Insertar Estados
      const estados = await Estado.insertMany([
        { nombre: 'Pendiente' },
        { nombre: 'En Progreso' },
        { nombre: 'Completada' },
        { nombre: 'Inicializada'},
      ]);
    
      // Insertar Prioridades
      const prioridades = await Prioridad.insertMany([
        { nombre: 'Baja' },
        { nombre: 'Media' },
        { nombre: 'Alta' },
      ]);
      // Insertar Area
      const areas = await Area.insertMany([
        { nombre: 'Ventas' },
        { nombre: 'Produccion' },
        { nombre: 'Compras' },
        { nombre: 'Inventario' },
        { nombre: 'Todas'}
      ]);
      // Obtener los _id de las áreas insertadas
      const ventasAreaId = areas.find(area => area.nombre === 'Ventas')._id;
      const produccionAreaId = areas.find(area => area.nombre === 'Produccion')._id;
      const comprasAreaId = areas.find(area => area.nombre === 'Compras')._id;
      const todasAreaId = areas.find(area => area.nombre === 'Todas')._id;
      // Insertar Roles
      const roles = await Rol.insertMany([
        { nombre: 'Empleado', area: produccionAreaId},
        { nombre: 'Jefe de grupo', area: produccionAreaId },
        { nombre: 'Gerente de area', area: comprasAreaId },
        { nombre: 'Administrador', area: todasAreaId },
      ]);
    
      // Crear un administrador
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      const andminRol = await Rol.findOne( {nombre: 'Administrador' } );
      const admin = new Usuario({
        nombre: 'Administrador',
        email: 'admin@example.com',
        contraseña: 'admin123', // Contraseña en texto plano,
        rol: andminRol._id,
        area: todasAreaId,
      });
    
      await admin.save();

      // Crear un empleado 1
      const salt2 = await bcrypt.genSalt(10);
      const hashedPassword2 = await bcrypt.hash('123', salt2);
      const empleadoRol = await Rol.findOne( {nombre: 'Empleado'} );
      const empleado = new Usuario({
        nombre: 'Ernesto Garcia',
        email: 'egarcia@gmail.com',
        contraseña: '123', // Contraseña en texto plano,
        rol: empleadoRol._id,
        area: produccionAreaId,
      });

      await empleado.save();

      // Crear un empleado 2
      const salt3 = await bcrypt.genSalt(10);
      const hashedPassword3 = await bcrypt.hash('123', salt2);
      const empleadoRol2 = await Rol.findOne( {nombre: 'Gerente de area'} );
      const empleado2 = new Usuario({
        nombre: 'Carla Paez',
        email: 'carpa@gmail.com',
        contraseña: '123', // Contraseña en texto plano,
        rol: empleadoRol2._id,
        area: comprasAreaId,
      });
    
      await empleado2.save();
    
      console.log('Datos de Estados, Prioridades y Administrador insertados');
    } else {
     console.log('DB ya inicializada');
    }
    //mongoose.disconnect();
  }
  initDB();
};

seedData();
