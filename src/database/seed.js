// src/database/seed.js
const mongoose = require('mongoose');
const connectDB = require('./connect');
const Estado = require('../models/Estado');
const Prioridad = require('../models/Prioridad');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  await connectDB();

  const admExist = async () => await Usuario.findOne({rol: 'administrador'});
  const initDB = async () => {
    const inicializedDB = await admExist()
    console.log('admExist: ', inicializedDB );
       
    if (!inicializedDB) {
      // Limpiar colecciones existentes
      await Estado.deleteMany({});
      await Prioridad.deleteMany({});
      await Usuario.deleteMany({});
    
      // Insertar Estados
      const estados = await Estado.insertMany([
        { nombre: 'Pendiente' },
        { nombre: 'En Progreso' },
        { nombre: 'Completada' },
      ]);
    
      // Insertar Prioridades
      const prioridades = await Prioridad.insertMany([
        { nombre: 'Baja' },
        { nombre: 'Media' },
        { nombre: 'Alta' },
      ]);
    
      // Crear un administrador
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
    
      const admin = new Usuario({
        nombre: 'Administrador',
        email: 'admin@example.com',
        contraseña: 'admin123', // Contraseña en texto plano,
        rol: 'administrador',
        departamento: 'Ventas',
      });
    
      await admin.save();

      // Crear un empleado
      const salt2 = await bcrypt.genSalt(10);
      const hashedPassword2 = await bcrypt.hash('123', salt2);
    
      const empleado = new Usuario({
        nombre: 'Ernesto Garcia',
        email: 'egarcia@gmail.com',
        contraseña: '123', // Contraseña en texto plano,
        rol: 'empleado',
        departamento: 'Produccion',
      });
    
      await empleado.save();
    
      console.log('Datos de Estados, Prioridades y Administrador insertados');
    } else {
     console.log('DB ya inicializada');
    }
    //mongoose.disconnect();
  }
  initDB();
};

seedData();
