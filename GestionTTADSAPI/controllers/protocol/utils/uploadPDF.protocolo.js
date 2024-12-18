const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection"); 
const jwt = require("jsonwebtoken");

const uploadPDF = async (req = request, res = response) => {
  const connection = await getConnection();
  const token = req.header("log-token");

  // Verificar si el token está presente
  if (!token) {
    return res.status(401).json({ message: "Por favor, inicie sesión." });
  }

  try {
    // Decodificar el token
    const decoded = jwt.verify(token, 'cLaaVe_SecReeTTa');
    const usuarioBoleta = decoded.boleta || decoded.clave_empleado;

    // Obtener los permisos del usuario
    const [permisos] = await connection.query(
      `SELECT permisos FROM Permisos 
       WHERE rol = (SELECT rol FROM Alumnos WHERE boleta = ? 
                   UNION 
                   SELECT rol FROM Docentes WHERE clave_empleado = ?)`,
      [usuarioBoleta, usuarioBoleta]
    );

    if (!permisos.length) {
      return res.status(403).json({ message: "No tienes permisos para realizar esta acción." });
    }

    const permisosUsuario = permisos[0].permisos;

    // Obtener los datos del cuerpo de la solicitud
    let { lider, titulo_protocolo, pdf } = req.body;

    // Validar que los campos estén presentes
    if (!lider || !titulo_protocolo || !pdf) {
      return res.status(400).json({ message: "Los campos 'lider', 'titulo del protocolo' y 'pdf' son obligatorios." });
    }


    titulo_protocolo = titulo_protocolo.toUpperCase();
    
    // Verificar si el protocolo existe
    const [protocolo] = await connection.query(
      `SELECT * FROM Protocolos 
       WHERE lider = ? AND titulo = ? AND estatus = 'A'`,
      [lider, titulo_protocolo]
    );

    if (!protocolo.length) {
      return res.status(404).json({ message: "No se encontró el protocolo con el líder y título proporcionados." });
    }

    const id_protocolo = protocolo[0].id_protocolo;

    // Comprobar si el usuario pertenece al equipo de este protocolo
    if (permisosUsuario.includes('A')) {
      const [alumno] = await connection.query(
        `SELECT * FROM Alumnos 
         WHERE boleta = ? AND id_protocolo = ? AND estado = 'A'`,
        [usuarioBoleta, id_protocolo]
      );

      if (!alumno.length) {
        return res.status(403).json({ message: "No tienes permiso para subir el PDF de este protocolo." });
      }
    }

    // Si el usuario tiene permiso 'G', se permite la carga del PDF sin restricciones

    // Actualizar la URL del PDF en la tabla de Protocolos
    await connection.query(
      `UPDATE Protocolos 
       SET pdf = ? 
       WHERE id_protocolo = ?`,
      [pdf, id_protocolo]
    );

    // Registrar la acción en la tabla ABC (para fines de auditoría)
    await connection.query(
      `INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
       VALUES (?, ?, ?, ?)`,
      ['Protocolos', id_protocolo, `Se subió un PDF: ${pdf}`, usuarioBoleta]
    );

    // Respuesta exitosa
    res.status(200).json({
      message: "PDF subido con éxito.",
      protocolo: {
        id_protocolo: id_protocolo,
        pdf_url: pdf
      }
    });

  } catch (error) {
    console.error('Error en uploadPDF:', error);
    res.status(500).json({ message: "Error interno del servidor." });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { uploadPDF };