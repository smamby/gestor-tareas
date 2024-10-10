// src/models/Prioridad.js
const mongoose = require('mongoose');

const PrioridadSchema = new mongoose.Schema({
  nombre: {
    type: String,
    enum: ['Baja', 'Media', 'Alta'],
    required: true,
  },
});

module.exports = mongoose.model('Prioridad', PrioridadSchema);
