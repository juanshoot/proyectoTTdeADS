const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection");
const bcrypt = require("bcryptjs");

const updateStudent = async (req = request, res = response) => {
    const { nombre, correo_nuevo, boleta, contrasena_actual, contrasena_nueva } = req.body;
    const { rol: userRole, correo: userCorreo } = req; // Información del token de autenticación (rol y correo)

    try {
        // Validar que la boleta esté presente
        if (!boleta) {
            return res.status(400).json({ message: 'La boleta es obligatoria para actualizar un alumno.' });
        }

        // Convertir todos los valores a string y sanitizar entrada
        const boletaStr = String(boleta).trim();
        const correoNuevoStr = correo_nuevo ? String(correo_nuevo).trim() : null;
        const contrasenaActualStr = contrasena_actual ? String(contrasena_actual).trim() : null;
        const contrasenaNuevaStr = contrasena_nueva ? String(contrasena_nueva).trim() : null;
        const nombreStr = nombre ? String(nombre).trim().toUpperCase() : null;

        // Verificar si el usuario tiene los permisos para actualizar
        const pool = await getConnection();
        const [rolePermissions] = await pool.execute('SELECT permisos FROM Permisos WHERE rol = ?', [userRole]);

        if (rolePermissions.length === 0) {
            return res.status(403).json({ message: 'No tienes permisos suficientes para realizar esta acción.' });
        }

        const permisos = rolePermissions[0].permisos;

        // Verificar si tiene el permiso 0 o G para actualizar
        const puedeActualizar = permisos.includes('0') || permisos.includes('G');
        if (!puedeActualizar) {
            return res.status(403).json({ message: 'No tienes permisos para actualizar los datos de este alumno.' });
        }

        // Verificar si la boleta existe
        const [alumno] = await pool.execute('SELECT * FROM Alumnos WHERE boleta = ?', [boletaStr]);
        if (alumno.length === 0) {
            return res.status(404).json({ message: 'No se encontró un alumno con esa boleta.' });
        }

        const alumnoData = alumno[0];

        // Validar si el correo del token coincide con el correo del alumno (a menos que tenga el permiso G)
        if (alumnoData.correo !== userCorreo && !permisos.includes('G')) {
            return res.status(403).json({ message: 'No puedes modificar los datos de este alumno porque no coincide tu correo.' });
        }

        // Validar contraseña actual
        const passwordMatch = await bcrypt.compare(contrasenaActualStr, alumnoData.contrasena);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'La contraseña actual es incorrecta.' });
        }

         // Crear consulta dinámica para actualizar los campos
         const updateFields = [];
         const updateValues = [];
         const changes = []; // Para registrar los cambios en ABC

         if (correoNuevoStr && correoNuevoStr !== alumnoData.correo) {
            updateFields.push("correo = ?");
            updateValues.push(correoNuevoStr);
            changes.push(`Correo cambiado de ${alumnoData.correo} a ${correoNuevoStr}`);
        }

        if (contrasenaNuevaStr) {
            // Hashear la nueva contraseña si se proporciona
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(contrasenaNuevaStr, saltRounds);
            updateFields.push("contrasena = ?");
            updateValues.push(hashedPassword);
            changes.push(`Contraseña actualizada para la boleta ${boletaStr}`);
        }

        if (nombreStr && nombreStr !== alumnoData.nombre) {
            updateFields.push("nombre = ?");
            updateValues.push(nombreStr);
            changes.push(`Nombre cambiado de ${alumnoData.nombre} a ${nombreStr}`);
        }


        // Si no hay campos para actualizar, devolver un error
        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No hay campos para actualizar.' });
        }

        // Verificar si el correo o nombre ya existen en otro usuario
        const checkExistenceQuery = `
            SELECT id_alumno 
            FROM Alumnos 
            WHERE (correo = ? OR nombre = ?) 
            AND boleta != ?
        `;
        const [existingUsers] = await pool.execute(checkExistenceQuery, [
            correoNuevoStr || '', 
            nombreStr || '', 
            boletaStr
        ]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'El correo o nombre ya están registrados en otro alumno.' });
        }


       // Actualizar alumno en la base de datos
       const updateQuery = `
       UPDATE Alumnos 
       SET ${updateFields.join(", ")} 
       WHERE boleta = ?
   `;
   updateValues.push(boletaStr);
   await pool.execute(updateQuery, updateValues);

   // Registrar los cambios en la tabla ABC
   for (const change of changes) {
       const registerChange = `
           INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
           VALUES (?, ?, ?, ?)
       `;
       await pool.execute(registerChange, ['Alumnos', alumnoData.id_alumno, change, nombre.toUpperCase()]);
   }
        // Respuesta exitosa
        return res.status(200).json({ message: 'Alumno actualizado correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor, intenta de nuevo más tarde.' });
    }
};

module.exports = { updateStudent };