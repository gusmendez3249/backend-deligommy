// reset-database.js
const mongoose = require('mongoose');
require('dotenv').config();

// Importar modelos
const Categoria = require('./models/Categoria');
const Producto = require('./models/Producto');
const Usuario = require('./models/Usuario');
const Pedido = require('./models/Pedido');

const resetDatabase = async () => {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    console.log('\n🗑️  ELIMINANDO TODA LA BASE DE DATOS...\n');

    // Eliminar todas las colecciones
    const collections = [
      { model: Categoria, name: 'Categorías' },
      { model: Producto, name: 'Productos' },
      { model: Usuario, name: 'Usuarios' },
      { model: Pedido, name: 'Pedidos' }
    ];

    for (const collection of collections) {
      const count = await collection.model.countDocuments();
      if (count > 0) {
        await collection.model.deleteMany({});
        console.log(`🗑️  ${collection.name}: ${count} documentos eliminados`);
      } else {
        console.log(`📭 ${collection.name}: No hay documentos que eliminar`);
      }
    }

    console.log('\n🎯 ELIMINANDO ÍNDICES...\n');

    // Eliminar índices (opcional, se recrean automáticamente)
    try {
      await Categoria.collection.dropIndexes();
      console.log('🗑️  Índices de Categorías eliminados');
    } catch (error) {
      console.log('ℹ️  No hay índices de Categorías para eliminar');
    }

    try {
      await Producto.collection.dropIndexes();
      console.log('🗑️  Índices de Productos eliminados');
    } catch (error) {
      console.log('ℹ️  No hay índices de Productos para eliminar');
    }

    try {
      await Usuario.collection.dropIndexes();
      console.log('🗑️  Índices de Usuarios eliminados');
    } catch (error) {
      console.log('ℹ️  No hay índices de Usuarios para eliminar');
    }

    try {
      await Pedido.collection.dropIndexes();
      console.log('🗑️  Índices de Pedidos eliminados');
    } catch (error) {
      console.log('ℹ️  No hay índices de Pedidos para eliminar');
    }

    console.log('\n✅ BASE DE DATOS COMPLETAMENTE LIMPIA');
    console.log('🚀 Puedes empezar de nuevo con datos frescos\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al resetear la base de datos:', error);
    process.exit(1);
  }
};

// Confirmar antes de ejecutar
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚨 ATENCIÓN: Este script ELIMINARÁ TODA LA INFORMACIÓN de tu base de datos');
console.log('📊 Esto incluye: Categorías, Productos, Usuarios y Pedidos');
console.log('⚠️  Esta acción NO se puede deshacer\n');

rl.question('¿Estás seguro de que quieres continuar? (escribe "SI" para confirmar): ', (answer) => {
  if (answer.toUpperCase() === 'SI') {
    console.log('\n🔄 Iniciando proceso de limpieza...\n');
    rl.close();
    resetDatabase();
  } else {
    console.log('\n❌ Operación cancelada. Tu base de datos está segura.\n');
    rl.close();
    process.exit(0);
  }
});

// ===============================================
// reset-database-force.js (SIN CONFIRMACIÓN)
// ===============================================
/*
// Si quieres un script que ejecute directo sin confirmación,
// crea este archivo: reset-database-force.js

const mongoose = require('mongoose');
require('dotenv').config();

const Categoria = require('./models/Categoria');
const Producto = require('./models/Producto');
const Usuario = require('./models/Usuario');
const Pedido = require('./models/Pedido');

const forceReset = async () => {
  try {
    console.log('🔄 Conectando y limpiando base de datos...');
    await mongoose.connect(process.env.MONGO_URI);
    
    await Categoria.deleteMany({});
    await Producto.deleteMany({});
    await Usuario.deleteMany({});
    await Pedido.deleteMany({});
    
    console.log('✅ Base de datos limpia');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

forceReset();
*/