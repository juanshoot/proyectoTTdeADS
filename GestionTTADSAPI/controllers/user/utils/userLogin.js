const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection"); // Conexión con la base de datos MySQL
const bcrypt = require("bcryptjs"); // Usamos bcrypt para comparar contraseñas
const { generarToken } = require("../../../helpers/generate-jwt");

const loginUsuario = async (req = request, res = response) => {
    const { correo, password } = req.body;

    if (!correo) {
        return res.status(400).json({ message: 'Por favor ingresa tu correo' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Por favor ingresa tu contraseña' });
    }

    console.log("HOLAAAA");

    // Consulta SQL adaptada a la nueva base de datos
    const loginUsuarioQuery = `
        SELECT id_usuario, nombre, correo, contrasena, rol
        FROM Usuarios
        WHERE correo = ?`; // Usamos '?' para evitar inyecciones SQL

    try {
        const pool = await getConnection(); // Conectamos a la base de datos
        const [result] = await pool.execute(loginUsuarioQuery, [correo]); // Ejecutamos la consulta

        if (result.length < 1) {
            return res.status(400).json({ message: 'Este usuario no se encontró o no está registrado. Verifica tus datos e inténtalo de nuevo' });
        }

        const usuario = result[0]; // Extraemos el primer usuario encontrado

        // Verificar si las contraseñas coinciden usando bcrypt
        const passwordMatch = await bcrypt.compare(password, usuario.contrasena); 

        if (!passwordMatch) {
            return res.status(400).json({ message: 'La contraseña es incorrecta, verifica tus datos e inténtalo de nuevo' });
        }

        // Si la contraseña es correcta, generamos el token
        const tipoUsuario = usuario.rol.trim().toLowerCase();
        let permisos;

        // Asignación de permisos dependiendo del rol
        if (tipoUsuario === 'sinodal') {
            permisos = 'acceso_limitado';
        } else if (tipoUsuario === 'catt') {
            permisos = 'acceso_total';
        } else {
            permisos = 'acceso_basico';
        }

        // Generar el token con permisos
        let payload = {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol,
            tokenType: 'log-token'
        };

        let token = await generarToken(payload); // Función para generar el token

        // Registrar el intento de inicio de sesión (fecha de actualización)
        const updateLoginQuery = `
            UPDATE Usuarios
            SET fecha_creacion = NOW()  -- Actualizamos la fecha de creación si es necesario
            WHERE id_usuario = ?`;

        await pool.execute(updateLoginQuery, [usuario.id_usuario]);

        return res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en el servidor, intenta de nuevo más tarde' });
    }
};

module.exports = { loginUsuario };