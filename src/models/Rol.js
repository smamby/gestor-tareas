// src/models/Rol.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RolSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area',
    default: null,
  }
});

module.exports = mongoose.model('Rol', RolSchema);