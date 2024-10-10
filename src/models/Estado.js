// src/models/Estado.js
const mongoose = require('mongoose');

const EstadoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    enum: ['Pendiente', 'En Progreso', 'Completada'],
    required: true,
  },
});

module.exports = mongoose.model('Estado', EstadoSchema);
