const {Router} = require('express');
const {userLogin} = require("../controllers/user");
const {createUser} = require("../controllers/user");
const {consultUsers} = require("../controllers/user");
const {updateUser} = require("../controllers/user");
const {deleteUser} = require("../controllers/user");


const {newTeam} = require("../controllers/user");


//const{validarLogin} = require("../middlewares/validateLogin");
//const{validateAuth} = require ("../middlewares/validateAuth")


const router = Router();


router.post('/inicioSesion', userLogin);
router.post('/registroUsuario', createUser);
router.post('/consultarUsuarios', consultUsers);
router.post('/actualizarUsuario', updateUser);
router.post('/darDeBajaUsuario', deleteUser);

//equipos
router.post('/nuevoEquipo', newTeam);




module.exports = router;