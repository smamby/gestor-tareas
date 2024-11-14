// src/models/Area.js
const mongoose = require('mongoose');

const AreaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Area', AreaSchema);