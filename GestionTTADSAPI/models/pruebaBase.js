const { getConnection } = require('../models/sqlConnection.js');

const testQuery = async () => {
    try {
        const pool = await getConnection();
        const [rows] = await pool.query('SELECT * FROM Usuarios'); // Cambia la consulta según tus necesidades
        console.log(rows);
    } catch (error) {
        console.error('Error ejecutando la consulta:', error.message);
    }
};

testQuery();