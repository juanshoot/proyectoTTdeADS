const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection"); // Conexión con la base de datos MySQL
const bcrypt = require("bcryptjs"); // Usamos bcrypt para hashear contraseñas

// Función para registrar un usuario
const createUser = async (req = request, res = response) => {
    const { correo, clave, boleta, rol, nombre } = req.body;

    try {
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

    // Validación de roles permitidos
    const rolesPermitidos = ['ESTUDIANTE', 'SINODAL', 'CATT', 'DIRECTOR'];
    if (!rolesPermitidos.includes(rolStr)) {
        return res.status(400).json({ 
            message: `El rol ingresado es inválido. Solo se aceptan los roles: 'Estudiante', 'Sinodal', 'CATT', 'Director'`
        });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(claveStr, saltRounds);

    // Verificar si el correo o la boleta o nombre ya existen
    const checkExistenceQuery = `
        SELECT id_usuario
        FROM Usuarios
        WHERE  nombre = ? OR correo = ? OR boleta = ? `;


        const pool = await getConnection(); // Conectamos a la base de datos

        const [existingUser] = await pool.execute(checkExistenceQuery, [nombreStr, correoStr, boletaStr]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El correo, nombre o la boleta ya están registrados' });
        }

        // Insertar el nuevo usuario en la base de datos
        const insertUserQuery = `
            INSERT INTO Usuarios (nombre, correo, contrasena, boleta, rol)
            VALUES (?, ?, ?, ?, ?)`;

        await pool.execute(insertUserQuery, [nombreStr.toUpperCase(), correoStr, hashedPassword, boletaStr, rolStr.toUpperCase()]);

        // Respuesta exitosa
        return res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor, intenta de nuevo más tarde' });
    }
};

module.exports = { createUser };