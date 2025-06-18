// ===============================================
// 2. routes/productos.js
// ===============================================
const express = require('express');
const router = express.Router();
const {
  getProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
  updateStock
} = require('../controllers/productosController');
const { auth, admin } = require('../middleware/auth');

// Rutas públicas
router.get('/', getProductos);
router.get('/:id', getProducto);

// Rutas protegidas (solo admin y super_admin)
router.post('/', auth, admin, createProducto);
router.put('/:id', auth, admin, updateProducto);
router.delete('/:id', auth, admin, deleteProducto);
router.patch('/:id/stock', auth, admin, updateStock);

module.exports = router;