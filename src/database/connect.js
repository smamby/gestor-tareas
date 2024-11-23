// src/database/connect.js
const mongoose = require('mongoose');
require('dotenv').config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect('mongodb://localhost:27017/sistema-gestion-tareas');
//     console.log('MongoDB conectado');
//   } catch (error) {
//     console.error('Error al conectar a MongoDB:', error);
//     process.exit(1);
//   }
// };
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('Error al conectar a MongoDB Atlas:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
