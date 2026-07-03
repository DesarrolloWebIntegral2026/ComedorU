const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
});

const app = require('./src/app');

require('./src/config/db');

const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET no está definido en backend/.env');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Servidor ComedorU ejecutándose en http://localhost:${PORT}`);
});