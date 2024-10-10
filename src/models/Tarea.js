// src/models/Tarea.js
const mongoose = require('mongoose');

const TareaSchema = new mongoose.Schema({
  area: {
    type: String,
    enum: ['Compras', 'Ventas', 'Producción', 'Inventario'],
    required: true,
  },
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  estado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estado',
    default: null,
  },
  prioridad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prioridad',
    default: null,
  },
  usuarioAsignado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  fechaVencimiento: {
    type: Date,
  },
});

module.exports = mongoose.model('Tarea', TareaSchema);
