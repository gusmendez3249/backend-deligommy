// seed-initial.js
const mongoose = require('mongoose');
const Categoria = require('./models/Categoria');
const Usuario = require('./models/Usuario');
require('dotenv').config();

const seedInitial = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Crear usuario admin
    const admin = await Usuario.create({
      nombre: 'Super Admin',
      email: 'admin@deli-gommi.com',
      password: 'admin123',
      rol: 'super_admin'
    });
    console.log('✅ Usuario admin creado');

    // Crear categorías básicas
    const categorias = await Categoria.insertMany([
      { nombreCategoria: 'Chocolates', descripcion: 'Chocolates variados' },
      { nombreCategoria: 'Caramelos', descripcion: 'Caramelos duros y blandos' },
      { nombreCategoria: 'Gomitas', descripcion: 'Gomitas de frutas' }
    ]);
    console.log('✅ Categorías creadas');

    console.log('🎉 Datos iniciales creados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedInitial();