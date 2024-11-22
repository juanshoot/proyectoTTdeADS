const {Router} = require('express');
const {userLogin} = require("../controllers/user");
const {createUser} = require("../controllers/user");
const {consultUsers} = require("../controllers/user");

//const{validarLogin} = require("../middlewares/validateLogin");
//const{validateAuth} = require ("../middlewares/validateAuth")


const router = Router();


router.post('/inicioSesion', userLogin);
router.post('/registroUsuario', createUser);
router.post('/consultarUsuarios', consultUsers);



module.exports = router;