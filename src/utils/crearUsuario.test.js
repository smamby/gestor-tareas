const { crearUsuario } = require('../controllers/usuarioController');
const Rol = require('../models/Rol');
const Area = require('../models/Area');
const Usuario = require('../models/Usuario');

// Configurar los mocks
jest.mock('../models/Rol');
jest.mock('../models/Area');
jest.mock('../models/Usuario');

describe('Función crearUsuario', () => {
  let req, res;

  beforeEach(() => {
    // Configurar mocks de req y res
    req = {
      body: {
        nombre: 'Ernesto Garcia',
        email: 'egarcia@gmail.com',
        contraseña: 'password123',
        rol: '673bcb4ab21eeb3499664ced',
        area: '673bcb4ab21eeb3499664ce8',
      },
      flash: jest.fn(),
    };

    res = {
      redirect: jest.fn(),
    };

    jest.clearAllMocks(); // Limpiar mocks antes de cada test
  });

  test('Debe redirigir si el rol no coincide con el área', async () => {
    // Mock para el rol y el área que NO coinciden
    Rol.findById.mockResolvedValue({
      _id: '673bcb4ab21eeb3499664ced',
      nombre: 'Gerente de area Ventas', // No coincide con "Compras"
      area: '673bcb4ab21eeb3499664ce8',
    });

    Area.findById.mockResolvedValue({
      _id: '673bcb4ab21eeb3499664ce8',
      nombre: 'Compras', // Diferente a "Ventas"
    });

    await crearUsuario(req, res);

    // Validación
    expect(req.flash).toHaveBeenCalledWith('error_msg', 'El rol debe coincidir con el área');
    expect(res.redirect).toHaveBeenCalledWith('/usuarios/crear');
  });

  test('Debe crear un usuario si el rol coincide con el área', async () => {
    // Mock para el rol y el área que coinciden
    Rol.findById.mockResolvedValue({
      _id: '673bcb4ab21eeb3499664ced',
      nombre: 'Gerente de area Compras', // Coincide con el área
      area: '673bcb4ab21eeb3499664ce8',
    });

    Area.findById.mockResolvedValue({
      _id: '673bcb4ab21eeb3499664ce8',
      nombre: 'Compras', // Coincide con el rol
    });

    Usuario.prototype.save = jest.fn().mockResolvedValue(true); // Mock para guardar usuario

    await crearUsuario(req, res);

    // Validación
    expect(req.flash).toHaveBeenCalledWith('success_msg', 'Usuario creado exitosamente');
    expect(res.redirect).toHaveBeenCalledWith('/usuarios');
  });

  test('Debe manejar errores al guardar un usuario', async () => {
    // Mock para el rol y el área que coinciden
    Rol.findById.mockResolvedValue({
      _id: '673bcb4ab21eeb3499664ced',
      nombre: 'Gerente de area Compras', // Coincide con el área
      area: '673bcb4ab21eeb3499664ce8',
    });

    Area.findById.mockResolvedValue({
      _id: '673bcb4ab21eeb3499664ce8',
      nombre: 'Compras', // Coincide con el rol
    });

    Usuario.prototype.save = jest.fn().mockRejectedValue(new Error('Database error')); // Forzar error al guardar

    await crearUsuario(req, res);

    // Validación
    expect(req.flash).toHaveBeenCalledWith('error_msg', 'Error al crear usuario');
    expect(res.redirect).toHaveBeenCalledWith('/usuarios/crear');
  });
});
