const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection");
const bcrypt = require("bcryptjs");

const updateProf = async (req = request, res = response) => {
    const { clave_empleado, nombre, correo_actual, correo_nuevo, contrasena_actual, contrasena_nueva } = req.body;
    const { rol: userRole, correo: userCorreo } = req; // Información del token de autenticación (rol y correo)

    try {
        // Validar que la clave_empleado esté presente
        if (!clave_empleado) {
            return res.status(400).json({ message: 'La clave_empleado es obligatoria para actualizar un docente.' });
        }

        // Convertir todos los valores a string y sanitizar entrada
        const claveEmpleadoStr = String(clave_empleado).trim();
        const correoNuevoStr = correo_nuevo ? String(correo_nuevo).trim() : null;
        const correoActualStr = correo_actual ? String(correo_actual).trim() : null;
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

        console.log(userRole);

        // Verificar si tiene el permiso 1 o G para actualizar
        const puedeActualizar = permisos.includes('1') || permisos.includes('G');
        console.log(permisos);
        if (!puedeActualizar) {
            return res.status(403).json({ message: 'No tienes permisos para actualizar los datos de este docente.' });
        }

        // Verificar si la clave_empleado existe
        const [docente] = await pool.execute('SELECT * FROM Docentes WHERE clave_empleado = ?', [claveEmpleadoStr]);
        if (docente.length === 0) {
            return res.status(404).json({ message: 'No se encontró un docente con esa clave_empleado.' });
        }

        const docenteData = docente[0];

        // Validar si el correo del token coincide con el correo del docente (a menos que tenga el permiso G)
        if (docenteData.correo !== userCorreo && !permisos.includes('G')) {
            return res.status(403).json({ message: 'No puedes modificar los datos de este docente porque no coincide tu correo.' });
        }

        // Validar si el correo_actual coincide con el correo del docente (para mayor seguridad)
        if (correoActualStr !== docenteData.correo && !permisos.includes('G')) {
            return res.status(403).json({ message: 'El correo actual no coincide con el registrado en el sistema.' });
        }

        // Validar contraseña actual
        const passwordMatch = await bcrypt.compare(contrasenaActualStr, docenteData.contrasena);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'La contraseña actual es incorrecta.' });
        }

        // Crear consulta dinámica para actualizar los campos
        const updateFields = [];
        const updateValues = [];
        const changes = []; // Para registrar los cambios en la tabla ABC

        if (correoNuevoStr && correoNuevoStr !== docenteData.correo) {
            updateFields.push("correo = ?");
            updateValues.push(correoNuevoStr);
            changes.push(`Correo cambiado de ${docenteData.correo} a ${correoNuevoStr}`);
        }

        if (contrasenaNuevaStr) {
            // Hashear la nueva contraseña si se proporciona
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(contrasenaNuevaStr, saltRounds);
            updateFields.push("contrasena = ?");
            updateValues.push(hashedPassword);
            changes.push(`Contraseña actualizada para la clave_empleado ${claveEmpleadoStr}`);
        }

        if (nombreStr && nombreStr !== docenteData.nombre) {
            updateFields.push("nombre = ?");
            updateValues.push(nombreStr);
            changes.push(`Nombre cambiado de ${docenteData.nombre} a ${nombreStr}`);
        }

        // Si no hay campos para actualizar, devolver un error
        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No hay campos para actualizar.' });
        }

        // Verificar si el correo o nombre ya existen en otro docente
        const checkExistenceQuery = `
            SELECT id_docente 
            FROM Docentes 
            WHERE (correo = ? OR nombre = ?) 
            AND clave_empleado != ?
        `;
        const [existingUsers] = await pool.execute(checkExistenceQuery, [
            correoNuevoStr || '', 
            nombreStr || '', 
            claveEmpleadoStr
        ]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'El correo o nombre ya están registrados en otro docente.' });
        }

        // Actualizar docente en la base de datos
        const updateQuery = `
            UPDATE Docentes 
            SET ${updateFields.join(", ")} 
            WHERE clave_empleado = ?
        `;
        updateValues.push(claveEmpleadoStr);
        await pool.execute(updateQuery, updateValues);

        // Registrar los cambios en la tabla ABC
        for (const change of changes) {
            const registerChange = `
                INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
                VALUES (?, ?, ?, ?)
            `;
            await pool.execute(registerChange, ['Docentes', docenteData.id_docente, change, nombre.toUpperCase()]);
        }

        // Respuesta exitosa
        return res.status(200).json({ message: 'Docente actualizado correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor, intenta de nuevo más tarde.' });
    }
};

module.exports = { updateProf };