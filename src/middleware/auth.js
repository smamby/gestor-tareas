// src/middleware/auth.js
module.exports = {
    ensureAuthenticated: (req, res, next) => {
      if (req.session.user) {
        return next();
      }
      req.flash('error_msg', 'Por favor, inicia sesión para continuar');
      res.redirect('/auth/login');
    },
    ensureAdmin: (req, res, next) => {
      if (req.session.user && req.session.user.rol === 'administrador') {
        return next();
      }
      req.flash('error_msg', 'No tienes permisos para realizar esta acción');
      res.redirect('/dashboard');
    }
  };
  