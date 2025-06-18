const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombreProducto: String,
  descripcion: String,
  precio: Number,
  categoria: String,
  stock: Number,
  imagen_url: String,
  activo: Boolean,
  eliminado: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);
