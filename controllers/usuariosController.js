// ===============================================
// 3. controllers/usuariosController.js
// ===============================================
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Generar JWT
const generateToken = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Registrar usuario
const registerUsuario = async (req, res) => {
  try {
    const { nombre, email, password, telefono, direccion } = req.body;

    // Verificar si el email ya existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      telefono,
      direccion
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        rol: usuario.rol,
        token: generateToken(usuario._id, usuario.rol)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Login usuario
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se proporcionen email y password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario e incluir password
    const usuario = await Usuario.findOne({ email }).select('+password');

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar password
    const isMatch = await usuario.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        rol: usuario.rol,
        token: generateToken(usuario._id, usuario.rol)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener perfil del usuario
const getProfile = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    res.json({
      success: true,
      data: usuario
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Actualizar perfil
const updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      nombre: req.body.nombre,
      telefono: req.body.telefono,
      direccion: req.body.direccion
    };

    // Remover campos undefined
    Object.keys(fieldsToUpdate).forEach(key => {
      if (fieldsToUpdate[key] === undefined) {
        delete fieldsToUpdate[key];
      }
    });

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: usuario
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener todos los usuarios (solo admin y super_admin)
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: usuarios.length,
      data: usuarios
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Actualizar rol de usuario (solo super_admin)
const updateUserRole = async (req, res) => {
  try {
    const { rol } = req.body;

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { rol },
      { new: true, runValidators: true }
    );

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Rol actualizado exitosamente',
      data: usuario
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  registerUsuario,
  loginUsuario,
  getProfile,
  updateProfile,
  getUsuarios,
  updateUserRole
};
