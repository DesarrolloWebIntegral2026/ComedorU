const db = require('../config/db');

const crearSolicitud = async (datos) => {
    const sql = `
        INSERT INTO solicitudes_arco
        (usuario_id,tipo,descripcion)
        VALUES (?,?,?)
    `;

    const [resultado] = await db.execute(sql, [
        datos.usuario_id,
        datos.tipo,
        datos.descripcion
    ]);

    return resultado;
};

const obtenerSolicitudes = async () => {

    const sql = `
        SELECT *
        FROM solicitudes_arco
        ORDER BY fecha DESC
    `;

    const [rows] = await db.execute(sql);

    return rows;
};

const anonimizarUsuario = async (idUsuario) => {

    const sql = `
        UPDATE usuarios
        SET

        nombre='ANONIMO',

        apellidos='ANONIMO',

        correo=CONCAT('anonimo_',id,'@comedoru.com'),

        password='ANONIMIZADO',

        anonimizado=TRUE

        WHERE id=?
    `;

    const [resultado] = await db.execute(sql,[idUsuario]);

    return resultado;
};

module.exports = {

    crearSolicitud,

    obtenerSolicitudes,

    anonimizarUsuario

};