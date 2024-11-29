const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection");

const deleteProtocol = async (req = request, res = response) => {
    const { lider, titulo } = req.body;

    try {
        // Validaciones iniciales
        if (!lider || !titulo) {
            return res.status(400).json({ message: "El líder y el título del protocolo son obligatorios." });
        }

        // Convertir a string y sanitizar entrada
        const liderStr = String(lider || "").trim();
        const tituloStr = String(titulo || "").trim().toUpperCase();

        // Validaciones específicas
        if (liderStr.length !== 10 || isNaN(liderStr)) {
            return res.status(400).json({ message: "El líder debe ser un número de boleta con 10 dígitos." });
        }

        if (tituloStr.length === 0) {
            return res.status(400).json({ message: "El título del protocolo no puede estar vacío." });
        }

        const pool = await getConnection();

        // Verificar que el protocolo exista con el líder y el título proporcionados
        const queryCheckProtocol = `
            SELECT id_protocolo 
            FROM Protocolos 
            WHERE lider = ? AND titulo = ?;
        `;
        const [protocol] = await pool.execute(queryCheckProtocol, [liderStr, tituloStr]);

        if (protocol.length === 0) {
            return res.status(404).json({
                message: "No se encontró un protocolo con el líder y el título proporcionados."
            });
        }

        const id_protocolo = protocol[0].id_protocolo;

        // Eliminar el protocolo de la tabla Protocolos
        const queryDeleteProtocol = `
            DELETE FROM Protocolos 
            WHERE id_protocolo = ?;
        `;
        await pool.execute(queryDeleteProtocol, [id_protocolo]);

        // Actualizar la tabla Equipos para quitar la referencia al protocolo eliminado
        const queryUpdateEquipos = `
            UPDATE Equipos 
            SET id_protocolo = NULL 
            WHERE id_protocolo = ?;
        `;
        await pool.execute(queryUpdateEquipos, [id_protocolo]);

        // Actualizar la tabla Usuarios para quitar la referencia al protocolo eliminado
        const queryUpdateUsuarios = `
            UPDATE Usuarios 
            SET id_protocolo = NULL 
            WHERE id_protocolo = ?;
        `;
        await pool.execute(queryUpdateUsuarios, [id_protocolo]);

        // Respuesta exitosa
        return res.status(200).json({
            message: "Protocolo eliminado correctamente.",
            protocolo_eliminado: {
                id_protocolo,
                lider: liderStr,
                titulo: tituloStr
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor, intenta de nuevo más tarde." });
    }
};

module.exports = { deleteProtocol };