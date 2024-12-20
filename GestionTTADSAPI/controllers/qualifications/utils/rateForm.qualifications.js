const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection"); 
const jwt = require("jsonwebtoken");

const rateForm = async (req = request, res = response) => {
    try {
        let {
            titulo_protocolo,
            titulo_corresponde_producto,
            observaciones_1,
            resumen_claro,
            observaciones_2,
            palabras_clave_adecuadas,
            observaciones_3,
            problema_comprensible,
            observaciones_4,
            objetivo_preciso_relevante,
            observaciones_5,
            planteamiento_claro,
            observaciones_6,
            contribuciones_justificadas,
            observaciones_7,
            viabilidad_adecuada,
            observaciones_8,
            propuesta_metodologica_pertinente,
            observaciones_9,
            calendario_adecuado,
            observaciones_10,
            aprobado,
            recomendaciones_adicionales
        } = req.body;

        // Convertir a mayúsculas los campos relevantes
        titulo_protocolo = titulo_protocolo?.toUpperCase();
        titulo_corresponde_producto = titulo_corresponde_producto?.toUpperCase();
        resumen_claro = resumen_claro?.toUpperCase();
        palabras_clave_adecuadas = palabras_clave_adecuadas?.toUpperCase();
        problema_comprensible = problema_comprensible?.toUpperCase();
        objetivo_preciso_relevante = objetivo_preciso_relevante?.toUpperCase();
        planteamiento_claro = planteamiento_claro?.toUpperCase();
        contribuciones_justificadas = contribuciones_justificadas?.toUpperCase();
        viabilidad_adecuada = viabilidad_adecuada?.toUpperCase();
        propuesta_metodologica_pertinente = propuesta_metodologica_pertinente?.toUpperCase();
        calendario_adecuado = calendario_adecuado?.toUpperCase();
        aprobado = aprobado?.toUpperCase();

        if (!titulo_protocolo) {
            return res.status(400).json({ message: "Faltan datos en la solicitud. Proporcione el título del protocolo." });
        }

        const token = req.header("log-token");
        if (!token) {
            return res.status(401).json({ message: "No se proporcionó un token de autorización." });
        }

        const decodedToken = jwt.verify(token, 'cLaaVe_SecReeTTa');
        const { rol, boleta } = decodedToken;

        const connection = await getConnection();

        // Verificar permisos
        const [permiso] = await connection.query(
            `SELECT permisos FROM Permisos WHERE rol = ?`, [rol]
        );

        if (!permiso.length || !permiso[0].permisos.includes('E')) {
            return res.status(403).json({ message: "No tienes permiso para calificar protocolos." });
        }

        // Obtener protocolo
        const [protocolo] = await connection.query(
            `SELECT * FROM Protocolos WHERE UPPER(titulo) = ? AND estatus = 'A'`, 
            [titulo_protocolo.toUpperCase()]
        );

        if (!protocolo.length) {
            return res.status(404).json({ message: "No se encontró un protocolo con ese título en estatus 'A'." });
        }

        const protocoloData = protocolo[0];
        const protocoloId = protocoloData.id_protocolo;
        const equipoId = protocoloData.id_equipo;

        // Verificar si el usuario es sinodal del protocolo
        const sinodales = [protocoloData.sinodal_1, protocoloData.sinodal_2, protocoloData.sinodal_3];
        if (!sinodales.includes(boleta)) {
            return res.status(403).json({ message: "No eres sinodal de este protocolo." });
        }

        // Determinar qué campo de calificación pertenece al sinodal actual
        let califField;
        if (boleta === protocoloData.sinodal_1) califField = 'calif_Sinodal1';
        else if (boleta === protocoloData.sinodal_2) califField = 'calif_Sinodal2';
        else if (boleta === protocoloData.sinodal_3) califField = 'calif_Sinodal3';

        // Obtener la calificación actual del sinodal
        const [califActual] = await connection.query(
            `SELECT ${califField} FROM Protocolos WHERE id_protocolo = ?`, 
            [protocoloId]
        );

        const califSinodal = califActual[0][califField];

        if (califSinodal === 'APROBADO') {
            return res.status(403).json({ message: "Ya has calificado este protocolo como 'APROBADO' y no puedes cambiar la calificación." });
        }

        // Insertar evaluación
        await connection.query(
            `INSERT INTO Evaluacion (
                id_protocolo, id_equipo, sinodal, titulo_corresponde_producto, observaciones_1, 
                resumen_claro, observaciones_2, palabras_clave_adecuadas, observaciones_3, 
                problema_comprensible, observaciones_4, objetivo_preciso_relevante, observaciones_5, 
                planteamiento_claro, observaciones_6, contribuciones_justificadas, observaciones_7, 
                viabilidad_adecuada, observaciones_8, propuesta_metodologica_pertinente, observaciones_9, 
                calendario_adecuado, observaciones_10, aprobado, recomendaciones_adicionales
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [
                protocoloId, equipoId, boleta, titulo_corresponde_producto, observaciones_1, 
                resumen_claro, observaciones_2, palabras_clave_adecuadas, observaciones_3, 
                problema_comprensible, observaciones_4, objetivo_preciso_relevante, observaciones_5, 
                planteamiento_claro, observaciones_6, contribuciones_justificadas, observaciones_7, 
                viabilidad_adecuada, observaciones_8, propuesta_metodologica_pertinente, observaciones_9, 
                calendario_adecuado, observaciones_10, aprobado, recomendaciones_adicionales
            ]
        );

        const califValue = aprobado === 'SI' ? 'APROBADO' : 'NO APROBADO';

        await connection.query(
            `UPDATE Protocolos SET ${califField} = ? WHERE id_protocolo = ?`, 
            [califValue, protocoloId]
        );

        await connection.query(
            `INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
             VALUES ('Protocolos', ?, ?, ?)`, 
            [protocoloId, `Calificación de sinodal ${boleta}: ${califValue}`, boleta]
        );

        res.status(200).json({ 
            message: "Evaluación registrada con éxito.", 
            protocolo: {
                titulo: titulo_protocolo
            }, 
            calificacion: califValue 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error al registrar la evaluación." });
    }
};

module.exports = { rateForm };