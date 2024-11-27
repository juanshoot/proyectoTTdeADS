const { request, response } = require("express");
const { getConnection } = require("../../../../models/sqlConnection");

const consultTeam = async (req = request, res = response) => {
    const { nombre_equipo, fecha, boleta_lider, titulo_protocolo } = req.body;

    try {
        const pool = await getConnection();

        // Construir la consulta dinámica
        let query = `
            SELECT 
                id_equipo, 
                nombre_equipo, 
                DATE_FORMAT(fecha_registro, '%d/%m/%Y') AS fecha_registro,
                lider,
                titulo
            FROM Equipos
            WHERE 1=1
        `;
        const queryParams = [];

        // Agregar filtros opcionales
        if (nombre_equipo) {
            query += " AND nombre_equipo LIKE ?";
            queryParams.push(`%${String(nombre_equipo).trim().toUpperCase()}%`);
        }

        if (fecha) {
            if (!/^\d{2}\/\d{2}$/.test(fecha)) {
                return res.status(400).json({
                    message: "La fecha debe tener el formato MM/AA (Ejemplo: 25/01 para enero-junio 2025)"
                });
            }

            const [mes, anio] = fecha.split('/').map(Number);
            const anioBase = 2000 + anio;

            let fechaInicio, fechaFin;
            if (mes === 1) {
                // Semestre de julio a diciembre
                fechaInicio = `${anioBase}-07-01`;
                fechaFin = `${anioBase}-12-31`;
            } else if (mes === 2) {
                // Semestre de enero a junio
                fechaInicio = `${anioBase}-01-01`;
                fechaFin = `${anioBase}-06-30`;
            } else {
                return res.status(400).json({
                    message: "El mes ingresado debe ser 01 (julio-diciembre) o 02 (enero-junio)."
                });
            }

            query += " AND fecha_registro BETWEEN ? AND ?";
            queryParams.push(fechaInicio, fechaFin);
        }

        if (boleta_lider) {
            if (boleta_lider.length !== 10 || isNaN(boleta_lider)) {
                return res.status(400).json({
                    message: "La boleta del líder debe ser un número de 10 dígitos."
                });
            }
            query += " AND lider = ?";
            queryParams.push(boleta_lider);
        }

        if (titulo_protocolo) {
            query += " AND titulo LIKE ?";
            queryParams.push(`%${String(titulo_protocolo).trim()}%`);
        }

        // Ejecutar la consulta
        const [teams] = await pool.execute(query, queryParams);

        // Verificar si no se encontraron resultados
        if (teams.length === 0) {
            return res.status(404).json({
                message: "No se encontraron equipos con los filtros proporcionados."
            });
        }

        // Responder con los equipos encontrados
        return res.status(200).json({ equipos: teams });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor, intenta de nuevo más tarde." });
    }
};

module.exports = { consultTeam };