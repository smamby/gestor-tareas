// src/middleware/auth.js
const Usuario = require('../models/Usuario');
const Area = require('../models/Area');
const Rol = require('../models/Rol');

module.exports = {
    ensureAuthenticated: async (req, res, next) => {
      if (req.session.user) {
        return next();
      }
      req.flash('error_msg', 'Por favor, inicia sesión para continuar');
      res.redirect('/auth/login');
    },
    ensureAdmin: async (req, res, next) => {
      const userRol = await Rol.findById(req.session.user.rol);
      if (req.session.user) {
        if (userRol && userRol.nombre === 'Administrador')
        return next();
      }
      req.flash('error_msg', 'No tienes permisos para realizar esta acción');
      res.redirect('/dashboard');
    },     
    checkUserRole: (role) => async (req, res, next) => {
      if (req.session.user && req.session.user.rol === role) {
        return next();
      }
      req.flash('error_msg', 'No tienes permisos para realizar esta acción');
      res.redirect('/dashboard');
    }
  };
  