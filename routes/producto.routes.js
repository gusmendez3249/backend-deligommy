const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// Crear producto
router.post('/', async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener todos los productos
router.get('/', async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  const producto = await Producto.findById(req.params.id);
  res.json(producto);
});

// Actualizar producto
router.put('/:id', async (req, res) => {
  const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(producto);
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Producto eliminado' });
});

module.exports = router;
