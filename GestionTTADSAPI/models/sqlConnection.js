require('dotenv').config({ path: '../.env' }); // Ajusta la ruta si está en la raíz del proyecto
const mysql = require('mysql2/promise'); // Usamos la versión `promise` para manejar conexiones asíncronas.
console.log(process.env.DB_SERVER);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_NAME);

const connectionSettings = {
    host: process.env.DB_SERVER, // Cambia a DB_HOST si prefieres ese nombre en tu archivo .env
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306 ,// Cambia esto si MySQL usa otro puerto
    waitForConnections: true,
    connectionLimit: 10, // Número máximo de conexiones en el pool
    queueLimit: 0 // Sin límite para la cola de conexiones
};

const getConnection = async () => {
    try {
        const pool = mysql.createPool(connectionSettings); // Usamos un pool de conexiones
        return pool; // Devolvemos el pool para reutilizar conexiones
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error.message);
        throw error; // Asegúrate de manejar este error en donde llames `getConnection`
    }
};

module.exports = { getConnection };