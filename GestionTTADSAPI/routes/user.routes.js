const {Router} = require('express');
const {userLogin} = require("../controllers/user");
const {createUser} = require("../controllers/user");


//const{validarLogin} = require("../middlewares/validateLogin");
//const{validateAuth} = require ("../middlewares/validateAuth")


const router = Router();


router.post('/inicioSesion', userLogin);
router.post('/registroUsuario', createUser);




module.exports = router;