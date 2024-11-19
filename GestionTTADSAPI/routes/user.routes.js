const {Router} = require('express');
const {loginUsuario} = require("../controllers/user");
const {registerUsuario} = require("../controllers/user");


//const{validarLogin} = require("../middlewares/validateLogin");
//const{validateAuth} = require ("../middlewares/validateAuth")


const router = Router();


router.post('/loginUsuario', loginUsuario);
router.post('/registerUsuario', registerUsuario);




module.exports = router;