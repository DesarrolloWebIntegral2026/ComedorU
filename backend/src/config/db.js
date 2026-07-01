const mysql = require('mysql2');
require('dotenv').config(); // Esto lee el archivo .env automático

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Verificar la conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a la base de datos de XAMPP:', err);
  } else {
    console.log('¡Conexión exitosa a MySQL de XAMPP para ComedorU!');
    connection.release();
  }
});

module.exports = pool;