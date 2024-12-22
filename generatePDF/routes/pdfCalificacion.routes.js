const {Router} = require('express');

const { generarPDFcalificacion } = require('../controller/generarPdfCalificacion.controller');

const router = Router();


router.post('/generarPDFcalificacion', generarPDFcalificacion);


module.exports = router;