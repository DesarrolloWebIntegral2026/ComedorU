const mysql = require('mysql2');

class DatabaseSingleton {

    constructor() {

        if (!DatabaseSingleton.instance) {

            this.pool = mysql.createPool({

                host: process.env.DB_HOST || '127.0.0.1',

                user: process.env.DB_USER || 'root',

                password: process.env.DB_PASSWORD || '',

                database: process.env.DB_NAME || 'comedor_u',

                port: process.env.DB_PORT || 3306,

                waitForConnections: true,

                connectionLimit: 10,

                queueLimit: 0

            });

            console.log('=== [Singleton] Conexión MySQL inicializada ===');

            DatabaseSingleton.instance = this;

        }

        return DatabaseSingleton.instance;

    }

    getPool() {

        return this.pool.promise();

    }

}

module.exports = new DatabaseSingleton();