const db = require('../config/db');

const logger = {

  info: async (evento, mensaje) => {

    try {

      const query = `
        INSERT INTO bitacora_auditoria
        (nivel, evento, mensaje)
        VALUES (?, ?, ?)
      `;

      await db.query(query, [
        'INFO',
        evento,
        mensaje
      ]);

      console.log(`[AUDITORÍA - INFO] [${evento}]: ${mensaje}`);

    } catch (error) {

      console.error(
        'Error crítico al escribir en la bitácora de la base de datos:',
        error.message
      );

    }

  },

  error: async (evento, mensaje) => {

    try {

      const query = `
        INSERT INTO bitacora_auditoria
        (nivel, evento, mensaje)
        VALUES (?, ?, ?)
      `;

      await db.query(query, [
        'ERROR',
        evento,
        mensaje
      ]);

      console.error(`[AUDITORÍA - ERROR] [${evento}]: ${mensaje}`);

    } catch (error) {

      console.error(
        'Error crítico al escribir en la bitácora de la base de datos:',
        error.message
      );

    }

  }

};

module.exports = logger;