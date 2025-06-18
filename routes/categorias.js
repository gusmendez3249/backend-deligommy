// ===============================================
// 1. routes/categorias.js
// ===============================================
const express = require('express');
const router = express.Router();
const {
  getCategorias,
  getCategoria,
  getCategoriaBySlug,
  createCategoria,
  updateCategoria,
  deleteCategoria
} = require('../controllers/categoriasController');
const { auth, admin, superAdmin } = require('../middleware/auth');

// Rutas públicas
router.get('/', getCategorias);
router.get('/slug/:slug', getCategoriaBySlug);
router.get('/:id', getCategoria);

// Rutas protegidas (solo admin y super_admin)
router.post('/', auth, admin, createCategoria);
router.put('/:id', auth, admin, updateCategoria);
router.delete('/:id', auth, admin, deleteCategoria);

module.exports = router;
