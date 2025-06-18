// ===============================================
// 4. controllers/pedidosController.js
// ===============================================
const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');

// Obtener todos los pedidos
const getPedidos = async (req, res) => {
  try {
    const { usuario, estado } = req.query;
    let filtros = {};

    // Si es cliente, solo puede ver sus propios pedidos
    if (req.usuario.rol === 'cliente') {
      filtros.usuario = req.usuario.id;
    } else {
      // Admin puede filtrar por usuario específico
      if (usuario) filtros.usuario = usuario;
    }

    if (estado) filtros.estado = estado;

    const pedidos = await Pedido.find(filtros).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: pedidos.length,
      data: pedidos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener un pedido específico
const getPedido = async (req, res) => {
  try {
    let filtros = { _id: req.params.id };

    // Si es cliente, solo puede ver sus propios pedidos
    if (req.usuario.rol === 'cliente') {
      filtros.usuario = req.usuario.id;
    }

    const pedido = await Pedido.findOne(filtros);

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      data: pedido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Crear nuevo pedido
const createPedido = async (req, res) => {
  try {
    const { productos, direccionEntrega, metodoPago } = req.body;

    // Validar que haya productos
    if (!productos || productos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El pedido debe tener al menos un producto'
      });
    }

    let total = 0;
    let productosValidos = [];

    // Validar productos y calcular total
    for (let item of productos) {
      const producto = await Producto.findById(item.producto);

      if (!producto || !producto.activo) {
        return res.status(400).json({
          success: false,
          message: `Producto ${item.producto} no encontrado o no disponible`
        });
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para ${producto.nombreProducto}. Stock disponible: ${producto.stock}`
        });
      }

      const precio = item.precio || producto.precio;
      total += precio * item.cantidad;

      productosValidos.push({
        producto: item.producto,
        cantidad: item.cantidad,
        precio: precio
      });
    }

    // Crear pedido
    const pedido = await Pedido.create({
      usuario: req.usuario.id,
      productos: productosValidos,
      total,
      direccionEntrega,
      metodoPago
    });

    // Actualizar stock de productos
    for (let item of productosValidos) {
      await Producto.findByIdAndUpdate(
        item.producto,
        { $inc: { stock: -item.cantidad } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: pedido
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Actualizar estado del pedido (solo admin y super_admin)
const updateEstadoPedido = async (req, res) => {
  try {
    const { estado } = req.body;

    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true, runValidators: true }
    );

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Estado del pedido actualizado exitosamente',
      data: pedido
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Cancelar pedido
const cancelarPedido = async (req, res) => {
  try {
    let filtros = { _id: req.params.id };

    // Si es cliente, solo puede cancelar sus propios pedidos
    if (req.usuario.rol === 'cliente') {
      filtros.usuario = req.usuario.id;
    }

    const pedido = await Pedido.findOne(filtros);

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    // Solo se pueden cancelar pedidos pendientes o confirmados
    if (!['pendiente', 'confirmado'].includes(pedido.estado)) {
      return res.status(400).json({
        success: false,
        message: 'No se puede cancelar un pedido en este estado'
      });
    }

    // Restaurar stock
    for (let item of pedido.productos) {
      await Producto.findByIdAndUpdate(
        item.producto,
        { $inc: { stock: item.cantidad } }
      );
    }

    // Actualizar pedido
    pedido.estado = 'cancelado';
    await pedido.save();

    res.json({
      success: true,
      message: 'Pedido cancelado exitosamente',
      data: pedido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getPedidos,
  getPedido,
  createPedido,
  updateEstadoPedido,
  cancelarPedido
};