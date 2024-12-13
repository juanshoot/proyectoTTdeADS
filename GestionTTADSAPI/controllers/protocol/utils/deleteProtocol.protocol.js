const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection"); 
const jwt = require("jsonwebtoken");

const deleteProtocol = async (req = request, res = response) => {
  const connection = await getConnection();
  const token = req.header("log-token");

  if (!token) {
    return res.status(401).json({ message: "Por favor, inicie sesión." });
  }

  try {
    // Decodificar token para obtener la boleta o clave de usuario
    const decoded = jwt.verify(token, 'cLaaVe_SecReeTTa');
    const usuarioBoleta = decoded.boleta || decoded.clave_empleado;

    // Obtener los permisos del usuario desde la tabla Permisos
    const [permisos] = await connection.query(
      "SELECT permisos FROM Permisos WHERE rol = (SELECT rol FROM Alumnos WHERE boleta = ? UNION SELECT rol FROM Docentes WHERE clave_empleado = ?)",
      [usuarioBoleta, usuarioBoleta]
    );

    if (!permisos.length) {
      return res.status(403).json({ message: "No tienes permisos para realizar esta acción." });
    }

    const permisosUsuario = permisos[0].permisos;

    // Verificar si el usuario tiene permiso 'D' o 'G'
    if (!permisosUsuario.includes('D') && !permisosUsuario.includes('G')) {
      return res.status(403).json({ message: "No tienes permisos para borrar protocolos." });
    }

    let { lider, titulo_protocolo } = req.body;

    lider = lider.toUpperCase();
    titulo_protocolo = titulo_protocolo.toUpperCase();

    console.log(titulo_protocolo);

    // Validar que los campos sean correctos
    if (typeof lider !== 'string' || typeof titulo_protocolo !== 'string') {
      return res.status(400).json({ message: "Los campos 'lider' y 'titulo_protocolo' deben ser cadenas." });
    }

    const tituloProtocolo = titulo_protocolo.toUpperCase();

    // Verificar que el protocolo exista y esté activo
    const [protocolo] = await connection.query(
      `SELECT * 
       FROM Protocolos 
       WHERE titulo = ? 
         AND estatus = 'A' 
         AND id_equipo = (SELECT id_equipo FROM Equipos WHERE lider = ? AND estado = 'A')`,
      [tituloProtocolo, lider]
    );

    if (!protocolo.length) {
      return res.status(404).json({ message: "El protocolo no existe o ya ha sido dado de baja." });
    }

    const idProtocolo = protocolo[0].id_protocolo;
    const idEquipo = protocolo[0].id_equipo;
    const liderEquipo = protocolo[0].lider;

    // **Verificar si el usuario es líder del protocolo** (si no tiene permiso 'G')
    if (!permisosUsuario.includes('G') && lider !== liderEquipo) {
      return res.status(403).json({ message: "Solo el líder del protocolo puede borrarlo." });
    }

    // **Borrado lógico del protocolo**: Cambiar el estatus de 'A' a 'B'
    const fechaEliminacion = new Date(); // Obtener la fecha actual
    await connection.query(
      `UPDATE Protocolos 
       SET estatus = 'B', 
           fecha_eliminacion = ?, 
           usuario_eliminacion = ?
       WHERE id_protocolo = ?`,
      [fechaEliminacion, usuarioBoleta, idProtocolo]
    );

    // **Eliminar referencias de id_protocolo en la tabla Alumnos**
    await connection.query(
      "UPDATE Alumnos SET id_protocolo = NULL WHERE id_equipo = ?",
      [idEquipo]
    );

    // **Eliminar referencias de id_protocolo en la tabla Docentes**
    await connection.query(
      "UPDATE Docentes SET id_protocolo = NULL WHERE id_equipo = ?",
      [idEquipo]
    );

    // **Eliminar la referencia de id_protocolo en la tabla Equipos**
    await connection.query(
      "UPDATE Equipos SET id_protocolo = NULL WHERE id_equipo = ?",
      [idEquipo]
    );

    // **Registrar la eliminación en la tabla ABC**
    await connection.query(
      `INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
       VALUES (?, ?, ?, ?)`,
      ['Protocolos', idProtocolo, `Borrado lógico del protocolo: ${tituloProtocolo}`, usuarioBoleta]
    );

    // Responder al cliente con éxito
    res.status(200).json({
      message: "Protocolo eliminado con éxito",
      protocolo: {
        id_protocolo: idProtocolo,
        titulo_protocolo: tituloProtocolo
      }
    });

  } catch (error) {
    console.error('Error en deleteProtocol:', error);
    res.status(500).json({ message: "Error interno del servidor." });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { deleteProtocol };