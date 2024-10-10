// src/test/matchPasswordTest.js
const mongoose = require('mongoose');
const connectDB = require('../database/connect');
const Usuario = require('../models/Usuario');

const testMatchPassword = async () => {
  await connectDB();

  // Buscar al administrador
  const admin = await Usuario.findOne({ email: 'admin@example.com' });
  if (!admin) {
    console.log('Administrador no encontrado');
    mongoose.disconnect();
    return;
  }

  // Contraseña correcta
  const isMatchCorrect = await admin.matchPassword('admin123');
  console.log('Contraseña correcta coincide:', isMatchCorrect); // Debería ser true

  // Contraseña incorrecta
  const isMatchIncorrect = await admin.matchPassword('wrongpassword');
  console.log('Contraseña incorrecta coincide:', isMatchIncorrect); // Debería ser false

  mongoose.disconnect();
};

testMatchPassword();
