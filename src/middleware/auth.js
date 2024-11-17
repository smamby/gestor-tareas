// src/middleware/auth.js
const Usuario = require('../models/Usuario');
const Area = require('../models/Area');
const Rol = require('../models/Rol');
const Tarea = require('../models/Tarea');

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
    checkUserRoleAPAGADO: (roles) => async (req, res, next) => {      
      if (req.session.user && ( roles.some((role) => req.session.user.rol.equals(role)) || 
                                roles.some((role) => req.session.user.id.equals(role))))
      return next();
    
      req.flash('error_msg', 'No tienes permisos para realizar esta acción');
      res.redirect('/dashboard');
    
    },
    checkUserRole: (action) => async (req, res, next) => {
      const { id } = req.params; 
      const userRolID = req.session.user.rol;
      const userID = req.session.user.id;
      const tarea = await Tarea.findById(id);
      const rolesConPermiso = tarea.roles_con_permiso[action];

      // console.log('Rol del usuario:', userRolID);
      // console.log('ID usuario:', userID)
      // console.log('Roles permitidos:', tarea.roles_con_permiso[action]);

      // console.log('Middleware checkUserRole ejecutado', { action, rolesConPermiso, userRolID, userID });
      
      try {
        
        if (!tarea) {
          console.log('Tarea no encontrada');
          req.flash('error_msg', 'Tarea no encontrada');
          return res.redirect('/dashboard');
        }
    
        // Verificar si el rol del usuario está permitido para esta acción
        const permittedRoles = tarea.roles_con_permiso[action]; 
        if (permittedRoles.includes(userRolID) || permittedRoles.includes(userID)) {
          console.log('Permiso concedido');
          return next(); 
        }
        
        console.log('Permiso denegado');
        req.flash('error_msg', 'No tienes permisos para realizar esta acción');
        res.redirect('/dashboard');
      } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error al verificar permisos');
        res.redirect('/dashboard');
      }
    },    
};
  