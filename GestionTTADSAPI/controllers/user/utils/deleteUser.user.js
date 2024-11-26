const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection");

const deleteUser = async (req = request, res = response) => {
    const { boleta } = req.body;

    try {
        // Validar que la boleta esté presente
        if (!boleta) {
            return res.status(400).json({ message: "La boleta es obligatoria para eliminar un usuario." });
        }

        // Convertir la boleta a string y sanitizar entrada
        const boletaStr = String(boleta).trim();

        // Validar que la boleta tenga exactamente 10 dígitos
        if (boletaStr.length !== 10 || isNaN(boletaStr)) {
            return res.status(400).json({ message: "La boleta debe ser un número de 10 dígitos." });
        }

        const pool = await getConnection();

        // Verificar si el usuario con esa boleta existe
        const checkUserQuery = `SELECT id_usuario FROM Usuarios WHERE boleta = ?;`;
        const [user] = await pool.execute(checkUserQuery, [boletaStr]);

        if (user.length === 0) {
            return res.status(404).json({ message: "No se encontró un usuario con esa boleta." });
        }

        // Eliminar al usuario
        const deleteQuery = `DELETE FROM Usuarios WHERE boleta = ?;`;
        await pool.execute(deleteQuery, [boletaStr]);

        // Respuesta exitosa
        return res.status(200).json({ message: "Usuario eliminado correctamente." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor, intenta de nuevo más tarde." });
    }
};

module.exports = { deleteUser };