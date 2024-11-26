const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection");
const bcrypt = require("bcryptjs");

const updateUser = async (req = request, res = response) => {
    const { boleta, correo, clave, rol, nombre } = req.body;

    try {
        // Validar que la boleta esté presente
        if (!boleta) {
            return res.status(400).json({ message: 'La boleta es obligatoria para actualizar un usuario.' });
        }

        // Convertir todos los valores a string y sanitizar entrada
        const boletaStr = String(boleta).trim();
        const correoStr = correo ? String(correo).trim() : null;
        const claveStr = clave ? String(clave).trim() : null;
        const rolStr = rol ? String(rol).trim().toUpperCase() : null;
        const nombreStr = nombre ? String(nombre).trim().toUpperCase() : null;

        // Validar longitud de la boleta
        if (boletaStr.length !== 10 || isNaN(boletaStr)) {
            return res.status(400).json({ message: 'La boleta debe ser un número de 10 dígitos.' });
        }

        // Validar longitud de los campos si están presentes
        if (correoStr && correoStr.length > 100) {
            return res.status(400).json({ message: 'El correo no debe ser mayor a 100 caracteres.' });
        }
        if (nombreStr && nombreStr.length > 100) {
            return res.status(400).json({ message: 'El nombre no debe ser mayor a 100 caracteres.' });
        }
        if (claveStr && claveStr.length > 255) {
            return res.status(400).json({ message: 'La contraseña no debe ser mayor a 255 caracteres.' });
        }
        if (rolStr && rolStr.length > 15) {
            return res.status(400).json({ message: 'El rol no debe ser mayor a 15 caracteres.' });
        }

        // Validar que el rol sea permitido
        if (rolStr) {
            const rolesPermitidos = ['ESTUDIANTE', 'SINODAL', 'CATT', 'DIRECTOR'];
            if (!rolesPermitidos.includes(rolStr)) {
                return res.status(400).json({
                    message: `El rol ingresado es inválido. Solo se aceptan los roles: 'Estudiante', 'Sinodal', 'CATT', 'Director'.`
                });
            }
        }

        // Crear consulta dinámica para actualizar los campos
        const updateFields = [];
        const updateValues = [];

        if (correoStr) {
            updateFields.push("correo = ?");
            updateValues.push(correoStr);
        }
        if (claveStr) {
            // Hashear la nueva contraseña si se proporciona
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(claveStr, saltRounds);
            updateFields.push("contrasena = ?");
            updateValues.push(hashedPassword);
        }
        if (rolStr) {
            updateFields.push("rol = ?");
            updateValues.push(rolStr);
        }
        if (nombreStr) {
            updateFields.push("nombre = ?");
            updateValues.push(nombreStr);
        }

        // Si no hay campos para actualizar, devolver un error
        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No hay campos para actualizar.' });
        }

        // Verificar si la boleta existe
        const pool = await getConnection();
        const checkBoletaQuery = `SELECT id_usuario FROM Usuarios WHERE boleta = ?;`;
        const [user] = await pool.execute(checkBoletaQuery, [boletaStr]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'No se encontró un usuario con esa boleta.' });
        }

        // Verificar si el correo, nombre o rol ya existen en otro usuario
        const checkExistenceQuery = `
            SELECT id_usuario 
            FROM Usuarios 
            WHERE (correo = ? OR nombre = ?) AND boleta != ?;
        `;
        const [existingUsers] = await pool.execute(checkExistenceQuery, [
            correoStr || '', 
            nombreStr || '', 
            boletaStr
        ]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'El correo o nombre ya están registrados en otro usuario.' });
        }

        // Actualizar usuario en la base de datos
        const updateQuery = `
            UPDATE Usuarios 
            SET ${updateFields.join(", ")} 
            WHERE boleta = ?;
        `;
        updateValues.push(boletaStr);
        await pool.execute(updateQuery, updateValues);

        // Respuesta exitosa
        return res.status(200).json({ message: 'Usuario actualizado correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor, intenta de nuevo más tarde.' });
    }
};

module.exports = { updateUser };