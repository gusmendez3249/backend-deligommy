// ===============================================
// 4. routes/pedidos.js
// ===============================================
const express = require('express');
const router = express.Router();
const {
  getPedidos,
  getPedido,
  createPedido,
  updateEstadoPedido,
  cancelarPedido
} = require('../controllers/pedidosController');
const { auth, admin } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas para todos los usuarios autenticados
router.get('/', getPedidos);
router.get('/:id', getPedido);
router.post('/', createPedido);
router.patch('/:id/cancelar', cancelarPedido);

// Rutas solo para admin y super_admin
router.patch('/:id/estado', admin, updateEstadoPedido);

module.exports = router;