const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection"); // Conexión con la base de datos MySQL
const bcrypt = require("bcryptjs"); // Usamos bcrypt para hashear contraseñas

const updateProtocol = async (req = request, res = response) => {
    const {
        lider,
        titulo,
        area,
        etapa,
        director,
        sinodal,
        catt,
        calificacion,
        comentarios,
        estado
    } = req.body;

    try {
        // Validaciones iniciales
        if (!lider || !titulo) {
            return res.status(400).json({ message: "El líder y el título del protocolo son obligatorios." });
        }

        // Convertir a string y sanitizar todos los campos
        const liderStr = String(lider || "").trim();
        const tituloStr = String(titulo || "").trim().toUpperCase();
        const areaStr = String(area || "").trim().toUpperCase();
        const etapaStr = String(etapa || "").trim().toUpperCase();
        const directorStr = String(director || "").trim().toUpperCase();
        const sinodalStr = String(sinodal || "").trim().toUpperCase();
        const cattStr = String(catt || "").trim().toUpperCase();
        const calificacionStr = String(calificacion || "").trim().toUpperCase();
        const comentariosStr = String(comentarios || "").trim();
        const estadoStr = String(estado || "").trim().toUpperCase();

        // Validaciones específicas
        if (liderStr.length !== 10 || isNaN(liderStr)) {
            return res.status(400).json({ message: "El líder debe ser un número de boleta con 10 dígitos." });
        }

        if (tituloStr.length > 170) {
            return res.status(400).json({ message: "El título no puede exceder los 170 caracteres." });
        }

        if (areaStr && areaStr.length > 100) {
            return res.status(400).json({ message: "El área no puede exceder los 100 caracteres." });
        }

        if (calificacionStr && calificacionStr.length > 100) {
            return res.status(400).json({ message: "La calificación no puede exceder los 100 caracteres." });
        }

        if (comentariosStr && comentariosStr.length > 255) {
            return res.status(400).json({ message: "Los comentarios no pueden exceder los 255 caracteres." });
        }

        const etapasPermitidas = ['REGISTRO', 'REVISIÓN', 'EVALUACIÓN', 'RETROALIMENTACIÓN', 'FINALIZADO'];
        if (etapaStr && !etapasPermitidas.includes(etapaStr)) {
            return res.status(400).json({ message: `La etapa debe ser una de las siguientes: ${etapasPermitidas.join(", ")}.` });
        }

        const estadosPermitidos = ['REGISTRADO', 'REVISIÓN', 'APROBADO', 'NO APROBADO'];
        if (estadoStr && !estadosPermitidos.includes(estadoStr)) {
            return res.status(400).json({ message: `El estado debe ser uno de los siguientes: ${estadosPermitidos.join(", ")}.` });
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

        // Construir la consulta de actualización dinámica
        let updateQuery = "UPDATE Protocolos SET";
        const queryParams = [];

        if (areaStr) {
            updateQuery += " area = ?,";
            queryParams.push(areaStr);
        }
        if (etapaStr) {
            updateQuery += " etapa = ?,";
            queryParams.push(etapaStr);
        }
        if (directorStr) {
            updateQuery += " director = ?,";
            queryParams.push(directorStr);
        }
        if (sinodalStr) {
            updateQuery += " sinodal = ?,";
            queryParams.push(sinodalStr);
        }
        if (cattStr) {
            updateQuery += " catt = ?,";
            queryParams.push(cattStr);
        }
        if (calificacionStr) {
            updateQuery += " calificacion = ?,";
            queryParams.push(calificacionStr);
        }
        if (comentariosStr) {
            updateQuery += " comentarios = ?,";
            queryParams.push(comentariosStr);
        }
        if (estadoStr) {
            updateQuery += " estado = ?,";
            queryParams.push(estadoStr);
        }

        // Remover la última coma y agregar la condición
        updateQuery = updateQuery.slice(0, -1) + " WHERE id_protocolo = ?;";
        queryParams.push(id_protocolo);

        // Ejecutar la actualización
        await pool.execute(updateQuery, queryParams);

        // Respuesta exitosa
        return res.status(200).json({
            message: "Protocolo actualizado correctamente.",
            protocolo_actualizado: {
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

module.exports = { updateProtocol };