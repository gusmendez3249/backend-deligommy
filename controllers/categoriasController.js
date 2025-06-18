// ===============================================
// controllers/categoriasController.js (CORREGIDO)
// ===============================================
const Categoria = require('../models/Categoria');

// Obtener todas las categorías
const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find().sort({ nombreCategoria: 1 });
    res.json({
      success: true,
      count: categorias.length,
      data: categorias
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener una categoría por ID
const getCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    res.json({
      success: true,
      data: categoria
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener categoría por slug
const getCategoriaBySlug = async (req, res) => {
  try {
    const categoria = await Categoria.findOne({ slug: req.params.slug });
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    res.json({
      success: true,
      data: categoria
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Crear categoría
const createCategoria = async (req, res) => {
  try {
    const categoria = new Categoria(req.body);
    await categoria.save();
    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: categoria
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de categoría ya existe'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Actualizar categoría
const updateCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: categoria
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Eliminar categoría
const deleteCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// IMPORTANTE: Exportar todas las funciones
module.exports = {
  getCategorias,
  getCategoria,
  getCategoriaBySlug,
  createCategoria,
  updateCategoria,
  deleteCategoria
};