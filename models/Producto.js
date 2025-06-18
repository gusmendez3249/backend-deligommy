// ===============================================
// 2. models/Producto.js
// ===============================================
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombreProducto: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  categoria: {
    type: mongoose.Schema.ObjectId,
    ref: 'Categoria',
    required: [true, 'La categoría es obligatoria']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  imagen_url: {
    type: String
  },
  activo: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Populate automático de categoría
productoSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'categoria',
    select: 'nombreCategoria slug'
  });
  next();
});

module.exports = mongoose.model('Producto', productoSchema);