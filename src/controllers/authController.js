// src/controllers/authController.js
const Usuario = require('../models/Usuario');


exports.formLogin = (req, res) => {
  res.render('login', { titulo: 'Iniciar Sesión' });
};

exports.login = async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      req.flash('error_msg', 'Credenciales inválidas');
      return res.redirect('/auth/login');
    }

    const isMatch = await usuario.matchPassword(contraseña);
    if (!isMatch) {
      req.flash('error_msg', 'Credenciales inválidas');
      return res.redirect('/auth/login');
    }

    // Guardar usuario en la sesión
    req.session.user = {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    };

    req.flash('success_msg', 'Inicio de sesión exitoso');
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error del servidor');
    res.redirect('/auth/login');
  }
};

exports.logout = (req, res) => {
    // Guardar la sesión antes de destruirla para permitir que los mensajes flash se almacenen
    req.flash('success_msg', 'Sesión cerrada exitosamente');
  
    req.session.save(err => {
      if (err) {
        console.error('Error al guardar la sesión:', err);
        // Intentar destruir la sesión, aunque hubo un error al guardar
        req.session.destroy(() => {
          res.redirect('/auth/login'); // Redirigir a login sin mensaje
        });
      } else {
        req.session.destroy(err => {
          if (err) {
            console.error('Error al destruir la sesión:', err);
            return res.redirect('/dashboard'); // Redirigir a dashboard si hay error
          }
          res.clearCookie('connect.sid'); // Limpiar cookie de sesión
          res.redirect('/auth/login'); // Redirigir a login
        });
      }
    });
  };

