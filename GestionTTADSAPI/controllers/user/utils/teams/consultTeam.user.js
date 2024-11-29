const { request, response } = require("express");
const { getConnection } = require("../../../../models/sqlConnection");

const consultTeam = async (req = request, res = response) => {
    const { nombre_equipo, fecha, boleta_lider, titulo_protocolo } = req.body;

    try {
        const pool = await getConnection();

            // Validar si al menos un campo tiene un valor válido
            if (!nombre_equipo && !fecha && !boleta_lider && !titulo_protocolo) {
                return res.status(400).json({
                    message: "Por favor ingresa al menos un campo válido para consultar usuarios (nombre de equipo y fecha de registro, boleta del lider o titulo del protocolo)."
                });
            }

        // Construir la consulta dinámica
        let query = `
            SELECT 
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
                    message: "La fecha debe tener el formato MM/AA (Ejemplo: 23/02 para febrero de 2023)"
                });
            }

            const [anio, mes] = fecha.split('/').map(Number);
            let anioBase = 2000 + anio; // Convertir el año a 4 dígitos
            let anioBase2 = anioBase - 1;
            let fechaInicio = null;
            let fechaFin = null;

            // Si el mes es 02 (enero-julio), el semestre es de enero a julio
            if (mes === 2) {
                fechaInicio = `${anioBase}-01-01 00:00:00`; // Enero 1 del mismo año
                fechaFin = `${anioBase}-06-31 23:59:59`; // Julio 31 del mismo año
            } 
            // Si el mes es 01 (junio-diciembre), el semestre es de junio a diciembre
            else if (mes === 1) {
                anioBase += 1; // Incrementamos el año en 1 para el semestre de junio-diciembre
                fechaInicio = `${anioBase2}-07-01 00:00:00`; // Junio 1 del siguiente año
                fechaFin = `${anioBase2}-12-31 23:59:59`; // Diciembre 31 del siguiente año
            } else {
                return res.status(400).json({
                    message: "El mes ingresado debe ser 01 (junio-diciembre) o 02 (enero-julio)"
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
                message: "Verifica tus datos, no hemos encontrado equipos con los datos ingresados."
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