const ArcoModel = require('../models/arco.model');

const crearSolicitud = async (datos) => {
    return await ArcoModel.crearSolicitud(datos);
};

const obtenerSolicitudes = async () => {
    return await ArcoModel.obtenerSolicitudes();
};

const anonimizarUsuario = async (idUsuario) => {
    return await ArcoModel.anonimizarUsuario(idUsuario);
};

module.exports = {
    crearSolicitud,
    obtenerSolicitudes,
    anonimizarUsuario
};