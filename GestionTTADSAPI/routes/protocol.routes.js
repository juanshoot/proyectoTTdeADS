const {Router} = require('express');
const {consultProtocol} = require("../controllers/protocol");
const {createProtocol} = require("../controllers/protocol");
const {deleteProtocol} = require("../controllers/protocol");
const {updateProtocol} = require("../controllers/protocol");

const{validarLogin} = require("../middlewares/validateLogin");
//const{validateAuth} = require ("../middlewares/validateAuth")


const router = Router();


router.post('/consultarProtocolos',[validarLogin], consultProtocol);
router.post('/crearProtocolo',[validarLogin], createProtocol);
router.post('/darDeBajaProtocolo',[validarLogin], deleteProtocol);
router.post('/actualizarProtocolo',[validarLogin], updateProtocol);



module.exports = router;