const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes');
const clienteRoutes = require('./routes/cliente.routes');
const vendedorRoutes = require('./routes/vendedor.routes');
const menuRoutes = require('./routes/menu.routes');
const arcoRoutes = require('./routes/arco.routes');
const pedidoRoutes = require('./routes/pedido.routes');

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

// 🔥 CONFIGURACIÓN DE CORS PARA COOKIES Y PUERTOS DE VITE (5173, 5174, etc.)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Bloqueado por CORS: origen no permitido'));
  },
  credentials: true,
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
app.use('/api/arco', arcoRoutes);
app.use('/api/pedidos', pedidoRoutes);

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