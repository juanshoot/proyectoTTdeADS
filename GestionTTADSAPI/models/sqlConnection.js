require('dotenv').config({ path: '../.env' }); 
const mysql = require('mysql2/promise'); // se manejan funciones asincronas por eso se ocupa el promise 

console.log(process.env.DB_SERVER);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_NAME);

const connectionSettings = {
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306 , //? Cambia esto si tu MySQL usa otra ruta pero comenta la otra, no borrar
    waitForConnections: true,
    connectionLimit: 10, // Número máximo de conexiones en el pool
    queueLimit: 0 // Sin límite para la cola de conexiones
};


const getConnection = async () => {
    try {
        const pool = mysql.createPool(connectionSettings); // Se usa un pool de conexiones
        const connection = await pool.getConnection(); // Se obtiene una conexión del pool
        console.log('Conexión exitosa a la base de datos'); // Mensaje de éxito
        connection.release(); // Liberar la conexión después de usarla
        return pool; // Devuelve el pool para reutilizar
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error.message);
        throw error; // Manejo de errores de conexión
    }
};

module.exports = { getConnection };