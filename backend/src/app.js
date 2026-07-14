const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes');
const clienteRoutes = require('./routes/cliente.routes');
const vendedorRoutes = require('./routes/vendedor.routes');
const menuRoutes = require('./routes/menu.routes');

const app = express();

/* ===========================
   Helmet (Seguridad de Cabeceras)
=========================== */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
      },
    },
    frameguard: {
      action: 'deny',
    },
    hidePoweredBy: true,
    noSniff: true,
    referrerPolicy: {
      policy: 'no-referrer',
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    crossOriginEmbedderPolicy: false,
  })
);

/* ===========================
   Middlewares Globales
=========================== */

// 🔥 CONFIGURACIÓN CORRECTA DE CORS PARA COOKIES (Ubicada al inicio)
app.use(cors({
  origin: 'http://localhost:5173', // Permite explícitamente tu Frontend de Vite
  credentials: true,               // Autoriza el intercambio de cookies seguras
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

/* ===========================
   Ruta principal
=========================== */
app.get('/', (req, res) => {
  return res.status(200).json({
    ok: true,
    message: 'API ComedorU funcionando correctamente',
    roles: ['cliente', 'vendedor'],
  });
});

/* ===========================
   Rutas de la Aplicación
=========================== */
app.use('/api/auth', authRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/vendedores', vendedorRoutes);

/* ===========================
   Manejador de Rutas 404 (Debe ir al final)
=========================== */
app.use((req, res) => {
  return res.status(404).json({
    ok: false,
    message: 'Ruta no encontrada',
  });
});

module.exports = app;