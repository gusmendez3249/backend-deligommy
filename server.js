// server.js (CORREGIDO)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware básico
app.use(express.json());
app.use(cors());

// Conectar MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.log('❌ Error:', err));

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: '🍭 API Dulcería Deli-Gommi',
    version: '1.0.0',
    endpoints: {
      categorias: '/api/categorias',
      productos: '/api/productos',
      usuarios: '/api/usuarios',
      pedidos: '/api/pedidos'
    }
  });
});

// Rutas de la API
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/pedidos', require('./routes/pedidos'));

// Middleware 404 CORREGIDO - Sin usar '*'
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;