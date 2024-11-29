const { request, response } = require("express");
const { getConnection } = require("../../../../models/sqlConnection");

const deleteTeam = async (req = request, res = response) => {
    const { lider, nombre_equipo } = req.body;

    try {
        // Validaciones iniciales
        if (!lider || !nombre_equipo) {
            return res.status(400).json({ message: "La boleta del líder y el nombre del equipo son obligatorios." });
        }

        // Convertir a string y sanitizar entrada
        const liderStr = String(lider || "").trim();
        const nombreEquipoStr = String(nombre_equipo || "").trim().toUpperCase();

        // Validaciones específicas
        if (liderStr.length !== 10 || isNaN(liderStr)) {
            return res.status(400).json({ message: "La boleta del líder debe ser un número de 10 dígitos." });
        }

        if (nombreEquipoStr.length === 0) {
            return res.status(400).json({ message: "El nombre del equipo no puede estar vacío." });
        }

        const pool = await getConnection();

        // Verificar que el equipo exista con el líder y el nombre proporcionados
        const queryCheckTeam = `
            SELECT id_equipo 
            FROM Equipos 
            WHERE lider = ? AND nombre_equipo = ?;
        `;
        const [team] = await pool.execute(queryCheckTeam, [liderStr, nombreEquipoStr]);

        if (team.length === 0) {
            return res.status(404).json({
                message: "No se encontró un equipo con la boleta del líder y el nombre del equipo proporcionados."
            });
        }

        const id_equipo = team[0].id_equipo;

        // Actualizar a los usuarios asociados al equipo para quitarles la referencia al equipo eliminado
        const queryUpdateUsers = `
            UPDATE Usuarios 
            SET id_equipo = NULL, nombre_equipo = NULL 
            WHERE id_equipo = ?;
        `;
        await pool.execute(queryUpdateUsers, [id_equipo]);

        // Eliminar protocolos asociados al equipo
        const queryDeleteProtocols = `
            DELETE FROM Protocolos 
            WHERE id_equipo = ?;
        `;
        await pool.execute(queryDeleteProtocols, [id_equipo]);

        // Eliminar el equipo de la tabla Equipos
        const queryDeleteTeam = `
            DELETE FROM Equipos 
            WHERE id_equipo = ?;
        `;
        await pool.execute(queryDeleteTeam, [id_equipo]);

        // Respuesta exitosa
        return res.status(200).json({
            message: "Equipo eliminado correctamente.",
            equipo_eliminado: {
                id_equipo,
                nombre_equipo: nombreEquipoStr,
                lider: liderStr
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor, intenta de nuevo más tarde." });
    }
};

module.exports = { deleteTeam };