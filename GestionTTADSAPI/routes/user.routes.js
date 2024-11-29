const {Router} = require('express');
const {userLogin} = require("../controllers/user");
const {createUser} = require("../controllers/user");
const {consultUsers} = require("../controllers/user");
const {updateUser} = require("../controllers/user");
const {deleteUser} = require("../controllers/user");


const {newTeam} = require("../controllers/user");
const {consultTeam} = require("../controllers/user");
const {deleteTeam} = require("../controllers/user");
const {updateTeam} = require("../controllers/user");


const{validarLogin} = require("../middlewares/validateLogin");
// const{validateAuth} = require ("../middlewares/validateAuth")


const router = Router();


router.post('/inicioSesion', userLogin);
router.post('/registroUsuario',[validarLogin],createUser);
router.post('/consultarUsuarios', [validarLogin],consultUsers);
router.post('/actualizarUsuario',[validarLogin], updateUser);
router.post('/darDeBajaUsuario',[validarLogin], deleteUser);

//equipos
router.post('/nuevoEquipo', newTeam);
router.post('/consultarEquipos', consultTeam);
router.post('/darDeBajaEquipo', deleteTeam);
router.post('/actualizarEquipo', updateTeam);










module.exports = router;