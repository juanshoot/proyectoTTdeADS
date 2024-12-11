const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection");

const deleteUser = async (req = request, res = response) => {
    const { boleta, clave_empleado } = req.body; // Se puede usar boleta o clave_empleado
    const { rol: userRole, correo: userCorreo } = req; // Se extrae el rol y el correo desde el token del usuario autenticado

    try {
        // Validar que se envíe boleta o clave_empleado
        if (!boleta && !clave_empleado) {
            return res.status(400).json({ message: "Se debe proporcionar la boleta o la clave de empleado para dar de baja a un usuario." });
        }

        // Convertir a string y sanitizar la entrada
        const boletaStr = boleta ? String(boleta).trim() : null;
        const claveEmpleadoStr = clave_empleado ? String(clave_empleado).trim() : null;

        // Validar que la boleta tenga exactamente 10 dígitos si se proporciona
        if (boletaStr && (boletaStr.length !== 10 || isNaN(boletaStr))) {
            return res.status(400).json({ message: "La boleta debe ser un número de 10 dígitos." });
        }

        const pool = await getConnection();

        // Obtener los permisos del rol del usuario que está haciendo la solicitud
        const [rolePermissions] = await pool.execute('SELECT permisos FROM Permisos WHERE rol = ?', [userRole]);

        if (rolePermissions.length === 0) {
            return res.status(403).json({ message: 'No tienes permisos suficientes para realizar esta acción.' });
        }

        const permisos = rolePermissions[0].permisos;

        // Verificar si tiene permiso para dar de baja (2, 3 o G)
        const puedeDarseDeBaja = permisos.includes('2') || permisos.includes('3');
        const puedeDarDeBajaATodos = permisos.includes('G');

        let targetTable = "";
        let userData = null;

        // Consultar si el usuario a dar de baja es un alumno o un docente
        if (boletaStr) {
            targetTable = "Alumnos";
            const [result] = await pool.execute('SELECT * FROM Alumnos WHERE boleta = ?', [boletaStr]);
            if (result.length === 0) {
                return res.status(404).json({ message: 'No se encontró un alumno con esa boleta.' });
            }
            userData = result[0];
        } else if (claveEmpleadoStr) {
            targetTable = "Docentes";
            const [result] = await pool.execute('SELECT * FROM Docentes WHERE clave_empleado = ?', [claveEmpleadoStr]);
            if (result.length === 0) {
                return res.status(404).json({ message: 'No se encontró un docente con esa clave de empleado.' });
            }
            userData = result[0];
        }

        if (!userData) {
            return res.status(404).json({ message: 'No se encontró el usuario con la información proporcionada.' });
        }

        // Validar si el usuario puede darse de baja a sí mismo o a otros
        if (userData.correo !== userCorreo && !puedeDarDeBajaATodos) {
            return res.status(403).json({ message: 'No puedes dar de baja a otros usuarios.' });
        }

        if (!puedeDarseDeBaja && !puedeDarDeBajaATodos) {
            return res.status(403).json({ message: 'No tienes permisos para dar de baja a este usuario.' });
        }

        // Cambiar el estado de 'A' a 'B'
        const updateStatusQuery = `
            UPDATE ${targetTable}
            SET estado = 'B'
            WHERE ${boletaStr ? 'boleta' : 'clave_empleado'} = ?
        `;
        await pool.execute(updateStatusQuery, [boletaStr || claveEmpleadoStr]);

        // Registrar el cambio en la tabla ABC
        const changeDescription = `Estado cambiado a 'B' para el usuario con ${boletaStr ? 'boleta' : 'clave_empleado'}: ${boletaStr || claveEmpleadoStr}`;
        const registerChange = `
            INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
            VALUES (?, ?, ?, ?)
        `;
        await pool.execute(registerChange, [targetTable, userData.id_alumno || userData.id_docente, changeDescription, userCorreo]);

        // Respuesta exitosa
        return res.status(200).json({ message: 'Usuario dado de baja correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor, intenta de nuevo más tarde.' });
    }
};

module.exports = { deleteUser };