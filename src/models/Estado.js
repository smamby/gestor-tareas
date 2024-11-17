// src/models/Estado.js
const mongoose = require('mongoose');

const EstadoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Estado', EstadoSchema);
