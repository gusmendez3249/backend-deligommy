// ===============================================
// 1. models/Categoria.js
// ===============================================
const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombreCategoria: {
    type: String,
    required: [true, 'El nombre de la categoría es obligatorio'],
    unique: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  }
}, { timestamps: true });

// Crear slug automáticamente
categoriaSchema.pre('save', function(next) {
  if (this.isModified('nombreCategoria')) {
    this.slug = this.nombreCategoria
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Categoria', categoriaSchema);