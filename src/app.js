// src/app.js
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const connectDB = require('./database/connect');
const session = require('express-session');
const flash = require('connect-flash');
const { ensureAuthenticated } = require('./middleware/auth');
require('./database/seed.js');

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar sesiones
app.use(session({
  secret: 'tu_secreto_de_sesion', // Cambia esto por un secreto seguro
  resave: false,
  saveUninitialized: false,
}));

// Configurar flash
app.use(flash());

// Middleware para pasar mensajes y usuario a las vistas
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.session.user || null;
  next();
});

// Rutas
const usuarioRoutes = require('./routes/usuarios');
const tareaRoutes = require('./routes/tareas');
const authRoutes = require('./routes/auth');

app.use('/usuarios', usuarioRoutes);
app.use('/tareas', tareaRoutes);
app.use('/auth', authRoutes);

// Ruta principal (Login)
app.get('/', (req, res) => {
  res.render('login', { titulo: 'Iniciar Sesión' });
});

// Ruta del dashboard
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { titulo: 'Panel de Administración' });
});

// Manejo de errores 404
// app.use((req, res, next) => {
//   res.status(404).send('Página no encontrada');
// });

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
