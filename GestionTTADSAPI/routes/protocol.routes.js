const {Router} = require('express');
const {consultProtocol} = require("../controllers/protocol");
const {createProtocol} = require("../controllers/protocol");
const {deleteProtocol} = require("../controllers/protocol");
const {updateProtocol} = require("../controllers/protocol");

//const{validarLogin} = require("../middlewares/validateLogin");
//const{validateAuth} = require ("../middlewares/validateAuth")


const router = Router();


router.post('/consultarProtocolos', consultProtocol);
router.post('/crearProtocolo', createProtocol);
router.post('/darDeBajaProtocolo', deleteProtocol);
router.post('/actualizarProtocolo', updateProtocol);



module.exports = router;