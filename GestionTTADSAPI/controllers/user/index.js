const {userLogin} = require("./utils/userLogin.user");
const {createUser} = require("./utils/createUser.user");
const {consultUsers} = require("./utils/consultUsers.user");
const {updateUser} = require("./utils/updateUser.user");
const {deleteUser} = require("./utils/deleteUser.user");

//equipos
const {newTeam} = require("./utils/teams/newTeam.user")


module.exports = {
    userLogin,
    createUser,
    consultUsers,
    updateUser,
    deleteUser,

//equipos
    newTeam
}