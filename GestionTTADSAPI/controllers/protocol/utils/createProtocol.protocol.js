const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection"); // Conexión con la base de datos MySQL

const createProtocol = async (req = request, res = response) => {
    let { lider_equipo, titulo, area } = req.body;

    try {
        // Convertir los valores a string y transformarlos a mayúsculas
        lider_equipo = String(lider_equipo || '').trim().toUpperCase();
        titulo = String(titulo || '').trim().toUpperCase();
        area = String(area || '').trim().toUpperCase();

        // Validar campos requeridos
        if (!lider_equipo || !titulo || !area) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        // Validaciones de longitud
        if (lider_equipo.length !== 10) {
            return res.status(400).json({ message: "La boleta del líder debe ser exactamente de 10 caracteres." });
        }

        if (titulo.length > 170) {
            return res.status(400).json({ message: "El título no debe superar los 170 caracteres." });
        }

        if (area.length > 100) {
            return res.status(400).json({ message: "El área no debe superar los 100 caracteres." });
        }

        const pool = await getConnection();

        // Verificar que el líder esté registrado como líder de un equipo
        const queryGetLeaderTeam = `
            SELECT id_equipo 
            FROM Equipos 
            WHERE lider = ?;
        `;
        const [leaderTeam] = await pool.execute(queryGetLeaderTeam, [lider_equipo]);

        if (leaderTeam.length === 0) {
            return res.status(404).json({ message: "El líder no está registrado en ningún equipo." });
        }

        const id_equipo = leaderTeam[0].id_equipo;

        // Verificar que el líder no tenga ya un protocolo
        const queryCheckLeaderProtocols = `
            SELECT id_protocolo 
            FROM Protocolos 
            WHERE lider = ?;
        `;
        const [leaderProtocols] = await pool.execute(queryCheckLeaderProtocols, [lider_equipo]);

        if (leaderProtocols.length > 0) {
            return res.status(400).json({ message: "El líder ya tiene un protocolo asignado." });
        }

        // Verificar que el título no exista en protocolos ni equipos
        const queryCheckTitles = `
            SELECT titulo 
            FROM Protocolos 
            WHERE titulo = ?
            UNION
            SELECT titulo 
            FROM Equipos 
            WHERE titulo = ?;
        `;
        const [existingTitles] = await pool.execute(queryCheckTitles, [titulo, titulo]);

        if (existingTitles.length > 0) {
            return res.status(400).json({ message: "El título ya está registrado en otro protocolo o equipo." });
        }

        // Actualizar el área en la tabla de equipos
        const queryUpdateTeamArea = `
            UPDATE Equipos 
            SET area = ? 
            WHERE id_equipo = ?;
        `;
        await pool.execute(queryUpdateTeamArea, [area, id_equipo]);

        // Insertar el nuevo protocolo en la tabla Protocolos
        const queryInsertProtocol = `
            INSERT INTO Protocolos (id_equipo, lider, titulo, area, etapa, director, sinodal, catt, comentarios) 
            VALUES (?, ?, ?, ?, 'Registro', 'Por Asignar', 'Por Asignar', 'Por Asignar', 'Por Asignar');
        `;
        await pool.execute(queryInsertProtocol, [id_equipo, lider_equipo, titulo, area]);

        // Actualizar el título en la tabla de equipos
        const queryUpdateTeamTitle = `
            UPDATE Equipos 
            SET titulo = ? 
            WHERE id_equipo = ?;
        `;
        await pool.execute(queryUpdateTeamTitle, [titulo, id_equipo]);

        // Respuesta exitosa
        return res.status(201).json({ 
            message: "Protocolo creado correctamente.",
            protocolo: {
                lider_equipo,
                titulo,
                area,
                id_equipo
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor, intenta de nuevo más tarde." });
    }
};

module.exports = { createProtocol };