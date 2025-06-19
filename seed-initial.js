const mongoose = require('mongoose');
const Categoria = require('./models/Categoria');
const Producto = require('./models/Producto');
require('dotenv').config();

const seedInitial = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

   
    // Buscar categorías creadas
    const categorias = await Categoria.find({
      nombreCategoria: { $in: ['Chocolates', 'Caramelos', 'Gomitas'] }
    });

    const chocolates = categorias.find(c => c.nombreCategoria === 'Chocolates');
    const caramelos = categorias.find(c => c.nombreCategoria === 'Caramelos');
    const gomitas = categorias.find(c => c.nombreCategoria === 'Gomitas');

    if (!chocolates || !caramelos || !gomitas) {
      throw new Error('❌ Una o más categorías no fueron encontradas correctamente.');
    }

await Producto.insertMany([
  {
    nombreProducto: 'Hershey’s Milk Chocolate Bar',
    descripcion: 'Tableta de chocolate con leche clásica',
    precio: 25,
    imagen_url: 'https://bit.ly/3VevwGS',
    categoria: chocolates._id,
    stock: 10,        // Agregado stock obligatorio
    activo: true      // Opcional, pero puedes incluirlo explícitamente
  },
  {
    nombreProducto: 'Kinder Bueno',
    descripcion: 'Chocolate con relleno de crema de avellana',
    precio: 30,
    imagen_url: 'https://bit.ly/4aXa7pH',
    categoria: chocolates._id,
    stock: 15,
    activo: true
  },
  {
    nombreProducto: 'Caramelos Vero Mango',
    descripcion: 'Paleta sabor mango con chile',
    precio: 5,
    imagen_url: 'https://bit.ly/3xguKZx',
    categoria: caramelos._id,
    stock: 50,
    activo: true
  },
  {
    nombreProducto: 'Jolly Rancher',
    descripcion: 'Caramelos duros surtidos de frutas',
    precio: 15,
    imagen_url: 'https://bit.ly/3Xx14uo',
    categoria: caramelos._id,
    stock: 40,
    activo: true
  },
  {
    nombreProducto: 'Gomitas Haribo Ositos de Oro',
    descripcion: 'Gomitas clásicas con sabor a frutas',
    precio: 18,
    imagen_url: 'https://bit.ly/4aWvAnO',
    categoria: gomitas._id,
    stock: 30,
    activo: true
  },
  {
    nombreProducto: 'Gomitas enchiladas de sandía',
    descripcion: 'Gomitas sabor sandía con chile',
    precio: 20,
    imagen_url: 'https://bit.ly/3XyMQyO',
    categoria: gomitas._id,
    stock: 25,
    activo: true
  }

    ]);

    console.log('✅ Productos creados');
    console.log('🎉 Seed ejecutado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedInitial();
