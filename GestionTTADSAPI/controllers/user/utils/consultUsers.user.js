const { request, response } = require("express");
const { getConnection } = require("../../../models/sqlConnection");

const consultUsers = async (req = request, res = response) => {
    const { rol, fecha, boleta, correo } = req.body; // Usamos el cuerpo de la solicitud

    try {
        let query = `
            SELECT id_usuario, nombre, correo, rol, boleta, fecha_creacion
            FROM Usuarios
            WHERE 1=1
        `;
        const queryParams = [];

        // 1) Filtrar por rol y fecha
        if (rol || fecha) {
            // Validación del rol
            const rolesPermitidos = ['ESTUDIANTE', 'SINODAL', 'CATT', 'DIRECTOR'];
            if (rol && !rolesPermitidos.includes(rol.toUpperCase())) {
                return res.status(400).json({
                    message: `El rol ingresado es inválido. Solo se aceptan los roles: 'Estudiante', 'Sinodal', 'CATT', 'Director'`
                });
            }

            if (rol) {
                query += " AND rol = ?";
                queryParams.push(rol.toUpperCase());
            }

            // Validación de la fecha
            if (fecha) {
                if (!/^\d{2}\/\d{2}$/.test(fecha)) {
                    return res.status(400).json({
                        message: "La fecha debe tener el formato MM/AA (Ejemplo: 23/02 para febrero de 2023)"
                    });
                }

                const [anio, mes] = fecha.split('/').map(Number);
                let anioBase = 2000 + anio; // Convertir el año a 4 dígitos
                let anioBase2 = anioBase - 1;
                let fechaInicio = null;
                let fechaFin = null;

                // Si el mes es 02 (enero-julio), el semestre es de enero a julio
                if (mes === 2) {
                    fechaInicio = `${anioBase}-01-01 00:00:00`; // Enero 1 del mismo año
                    fechaFin = `${anioBase}-06-31 23:59:59`; // Julio 31 del mismo año
                } 
                // Si el mes es 01 (junio-diciembre), el semestre es de junio a diciembre
                else if (mes === 1) {
                    anioBase += 1; // Incrementamos el año en 1 para el semestre de junio-diciembre
                    fechaInicio = `${anioBase2}-07-01 00:00:00`; // Junio 1 del siguiente año
                    fechaFin = `${anioBase2}-12-31 23:59:59`; // Diciembre 31 del siguiente año
                } else {
                    return res.status(400).json({
                        message: "El mes ingresado debe ser 01 (junio-diciembre) o 02 (enero-julio)"
                    });
                }

                query += " AND fecha_creacion BETWEEN ? AND ?";
                queryParams.push(fechaInicio, fechaFin);
            }
        }

        // 2) Filtrar por boleta
        if (boleta) {
            if (boleta.length !== 10 || isNaN(boleta)) {
                return res.status(400).json({
                    message: "La boleta debe ser un número de 10 dígitos"
                });
            }

            query += " AND boleta = ?";
            queryParams.push(boleta);
        }

        // 3) Filtrar por correo
        if (correo) {
            if (correo.length > 100) {
                return res.status(400).json({
                    message: "El correo no debe ser mayor a 100 caracteres"
                });
            }

            query += " AND correo = ?";
            queryParams.push(correo);
        }

        // Ejecutar la consulta
        const pool = await getConnection();
        const [result] = await pool.execute(query, queryParams);

        // Verificar si el resultado está vacío
        if (result.length === 0) {
            return res.status(404).json({
                message: "No se encuentra este usuario, verifique sus datos o busque otro método"
            });
        }

        // Convertir fecha_creacion a formato DD/MM/YYYY
        const usuarios = result.map(user => {
            const fecha = new Date(user.fecha_creacion);
            const fechaFormateada = `${("0" + fecha.getDate()).slice(-2)}/${("0" + (fecha.getMonth() + 1)).slice(-2)}/${fecha.getFullYear()}`;
            return { ...user, fecha_creacion: fechaFormateada };
        });

        // Responder con los usuarios
        return res.status(200).json({ usuarios });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor, intenta de nuevo más tarde' });
    }
};

module.exports = { consultUsers };