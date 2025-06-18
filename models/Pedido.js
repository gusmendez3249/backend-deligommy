// ===============================================
// 4. models/Pedido.js
// ===============================================
const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.ObjectId,
    ref: 'Usuario',
    required: [true, 'El usuario es obligatorio']
  },
  productos: [{
    producto: {
      type: mongoose.Schema.ObjectId,
      ref: 'Producto',
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: [1, 'La cantidad debe ser al menos 1']
    },
    precio: {
      type: Number,
      required: true,
      min: [0, 'El precio no puede ser negativo']
    }
  }],
  total: {
    type: Number,
    required: [true, 'El total es obligatorio'],
    min: [0, 'El total no puede ser negativo']
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  direccionEntrega: {
    type: String,
    required: [true, 'La dirección de entrega es obligatoria']
  },
  metodoPago: {
    type: String,
    enum: ['efectivo', 'tarjeta', 'transferencia', 'paypal'],
    required: [true, 'El método de pago es obligatorio']
  }
}, { timestamps: true });

// Populate automático
pedidoSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'usuario',
    select: 'nombre email telefono'
  }).populate({
    path: 'productos.producto',
    select: 'nombreProducto precio imagen_url'
  });
  next();
});

module.exports = mongoose.model('Pedido', pedidoSchema);