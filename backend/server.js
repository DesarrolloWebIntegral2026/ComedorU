const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
});

const app = require('./src/app');

require('./src/config/db');

const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET no está definido en el entorno');
}

if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Servidor ComedorU ejecutándose en http://localhost:${PORT}`);
  });
}

module.exports = app;