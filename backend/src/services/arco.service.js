const ArcoRepository = require('../repositories/arco.repository');

const crearSolicitud = async (datos) => {

    if (!datos.usuario_id) {
        throw new Error('El usuario es obligatorio');
    }

    if (!datos.tipo) {
        throw new Error('El tipo de solicitud es obligatorio');
    }

    const tiposPermitidos = [
        'ACCESO',
        'RECTIFICACION',
        'CANCELACION',
        'OPOSICION'
    ];

    if (!tiposPermitidos.includes(datos.tipo)) {
        throw new Error('Tipo de solicitud inválido');
    }

    return await ArcoRepository.crearSolicitud(datos);
};

const obtenerSolicitudes = async () => {
    return await ArcoRepository.obtenerSolicitudes();
};

const anonimizarUsuario = async (idUsuario) => {
    return await ArcoRepository.anonimizarUsuario(idUsuario);
};

module.exports = {
    crearSolicitud,
    obtenerSolicitudes,
    anonimizarUsuario
};