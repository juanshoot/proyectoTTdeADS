const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection"); // Conexión con la base de datos MySQL
const bcrypt = require("bcryptjs"); // Usamos bcrypt para hashear contraseñas

// Función para registrar un usuario
const registerUsuario = async (req = request, res = response) => {
    const { nombre, correo, password, rol } = req.body;

    // Validaciones de entrada
    if (!nombre || !correo || !password || !rol) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Hashear la contraseña
    const saltRounds = 10; // Cuantos más saltos, más seguro (pero más lento)
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Hasheamos la contraseña

    // Verificar si el correo ya existe
    const checkEmailQuery = `
        SELECT id_usuario
        FROM Usuarios
        WHERE correo = ?`;

    try {
        const pool = await getConnection(); // Conectamos a la base de datos

        const [existingUser] = await pool.execute(checkEmailQuery, [correo]); // Verificamos si el correo ya está en la base de datos
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Insertar el nuevo usuario en la base de datos
        const insertUserQuery = `
            INSERT INTO Usuarios (nombre, correo, contrasena, rol)
            VALUES (?, ?, ?, ?)`;

        await pool.execute(insertUserQuery, [nombre, correo, hashedPassword, rol]);

        // Respuesta exitosa
        return res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor, intenta de nuevo más tarde' });
    }
};

module.exports = { registerUsuario };