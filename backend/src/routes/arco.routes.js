const express = require('express');

const router = express.Router();

const {
    crearSolicitud,
    obtenerSolicitudes,
    anonimizarUsuario
} = require('../controllers/arco.controller');

router.post('/solicitud', crearSolicitud);

router.get('/solicitudes', obtenerSolicitudes);

router.put('/anonimizar/:id', anonimizarUsuario);

module.exports = router;