const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection"); // Conexión con la base de datos MySQL


const consultProtocol = async (req = request, res = response) => {
    let { nombre_equipo, fecha, boleta_lider, titulo_protocolo } = req.body;

    try {
        // Convertir los valores a string y transformarlos a mayúsculas
        nombre_equipo = nombre_equipo ? String(nombre_equipo).trim().toUpperCase() : null;
        fecha = fecha ? String(fecha).trim() : null;
        boleta_lider = boleta_lider ? String(boleta_lider).trim() : null;
        titulo_protocolo = titulo_protocolo ? String(titulo_protocolo).trim().toUpperCase() : null;

        // Validaciones de entrada
        if (fecha && !/^\d{2}\/\d{2}$/.test(fecha)) {
            return res.status(400).json({ message: "La fecha debe tener el formato MM/AA (Ejemplo: 25/01 para enero-junio de 2025)." });
        }

        if (boleta_lider && boleta_lider.length !== 10) {
            return res.status(400).json({ message: "La boleta del líder debe ser exactamente de 10 caracteres." });
        }

        const pool = await getConnection();

        // Construcción dinámica de la consulta SQL
        let query = `
            SELECT 
                p.titulo AS titulo_protocolo,
                p.lider AS boleta_lider,
                p.area,
                p.etapa,
                p.director,
                p.sinodal,
                p.catt,
                p.calificacion,
                p.estado,
                p.fecha_registro,
                e.nombre_equipo
            FROM Protocolos p
            LEFT JOIN Equipos e ON p.id_equipo = e.id_equipo
            WHERE 1=1
        `;
        const queryParams = [];

        // Filtros opcionales
        if (nombre_equipo) {
            query += " AND e.nombre_equipo = ?";
            queryParams.push(nombre_equipo);
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

            query += " AND p.fecha_registro BETWEEN  ? AND ?";
            queryParams.push(fechaInicio, fechaFin);
        }

        if (boleta_lider) {
            query += " AND p.lider = ?";
            queryParams.push(boleta_lider);
        }

        if (titulo_protocolo) {
            query += " AND p.titulo = ?";
            queryParams.push(titulo_protocolo);
        }

        // Ejecutar la consulta
        const [protocols] = await pool.execute(query, queryParams);

        if (protocols.length === 0) {
            return res.status(404).json({ message: "No se encontraron protocolos que coincidan con los criterios." });
        }

        // Formatear las fechas de los resultados
        const formattedProtocols = protocols.map(protocol => ({
            ...protocol,
            fecha_registro: new Date(protocol.fecha_registro).toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            })
        }));

        // Responder con los protocolos encontrados
        return res.status(200).json({
            message: "Protocolos encontrados.",
            protocolos: formattedProtocols
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor, intenta de nuevo más tarde." });
    }
};

module.exports = { consultProtocol };