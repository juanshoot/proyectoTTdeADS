const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection"); 
const jwt = require("jsonwebtoken");

const rateForm = async (req = request, res = response) => {
    try {
        const { titulo_protocolo, ...respuestas } = req.body;

        if (!titulo_protocolo) {
            return res.status(400).json({ message: "El título del protocolo es requerido." });
        }

        // Convertir a mayúsculas el título del protocolo para la búsqueda
        const tituloProtocoloUpper = titulo_protocolo.toUpperCase();

        // Extraer token del encabezado de autorización
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "No se proporcionó un token de autorización." });
        }

        // Verificar el token y extraer la información del usuario
        const decodedToken = jwt.verify(token, 'tu_clave_secreta'); // Cambiar 'tu_clave_secreta' por tu clave secreta real
        const { rol, correo } = decodedToken; // Se asume que el correo se extrae del token

        // Verificar si el rol tiene el permiso 'E'
        const connection = await getConnection();
        const [permiso] = await connection.query(
            `SELECT permisos FROM Permisos WHERE rol = ?`, [rol]
        );

        if (!permiso.length || !permiso[0].permisos.includes('E')) {
            return res.status(403).json({ message: "No tienes permiso para calificar el protocolo." });
        }

        // Verificar si el usuario está asignado como sinodal en el protocolo
        const [protocolo] = await connection.query(
            `SELECT * FROM Protocolos 
             WHERE UPPER(titulo) = ? 
             AND (sinodal_1 = ? OR sinodal_2 = ? OR sinodal_3 = ?)`, 
            [tituloProtocoloUpper, correo, correo, correo]
        );

        if (!protocolo.length) {
            return res.status(403).json({ message: "No estás asignado como sinodal para este protocolo." });
        }

        const protocoloId = protocolo[0].id_protocolo;
        const equipoId = protocolo[0].id_equipo;

        // Insertar la evaluación del sinodal
        const evaluacionData = {
            id_protocolo: protocoloId,
            id_equipo: equipoId,
            sinodal: correo,
            ...respuestas
        };

        const queryInsert = `
            INSERT INTO Evaluacion SET ?
        `;

        await connection.query(queryInsert, [evaluacionData]);

        // Actualizar la calificación en la tabla Protocolos 
        let aprobados = Object.values(respuestas).filter(value => value === 'SI').length;
        const calificacion = aprobados >= 6 ? 'Aprobado' : 'No Aprobado';

        await connection.query(
            `UPDATE Protocolos 
             SET calificacion = ?, comentarios = ? 
             WHERE id_protocolo = ?`, 
            [calificacion, 'Calificación generada por el sistema', protocoloId]
        );

        res.status(200).json({ 
            message: "Formulario evaluado con éxito.", 
            protocolo: {
                id: protocoloId,
                titulo: tituloProtocoloUpper,
                calificacion: calificacion
            },
            evaluacion: evaluacionData 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error al calificar el protocolo." });
    }
};

module.exports = { rateForm };