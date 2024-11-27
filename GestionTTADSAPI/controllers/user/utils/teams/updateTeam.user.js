const { request, response } = require("express");
const { getConnection } = require("../../../../models/sqlConnection");

const updateTeam = async (req = request, res = response) => {
    const { lider, nombre_equipo, titulo, sinodal, director, area } = req.body;

    try {
        // Validaciones iniciales
        if (!lider) {
            return res.status(400).json({ message: "La boleta del líder es obligatoria para actualizar los datos del equipo." });
        }

        // Convertir todos los valores a string y sanitizar entrada
        const liderStr = String(lider || "").trim();
        const nombreEquipoStr = String(nombre_equipo || "").trim().toUpperCase();
        const tituloStr = String(titulo || "").trim();
        const sinodalStr = String(sinodal || "").trim();
        const directorStr = String(director || "").trim();
        const areaStr = String(area || "").trim();

        // Validaciones de boleta del líder
        if (liderStr.length !== 10 || isNaN(liderStr)) {
            return res.status(400).json({ message: "La boleta del líder debe ser un número de 10 dígitos." });
        }

        if (sinodalStr.length > 0 && (sinodalStr.length !== 10 || isNaN(sinodalStr))) {
            return res.status(400).json({ message: "El sinodal debe ser una boleta válida de 10 dígitos." });
        }

        if (directorStr.length > 0 && (directorStr.length !== 10 || isNaN(directorStr))) {
            return res.status(400).json({ message: "El director debe ser una boleta válida de 10 dígitos." });
        }

        const pool = await getConnection();

        // Verificar que el líder exista y esté asignado a un equipo
        const checkLiderQuery = `
            SELECT id_equipo 
            FROM Equipos 
            WHERE lider = ?;
        `;
        const [team] = await pool.execute(checkLiderQuery, [liderStr]);

        if (team.length === 0) {
            return res.status(404).json({
                message: "No se encontró un equipo asociado a la boleta del líder proporcionada."
            });
        }

        const id_equipo = team[0].id_equipo;

        // Construir la consulta dinámica para actualizar
        const updateQuery = `
            UPDATE Equipos
            SET 
                nombre_equipo = ?,
                titulo = ?,
                sinodal = ?,
                director = ?,
                area = ?,
                fecha_registro = NOW()
            WHERE lider = ?;
        `;

        // Ejecutar la consulta
        await pool.execute(updateQuery, [
            nombreEquipoStr,
            tituloStr || "Por Asignar",
            sinodalStr || "Por Asignar",
            directorStr || "Por Asignar",
            areaStr || "Por Asignar",
            liderStr
        ]);

        // Respuesta exitosa
        return res.status(200).json({
            message: "Equipo actualizado correctamente.",
            equipo_actualizado: {
                id_equipo,
                nombre_equipo: nombreEquipoStr,
                lider: liderStr,
                titulo: tituloStr || "Por Asignar",
                sinodal: sinodalStr || "Por Asignar",
                director: directorStr || "Por Asignar",
                area: areaStr || "Por Asignar"
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor, intenta de nuevo más tarde." });
    }
};

module.exports = { updateTeam };