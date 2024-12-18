const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const updateProtocol = async (req = request, res = response) => {
    const { lider, titulo, contrasena } = req.body;
    const token = req.header("log-token");
    let connection; // 🔥 Declarar la variable `connection` fuera del try

    // Validación de parámetros
    if (!token) {
        return res.status(400).json({
            message: "Por favor, inicia sesión"
        });
    }

    if (!contrasena || !titulo || !lider) {
        return res.status(400).json({
            message: "Faltan parámetros obligatorios: lider, contraseña o título."
        });
    }

    try {
        // Decodificar el token para obtener la boleta (usuario)
        const decoded = jwt.verify(token, 'cLaaVe_SecReeTTa');
        const usuario = decoded.boleta || decoded.clave_empleado;

        console.log("Usuario identificado con boleta/clave: ", usuario);

        // Conexión a la base de datos
        connection = await getConnection(); // 🔥 Usar la variable global `connection`

        // Obtener el rol del usuario (Alumno o Docente)
        const [userRows] = await connection.query(
            "SELECT rol, contrasena FROM Alumnos WHERE boleta = ? UNION SELECT rol, contrasena FROM Docentes WHERE clave_empleado = ?",
            [usuario, usuario]
        );

        if (userRows.length === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado."
            });
        }

        const rol = userRows[0].rol;
        const contrasenaHash = userRows[0].contrasena;

        // Verificar la contraseña proporcionada
        const passwordMatch = await bcrypt.compare(contrasena, contrasenaHash);

        if (!passwordMatch) {
            return res.status(403).json({
                message: "Contraseña incorrecta."
            });
        }

        // Obtener los permisos asociados al rol del usuario
        const [permisosRows] = await connection.query(
            "SELECT permisos FROM Permisos WHERE rol = ?",
            [rol]
        );

        if (permisosRows.length === 0) {
            return res.status(403).json({
                message: "No se encontraron permisos para el rol especificado."
            });
        }

        const permisos = permisosRows[0].permisos;

        // Verificar si el usuario tiene permiso 'B' o 'G'
        if (!permisos.includes('B') && !permisos.includes('G')) {
            return res.status(403).json({
                message: "No tienes permisos suficientes para realizar esta acción."
            });
        }

        // Verificar si el líder es realmente el líder del protocolo
        const [protocolo] = await connection.query(
            "SELECT * FROM Protocolos WHERE lider = ? AND estatus = 'A'",
            [lider]
        );

        if (protocolo.length === 0) {
            return res.status(404).json({
                message: "El protocolo no existe o el líder proporcionado no coincide con el líder registrado."
            });
        }

        const idProtocolo = protocolo[0].id_protocolo;

        // **Verificar si el usuario es líder del protocolo o si tiene permiso 'G'**
        if (!permisos.includes('G') && usuario !== lider) {
            return res.status(403).json({
                message: "Solo el líder del protocolo o un usuario con permisos 'G' puede actualizar el título."
            });
        }

        // **Actualizar el título del protocolo**
        await connection.query(
            "UPDATE Protocolos SET titulo = ? WHERE id_protocolo = ? AND estatus = 'A'",
            [titulo.toUpperCase(), idProtocolo]
        );

        // **Registrar la actualización en la tabla ABC**
        await connection.query(
            `INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
             VALUES (?, ?, ?, ?)`,
            ['Protocolos', idProtocolo, `Actualización del título del protocolo a: ${titulo.toUpperCase()}`, usuario]
        );

        // Responder al cliente con éxito
        res.status(200).json({
            message: "El título del protocolo se actualizó con éxito.",
            protocolo: {
                id_protocolo: idProtocolo,
                nuevo_titulo: titulo.toUpperCase()
            }
        });

    } catch (error) {
        console.error("Error en updateProtocol:", error);
        res.status(500).json({
            message: "Error interno del servidor."
        });
    } finally {
        // 🔥 Usar if para verificar que `connection` esté definido antes de liberarlo
        if (connection) connection.release();
    }
};

module.exports = { updateProtocol };