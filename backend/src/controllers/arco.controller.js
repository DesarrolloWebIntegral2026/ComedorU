const ArcoService = require('../services/arco.service');

const crearSolicitud = async (req, res) => {

    try {

        const resultado = await ArcoService.crearSolicitud(req.body);

        return res.status(201).json({
            ok: true,
            message: 'Solicitud ARCO registrada correctamente',
            data: resultado
        });

    } catch (error) {

        return res.status(400).json({
            ok: false,
            message: error.message
        });

    }

};

const obtenerSolicitudes = async (req, res) => {

    try {

        const solicitudes = await ArcoService.obtenerSolicitudes();

        return res.json({
            ok: true,
            solicitudes
        });

    } catch (error) {

        return res.status(500).json({
            ok: false,
            message: error.message
        });

    }

};

const anonimizarUsuario = async (req, res) => {

    try {

        const { id } = req.params;

        await ArcoService.anonimizarUsuario(id);

        return res.json({
            ok: true,
            message: 'Usuario anonimizado correctamente'
        });

    } catch (error) {

        return res.status(500).json({
            ok: false,
            message: error.message
        });

    }

};

module.exports = {

    crearSolicitud,

    obtenerSolicitudes,

    anonimizarUsuario

};