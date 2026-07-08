const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const clienteRoutes = require('./routes/cliente.routes');
const vendedorRoutes = require('./routes/vendedor.routes');

// ... Tus otras importaciones de Express y Auth Routes ...
const menuRoutes = require('./routes/menu.routes');



const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({
    ok: true,
    message: 'API ComedorU funcionando correctamente',
    roles: ['cliente', 'vendedor'],
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/vendedores', vendedorRoutes);
// Enlace de las rutas de la API REST de menús
app.use('/api/menus', menuRoutes);

app.use((req, res) => {
  return res.status(404).json({
    ok: false,
    message: 'Ruta no encontrada',
  });
});

module.exports = app;