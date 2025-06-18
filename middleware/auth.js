// ===============================================
// 5. middleware/auth.js
// ===============================================
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Middleware de autenticación
const auth = async (req, res, next) => {
  try {
    let token;

    // Obtener token del header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No tienes acceso a esta ruta, se requiere token'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar que el usuario existe
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'El usuario del token ya no existe'
      });
    }

    // Agregar usuario a la request
    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Middleware para verificar rol admin (admin y super_admin)
const admin = (req, res, next) => {
  if (!['admin', 'super_admin'].includes(req.usuario.rol)) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador'
    });
  }
  next();
};

// Middleware para verificar rol super_admin
const superAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de super administrador'
    });
  }
  next();
};

module.exports = { auth, admin, superAdmin };