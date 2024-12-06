const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection"); // Conexión con la base de datos MySQL
const bcrypt = require("bcryptjs"); // Usamos bcrypt para hashear contraseñas

// Función para registrar un usuario
const createUser = async (req = request, res = response) => {
    const { correo, clave, boleta, rol, nombre } = req.body;
    const { rol: userRole, nombre: userName } = req; // El rol del usuario que hace la petición, que viene del token

    try {
        // Verificar si el usuario tiene permiso "9" para crear usuarios
        const pool = await getConnection();
        const [permissions] = await pool.execute('SELECT permisos FROM Permisos WHERE rol = ?', [userRole]);

        if (permissions.length === 0 || !permissions[0].permisos.includes("9")) {
            // Si no tiene permiso, se registra el intento fallido
            const registerFailedChange = `
                INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
                VALUES (?, ?, ?, ?)
            `;
            const changeDescription = `Intento fallido de creación de usuario por falta de permisos`;
            await pool.execute(registerFailedChange, ['Usuarios', 0, changeDescription, userName]);

            return res.status(403).json({ message: 'No tienes permisos suficientes para realizar esta acción.' });
        }

        // Convertir todos los valores a string y sanitizar entrada
        const correoStr = String(correo || '').trim();
        const claveStr = String(clave || '').trim();
        const boletaStr = String(boleta || '').trim();
        const rolStr = String(rol || '').trim().toUpperCase();
        const nombreStr = String(nombre || '').trim().toUpperCase(); 

        // Validaciones de campos requeridos
        if (!correoStr || !claveStr || !boletaStr || !rolStr || !nombreStr) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Validación de longitud máxima de los campos
        if (correoStr.length > 100) {
            return res.status(400).json({ message: 'El correo no debe ser mayor a 100 caracteres' });
        }

        if (nombreStr.length > 100) {
            return res.status(400).json({ message: 'El nombre no debe ser mayor a 100 caracteres' });
        }

        if (claveStr.length > 255) {
            return res.status(400).json({ message: 'La contraseña no debe ser mayor a 255 caracteres' });
        }

        if (rolStr.length > 15) {
            return res.status(400).json({ message: 'El rol no debe ser mayor a 15 caracteres' });
        }

        // Validación de boleta
        if (boletaStr.length !== 10 || isNaN(boletaStr)) {
            return res.status(400).json({ message: 'La boleta debe ser un número de 10 dígitos' });
        }

        // Validación de roles permitidos en la tabla Roles
        const [roles] = await pool.execute('SELECT * FROM Roles WHERE rol = ?', [rolStr]);

        if (roles.length === 0) {
            return res.status(400).json({ 
                message: `El rol ingresado no existe en la tabla Roles. Asegúrese de usar un rol válido como 'ESTUDIANTE', 'SINODAL', 'CATT', 'DIRECTOR'`
            });
        }

        // Hashear la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(claveStr, saltRounds);

        // Verificar si el correo o la boleta o nombre ya existen
        const checkExistenceQuery = `
            SELECT id_usuario
            FROM Usuarios
            WHERE nombre = ? OR correo = ? OR boleta = ? 
        `;

        const [existingUser] = await pool.execute(checkExistenceQuery, [nombreStr, correoStr, boletaStr]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El correo, nombre o la boleta ya están registrados' });
        }

        // Insertar el nuevo usuario en la base de datos
        const insertUserQuery = `
            INSERT INTO Usuarios (nombre, correo, contrasena, boleta, rol)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(insertUserQuery, [nombreStr, correoStr, hashedPassword, boletaStr, rolStr]);

        // Obtener el ID del usuario recién insertado
        const newUserId = result.insertId;

        // Registrar el cambio en la tabla ABC
        const registerChange = `
            INSERT INTO ABC (tabla_afectada, id_registro, cambio_realizado, usuario) 
            VALUES (?, ?, ?, ?)
        `;
        const changeDescription = `Usuario creado: ${nombreStr} con boleta: ${boletaStr}`;
        await pool.execute(registerChange, ['Usuarios', newUserId, changeDescription, userName]);

        // Respuesta exitosa
        return res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor, intenta de nuevo más tarde' });
    }
};

module.exports = { createUser };