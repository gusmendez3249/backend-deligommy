// ===============================================
// 3. routes/usuarios.js
// ===============================================
const express = require('express');
const router = express.Router();
const {
  registerUsuario,
  loginUsuario,
  getProfile,
  updateProfile,
  getUsuarios,
  updateUserRole
} = require('../controllers/usuariosController');
const { auth, admin, superAdmin } = require('../middleware/auth');

// Rutas públicas
router.post('/register', registerUsuario);
router.post('/login', loginUsuario);

// Rutas protegidas
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Rutas de administración
router.get('/', auth, admin, getUsuarios);
router.put('/:id/role', auth, superAdmin, updateUserRole);

module.exports = router;