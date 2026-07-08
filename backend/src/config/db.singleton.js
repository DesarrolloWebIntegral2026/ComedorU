const mysql = require('mysql2');

class DatabaseSingleton {
    constructor() {
        if (!DatabaseSingleton.instance) {
            // Creamos el pool empleando tus variables de entorno (.env)
            this.pool = mysql.createPool({
                host: process.env.DB_HOST || '127.0.0.1',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'comedor_u',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });

            console.log('=== [SINGLETON] Nueva e única instancia de conexión MySQL inicializada ===');
            DatabaseSingleton.instance = this;
        }
        return DatabaseSingleton.instance;
    }

    // Método expuesto para obtener el wrapper de promesas directamente
    getPool() {
        return this.pool.promise();
    }
}

const singletonInstance = new DatabaseSingleton();
module.exports = singletonInstance;