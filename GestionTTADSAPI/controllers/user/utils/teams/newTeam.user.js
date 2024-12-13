const { request, response } = require("express");
const { getConnection } = require("../../../../models/sqlConnection");
const jwt = require("jsonwebtoken");

const newTeam = async (req = request, res = response) => {
  const connection = await getConnection();
  const token = req.header("log-token");

  if (!token) {
    return res.status(401).json({ message: "Porfavor Inicie Sesion" });
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

    // Verificar si tiene permisos de crear equipos
    if (!permisosUsuario.includes('6') && !permisosUsuario.includes('G')) {
      return res.status(403).json({ message: "No tienes permisos para crear equipos" });
    }

    const { nombre_equipo, titulo, director, director_2 = "NO TIENE", academia, integrantes_boletas, lider } = req.body;

    // Validaciones de mayúsculas y tipo de datos
    if (typeof nombre_equipo !== 'string' || typeof titulo !== 'string' || typeof academia !== 'string') {
      return res.status(400).json({ message: "Los campos nombre_equipo, titulo y academia deben ser strings" });
    }

    const nombreEquipo = nombre_equipo.toUpperCase();
    const tituloEquipo = titulo.toUpperCase();
    const academiaEquipo = academia.toUpperCase();

    // Verificar que la academia exista
    const [academiaExistente] = await connection.query(
      "SELECT * FROM Academia WHERE academia = ?",
      [academiaEquipo]
    );

    if (!academiaExistente.length) {
      return res.status(400).json({ message: "La academia ingresada no existe" });
    }

    // Verificar que los estudiantes existan y no pertenezcan a otro equipo
    const placeholders = integrantes_boletas.map(() => '?').join(',');
    const [alumnos] = await connection.query(
      `SELECT boleta, estado, id_equipo FROM Alumnos WHERE boleta IN (${placeholders})`,
      integrantes_boletas
    );

    if (alumnos.length !== integrantes_boletas.length) {
      return res.status(400).json({ message: "Algunos estudiantes no existen" });
    }

    const alumnosNoActivos = alumnos.filter(alumno => alumno.estado !== 'A');
    if (alumnosNoActivos.length > 0) {
      return res.status(400).json({ message: "Algunos estudiantes no están dados de alta" });
    }

    const alumnosConEquipo = alumnos.filter(alumno => alumno.id_equipo !== null);
    if (alumnosConEquipo.length > 0) {
      return res.status(400).json({ message: "Algunos estudiantes ya están en un equipo" });
    }

    // Verificar directores y roles
    const [directores] = await connection.query(
      "SELECT clave_empleado, rol FROM Docentes WHERE clave_empleado IN (?, ?)",
      [director, director_2]
    );

    if (!directores.length) {
      return res.status(400).json({ message: "El director o director_2 no existen" });
    }

    for (const director of directores) {
      if (director.rol === 'ESTUDIANTE') {
        return res.status(400).json({ message: "Un director no puede tener rol de estudiante" });
      }

      // Verificar que el director no esté en más de 5 equipos
      const [equiposDirector] = await connection.query(
        "SELECT COUNT(*) AS total FROM Equipos WHERE director = ? OR director_2 = ?",
        [director.clave_empleado, director.clave_empleado]
      );

      if (equiposDirector[0].total >= 5) {
        return res.status(400).json({ message: "El director ya está asignado a 5 equipos" });
      }
    }

    // Verificar que si tiene permiso '6', el usuario debe ser estudiante y estar en el equipo
    if (permisosUsuario.includes('6')) {
      // Verificar si el usuario es estudiante
      const [usuario] = await connection.query(
        "SELECT rol FROM Alumnos WHERE boleta = ?",
        [usuarioBoleta]
      );

      if (usuario.length === 0 || usuario[0].rol !== 'ESTUDIANTE') {
        return res.status(403).json({ message: "Solo los estudiantes pueden crear equipos con permiso '6'" });
      }

      // Verificar que el usuario esté en el equipo o sea el líder
      const esIntegrante = integrantes_boletas.includes(usuarioBoleta) || lider === usuarioBoleta;
      if (!esIntegrante) {
        return res.status(403).json({ message: "No puedes crear un equipo si no eres parte de él" });
      }
    }

    // Si el usuario tiene permiso 'G', no importa si es parte del equipo
    if (permisosUsuario.includes('G')) {
      console.log("Permiso 'G' detectado, permitiendo creación de equipo sin restricción de pertenencia.");
    }

    // Insertar equipo en la base de datos
    const [resultadoEquipo] = await connection.query(
      `INSERT INTO Equipos (lider, nombre_equipo, titulo, director, director_2, academia) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [lider, nombreEquipo, tituloEquipo, director, director_2, academiaEquipo]
    );
    
    const idEquipo = resultadoEquipo.insertId;
    
    // Asociar el id_equipo al director y director_2 (si tienen)
    await connection.query(
      "UPDATE Docentes SET id_equipo = ? WHERE clave_empleado IN (?, ?)",
      [idEquipo, director, director_2]
    );
    
    // Asociar a los estudiantes al equipo
    for (const boleta of integrantes_boletas) {
      await connection.query(
        "UPDATE Alumnos SET id_equipo = ?, nombre_equipo = ? WHERE boleta = ?",
        [idEquipo, nombreEquipo, boleta]
      );
    }
    
    // Registrar cambio en la tabla ABC
    await connection.query(
      `INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
       VALUES (?, ?, ?, ?)`,
      ['Equipos', idEquipo, 'Creación de equipo ' + nombreEquipo, usuarioBoleta]
    );

    res.status(201).json({
      message: "Equipo creado con éxito",
      equipo: {
        id_equipo: idEquipo,
        nombre_equipo: nombreEquipo,
        titulo: tituloEquipo,
        director,
        director_2,
        academia: academiaEquipo,
        integrantes: integrantes_boletas
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
  newTeam
};