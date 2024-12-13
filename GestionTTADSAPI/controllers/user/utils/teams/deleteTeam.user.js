const { request, response } = require("express");
const { getConnection } = require("../../../../models/sqlConnection");
const jwt = require("jsonwebtoken");

const deleteTeam = async (req = request, res = response) => {
  const connection = await getConnection();
  const token = req.header("log-token");

  if (!token) {
    return res.status(401).json({ message: "Por favor, inicie sesión" });
  }

  try {
    // Decodificar token para obtener la boleta o clave de usuario
    const decoded = jwt.verify(token, 'cLaaVe_SecReeTTa');
    const usuarioBoleta = decoded.boleta || decoded.clave_empleado;

    console.log(usuarioBoleta);

    // Obtener los permisos del usuario desde la tabla Permisos
    const [permisos] = await connection.query(
      "SELECT permisos FROM Permisos WHERE rol = (SELECT rol FROM Alumnos WHERE boleta = ? UNION SELECT rol FROM Docentes WHERE clave_empleado = ?)",
      [usuarioBoleta, usuarioBoleta]
    );

    if (!permisos.length) {
      return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
    }

    const permisosUsuario = permisos[0].permisos;

    console.log(permisosUsuario);

    // Verificar si el usuario tiene permiso '8' o 'G'
    if (!permisosUsuario.includes('8') && !permisosUsuario.includes('G')) {
      return res.status(403).json({ message: "No tienes permisos para borrar equipos" });
    }

    const { lider, nombre_equipo } = req.body;

    // Validar que los parámetros recibidos sean cadenas
    if (typeof lider !== 'string' || typeof nombre_equipo !== 'string') {
      return res.status(400).json({ message: "Los campos 'lider' y 'nombre_equipo' deben ser cadenas" });
    }

    const nombreEquipo = nombre_equipo.toUpperCase();

    // Verificar que el equipo exista
    const [equipo] = await connection.query(
      "SELECT * FROM Equipos WHERE nombre_equipo = ? AND estado = 'A'",
      [nombreEquipo]
    );

    if (!equipo.length) {
      return res.status(400).json({ message: "El equipo no existe" });
    }

    // Verificar que el usuario sea el líder del equipo si no tiene permiso 'G'
    if (!permisosUsuario.includes('G')) {
      if (equipo[0].lider !== lider) {
        return res.status(403).json({ message: "Solo el líder del equipo puede borrarlo" });
      }
    }

    const idEquipo = equipo[0].id_equipo;

    // Cambiar el estado de los alumnos y docentes asociados al equipo de 'A' a 'B'
    await connection.query(
      "UPDATE Alumnos SET id_equipo = NULL, nombre_equipo = NULL WHERE id_equipo = ?",
      [idEquipo]
    );

    await connection.query(
      "UPDATE Docentes SET id_equipo = NULL WHERE id_equipo = ?",
      [idEquipo]
    );

   // Registrar en la tabla Equipos el cambio de estado a "B" (dado de baja)
   const usuarioEliminacion = usuarioBoleta;  // Puedes usar la boleta del usuario
   const fechaEliminacion = new Date();

   await connection.query(
     "UPDATE Equipos SET estado = 'B', fecha_eliminacion = ?, usuario_eliminacion = ? WHERE id_equipo = ?",
     [fechaEliminacion, usuarioEliminacion, idEquipo]
   );

    // Registrar cambio en la tabla ABC
    await connection.query(
      `INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
       VALUES (?, ?, ?, ?)`,
      ['Equipos', idEquipo, 'Eliminación de equipo ' + nombreEquipo, usuarioBoleta]
    );

    res.status(200).json({
      message: "Equipo eliminado con éxito",
      equipo: {
        id_equipo: idEquipo,
        nombre_equipo: nombreEquipo
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  deleteTeam
};