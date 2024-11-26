const { request, response } = require("express");
const { getConnection } = require("../../../../models/sqlConnection");

const newTeam = async (req = request, res = response) => {
    let { nombre_equipo, integrantes_boletas, lider } = req.body;

    try {

        // Convertir todos los valores a string y sanitizar entrada
        nombre_equipo  = String(nombre_equipo || '').trim().toUpperCase();
        integrantes_boletas = Array.isArray(integrantes_boletas) ? integrantes_boletas.map(item => String(item).trim()) : [];
        lider = String(lider || '').trim();

        // Validación de longitud máxima de los campos
        if (nombre_equipo.length > 100) {
            return res.status(400).json({ message: 'El nombre de equipos no debe ser mayor a 150 caracteres' });
        }
        // Validar que las boletas y el líder tengan exactamente 10 dígitos
        const boletasInvalidas = integrantes_boletas.filter(boleta => boleta.length !== 10);
        if (boletasInvalidas.length > 0) {
            return res.status(400).json({
                message: `Las boletas deben tener exactamente 10 dígitos. Las siguientes boletas son inválidas: ${boletasInvalidas.join(", ")}`
            });
        }

        if (lider.length !== 10) {
            return res.status(400).json({ message: "El líder debe tener una boleta de exactamente 10 dígitos." });
        }

        // Validaciones iniciales
        if (!nombre_equipo || !integrantes_boletas || !lider) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        if (!Array.isArray(integrantes_boletas) || integrantes_boletas.length < 1 || integrantes_boletas.length > 4) {
            return res.status(400).json({ message: "El equipo debe tener entre 1 a estudiantes." });
        }

        const pool = await getConnection();

        // Verificar si el nombre del equipo ya existe
        const queryCheckTeamName = `
            SELECT id_equipo 
            FROM Equipos 
            WHERE nombre_equipo = ?;
        `;
        const [existingTeam] = await pool.execute(queryCheckTeamName, [nombre_equipo]);

        if (existingTeam.length > 0) {
            return res.status(400).json({
                message: "El nombre del equipo ya existe. Intente con otro."
            });
        }

        // Verificar si las boletas existen y si los estudiantes están disponibles
        const placeholders = integrantes_boletas.map(() => "?").join(",");
        const queryGetStudents = `
            SELECT id_usuario, boleta, id_equipo 
            FROM Usuarios 
            WHERE boleta IN (${placeholders}) AND rol = 'Estudiante';
        `;
        const [students] = await pool.execute(queryGetStudents, integrantes_boletas);

        if (students.length !== integrantes_boletas.length) {
            return res.status(400).json({ message: "Algunas boletas no existen o no corresponden a estudiantes." });
        }

        // Verificar si algún estudiante ya está en un equipo
        const alreadyInTeams = students.filter(student => student.id_equipo !== null);
        if (alreadyInTeams.length > 0) {
            const boletasInTeams = alreadyInTeams.map(student => student.boleta);
            return res.status(400).json({
                message: `El alumno con las boletas ya está en otro equipo.`,
                boletasInTeams
            });
        }

        // Verificar si el líder es uno de los integrantes usando la boleta
        const liderData = students.find(student => student.boleta === lider);
        if (!liderData) {
            return res.status(400).json({
                message: "El líder debe ser uno de los integrantes del equipo y debe ingresarse por su boleta."
            });
        }

        // Insertar el nuevo equipo en la tabla de Equipos
        const queryInsertTeam = `
            INSERT INTO Equipos (nombre_equipo, lider, titulo, sinodal, director, area) 
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        const [resultTeam] = await pool.execute(queryInsertTeam, [
            nombre_equipo,
            liderData.boleta, // Usar la boleta del líder
            "Por Asignar", // Titulo predeterminado
            "Por Asignar", // Sinodal predeterminado
            "Por Asignar", // Director predeterminado
            "Por Asignar"  // Área predeterminada
        ]);
        const id_equipo = resultTeam.insertId;

        // Actualizar a los estudiantes con el id_equipo y nombre_equipo en la tabla Usuarios
        const queryUpdateUsers = `
            UPDATE Usuarios 
            SET id_equipo = ?, nombre_equipo = ? 
            WHERE id_usuario IN (${students.map(() => "?").join(",")});
        `;
        const updateParams = [id_equipo, nombre_equipo, ...students.map(student => student.id_usuario)];
        await pool.execute(queryUpdateUsers, updateParams);

        // Respuesta exitosa
        return res.status(201).json({
            message: "Equipo creado correctamente.",
            equipo: {
                id_equipo,
                nombre_equipo,
                lider_boleta: lider
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor, intenta de nuevo más tarde." });
    }
};

module.exports = { newTeam };