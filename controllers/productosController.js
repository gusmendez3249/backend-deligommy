// ===============================================
// 2. controllers/productosController.js
// ===============================================
const Producto = require('../models/Producto');

// Obtener todos los productos
const getProductos = async (req, res) => {
  try {
    const { categoria, activo } = req.query;
    let filtros = {};
    
    // Filtrar por categoría si se proporciona
    if (categoria) {
      filtros.categoria = categoria;
    }
    
    // Filtrar por activo si se proporciona
    if (activo !== undefined) {
      filtros.activo = activo === 'true';
    }
    
    const productos = await Producto.find(filtros).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: productos.length,
      data: productos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener un producto
const getProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    res.json({
      success: true,
      data: producto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Crear producto
const createProducto = async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: producto
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Actualizar producto
const updateProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: producto
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Eliminar producto (cambiar activo a false)
const deleteProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    res.json({
      success: true,
      message: 'Producto desactivado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Actualizar stock
const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { stock: stock },
      { new: true, runValidators: true }
    );
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    res.json({
      success: true,
      message: 'Stock actualizado exitosamente',
      data: producto
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
  updateStock
};