const {userLogin} = require("./utils/userLogin.user");
const {createUser} = require("./utils/createUser.user");
const {consultUsers} = require("./utils/consultUsers.user");
const {updateUser} = require("./utils/updateUser.user");
const {deleteUser} = require("./utils/deleteUser.user");

//equipos
const {newTeam} = require("./utils/teams/newTeam.user");
const {consultTeam} = require("./utils/teams/consultTeam.user");
const {updateTeam} = require("./utils/teams/updateTeam.user");
const {deleteTeam} = require("./utils/teams/deleteTeam.user");


module.exports = {
    userLogin,
    createUser,
    consultUsers,
    updateUser,
    deleteUser,

//equipos

    newTeam,
    consultTeam,
    updateTeam,
    deleteTeam
}