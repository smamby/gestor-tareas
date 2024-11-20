// src/models/Area.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AreaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Area', AreaSchema);