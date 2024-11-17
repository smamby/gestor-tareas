// src/models/Tarea.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TareaSchema = new Schema({
  area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area',
    required: true,
    default: null,
  },
  titulo: {
    type: String,
    required: true,
  },
  tarea_padre: {
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
  usuarioResponsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null,
  },
  usuarioAsignado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null,
  },
  roles_con_permiso: {
    modificar: [{ type: Schema.Types.ObjectId, ref: 'Rol' , required: true }],
    avance: [{ type: Schema.Types.ObjectId, ref: 'Usuario' , required: true }],
    caducar: [{ type: Schema.Types.ObjectId, ref: 'Rol' , required: true }],
    borrar: { type: String, enum: ['Administrador'], default: 'Administrador' }, 
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  fechaVencimiento: {
    type: Date,
  },
  descripcion: {
    type: String,
  },
  avance: [
    {
      descripcion_avance: { type: String, required: true },
      usuario_ejecutor: {type: Schema.Types.ObjectId, ref: 'Usuario' , required: true },
      fecha_avance: { type: Date, required: true }
    }
  ]
});

module.exports = mongoose.model('Tarea', TareaSchema);
