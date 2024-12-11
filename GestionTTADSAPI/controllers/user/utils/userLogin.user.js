const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection"); // Conexión con la base de datos MySQL
const bcrypt = require("bcryptjs"); // Usamos bcrypt para comparar contraseñas
const { generarToken } = require("../../../helpers/generate-jwt");

const userLogin = async (req = request, res = response) => {
    const { correo, contrasena } = req.body; // Ahora solo pedimos correo y contraseña

    try {
        // Validaciones iniciales
        if (!correo) {
            return res.status(400).json({ message: 'Por favor ingresa tu correo' });
        }
        if (!contrasena) {
            return res.status(400).json({ message: 'Por favor ingresa tu contraseña' });
        }

        // Convertir datos a string para evitar errores inesperados
        const correoStr = String(correo).trim();
        const contrasenaStr = String(contrasena).trim();

        // Consulta SQL adaptada para buscar en ambas tablas: Alumnos y Docentes
        const loginUsuarioQuery = `
            SELECT id_alumno AS id_usuario, nombre, correo, contrasena, rol, 'ALUMNO' AS tipo
            FROM Alumnos
            WHERE correo = ?
            UNION
            SELECT id_docente AS id_usuario, nombre, correo, contrasena, rol, 'DOCENTE' AS tipo
            FROM Docentes
            WHERE correo = ?
        `;

        const pool = await getConnection(); // Conectamos a la base de datos
        const [result] = await pool.execute(loginUsuarioQuery, [correoStr, correoStr]); // Ejecutamos la consulta

        if (result.length < 1) {
            return res.status(400).json({ message: 'El usuario no se encontró o no está registrado. Verifica tus datos e inténtalo de nuevo' });
        }

        const usuario = result[0]; // Extraemos el primer usuario encontrado

        // Verificar si las contraseñas coinciden usando bcrypt
        const passwordMatch = await bcrypt.compare(contrasenaStr, usuario.contrasena);

        if (!passwordMatch) {
            return res.status(400).json({ message: 'La contraseña es incorrecta, verifica tus datos e inténtalo de nuevo' });
        }

        // Generar el token con permisos
        const tipoUsuario = usuario.tipo.toUpperCase();
        let permisos;

        // Asignación de permisos dependiendo del rol
        if (tipoUsuario === 'DOCENTE') {
            permisos = 'acceso_total';  // Supongamos que los docentes tienen acceso total
        } else if (tipoUsuario === 'ALUMNO') {
            permisos = 'acceso_basico'; // Los alumnos tienen acceso básico
        }

        // Generar el token
        let payload = {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol,
            tokenType: 'log-token'
        };

        console.log(payload);

        // console.log(payload);

        let token = await generarToken(payload); // Función para generar el token

        return res.status(200).json({ token});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en el servidor, intenta de nuevo más tarde' });
    }
};

module.exports = { userLogin };