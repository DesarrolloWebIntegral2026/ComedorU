const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes');
const clienteRoutes = require('./routes/cliente.routes');
const vendedorRoutes = require('./routes/vendedor.routes');
const arcoRoutes = require('./routes/arco.routes');

const app = express();

/* ===========================
   Helmet
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

    crossOriginEmbedderPolicy: false,
  })
);

/* ===========================
   Middlewares
=========================== */

app.use(cors());

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
   Rutas
=========================== */

app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/vendedores', vendedorRoutes);
app.use('/api/arco', arcoRoutes);

/* ===========================
   404
=========================== */

app.use((req, res) => {
  return res.status(404).json({
    ok: false,
    message: 'Ruta no encontrada',
  });
});

module.exports = app;