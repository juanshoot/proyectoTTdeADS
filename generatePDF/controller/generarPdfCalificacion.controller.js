const { request, response } = require("express");
const { getConnection } = require("../models/sqlConnection.js");
const { jsPDF } = require("jspdf");
const fs = require('fs');  // Para cargar las imágenes
const path = require('path');

const generarPDFcalificacion = async (req = request, res = response) => {
    const { id_protocolo, sinodal } = req.body;
    try {
        console.log('Recibiendo datos para generar PDF:', id_protocolo, sinodal);

        // Obtener conexión desde el pool
        const connection = await getConnection();

        if (!id_protocolo) {
            return res.status(400).json({ message: 'Falta el número de protocolo asociado' });
        }
        if (!sinodal) {
            return res.status(400).json({ message: 'No sabemos qué sinodal eres' });
        }

        // Consultas
        const queryProtocolo = `
            SELECT 
                p.titulo AS titulo_protocolo, 
                p.academia,
                d.nombre AS sinodal_nombre, 
                d.correo AS sinodal_correo
            FROM Protocolos p
            JOIN Docentes d ON (d.clave_empleado = ? AND (d.clave_empleado = p.sinodal_1 OR d.clave_empleado = p.sinodal_2 OR d.clave_empleado = p.sinodal_3))
            WHERE p.id_protocolo = ?`;

        const [rowsProtocolo] = await connection.execute(queryProtocolo, [sinodal, id_protocolo]);

        if (rowsProtocolo.length === 0) {
            return res.status(404).json({
                message: "No se encontró el protocolo o el sinodal no está asociado a este protocolo"
            });
        }

        const protocoloData = rowsProtocolo[0];

        const queryEvaluacion = `
            SELECT * 
            FROM Evaluacion 
            WHERE id_protocolo = ? AND sinodal = ?`;

        const [rowsEvaluacion] = await connection.execute(queryEvaluacion, [id_protocolo, sinodal]);

        if (rowsEvaluacion.length === 0) {
            return res.status(404).json({
                message: "No se encontraron evaluaciones con los parámetros proporcionados"
            });
        }

        const data = rowsEvaluacion[0];

        // Crear el PDF
        const doc = new jsPDF();
        doc.setFontSize(10);


         // Cargar imagen desde archivo (asegúrate de que sea PNG, JPG o JPEG)
         const imgPath = path.resolve(__dirname, 'catt.png');
         const imgData = fs.readFileSync(imgPath, { encoding: 'base64' }); // Convertir a Base64
 
         // Función para agregar encabezado con imagen
   
        // Función para agregar el encabezado en cada página
        const addHeader = () => {

            doc.addImage(`data:image/png;base64,${imgData}`, 'PNG', 10, 10, 190, 20); // Ajusta posición y tamaño
            // Línea azul clara
            doc.setDrawColor(173, 216, 230); // Azul claro
            doc.setLineWidth(2);
            doc.line(10, 35, 200, 35); // Línea de la parte superior
        };

        // Agregar encabezado inicial
        addHeader();

        // Ajustar posición inicial para que el contenido quede debajo de la línea azul
        let y = 45; // Justo debajo del encabezado
        const pageHeight = doc.internal.pageSize.height; // Altura de la página
        const margin = 20; // Margen de la hoja
        const lineHeight = 10; // Espaciado entre líneas de texto

                // Información inicial
        const titulo = `EVALUACIÓN DE PROTOCOLOS DE TRABAJO TERMINAL`;
        const fechaEvaluacion = new Date(data.fecha_evaluacion).toLocaleDateString(); // Solo día, mes y año

                // Centrando el título
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14); // Tamaño de fuente para título
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const textWidth = doc.getTextWidth(titulo); // Ancho del texto
        const titleX = (pageWidth - textWidth) / 2; // Posición X centrada
        doc.text(titulo, titleX, y); // `y` es la posición actual
        y += 10; // Ajustar espacio después del título

        // Fecha de evaluación
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Fecha de Evaluación: ${fechaEvaluacion}`, 20, y);
        y += 10; // Espacio después de la fecha



        // Resto de la información inicial
        let infoInicial = [
            `Sinodal: ${protocoloData.sinodal_nombre}`,
            `Correo del Sinodal: ${protocoloData.sinodal_correo}`,
            `Título del Protocolo: ${protocoloData.titulo_protocolo}`,
            `Academia del Protocolo: ${protocoloData.academia}`
        ];
    

        infoInicial.forEach((text) => {
            doc.text(text, 20, y);
            y += lineHeight;

            // Verificar si se necesita una nueva página
            if (y > pageHeight - margin) {
                doc.addPage();
                addHeader();
                y = 40; // Reiniciar posición justo debajo del encabezado
            }
        });

        // Preguntas y respuestas
        const questions = [
            { question: "1 ¿El título corresponde al producto esperado?", value: data.titulo_corresponde_producto },
            { question: "Observaciones", value: data.observaciones_1 },
            { question: "2 ¿El resumen expresa claramente la propuesta del TT, su importancia y aplicación? ", value: data.resumen_claro },
            { question: "Observaciones", value: data.observaciones_2 },
            { question: "3 ¿Las palabras clave han sido clasificadas adecuadamente? ", value: data.palabras_clave_adecuadas },
            { question: "Observaciones", value: data.observaciones_3 },
            { question: "4 ¿La presentación del problema a resolver es comprensible?", value: data.problema_comprensible },
            { question: "Observaciones", value: data.observaciones_4 },
            { question: "5 ¿El objetivo es preciso y relevante?", value: data.objetivo_preciso_relevante },
            { question: "Observaciones", value: data.observaciones_5 },
            { question: "6 ¿El planteamiento del problema y la tentativa solución descrita son claros?", value: data.planteamiento_claro },
            { question: "Observaciones", value: data.observaciones_6 },
            { question: "7 ¿Sus contribuciones o beneficios están completamente justificados? ", value: data.contribuciones_justificadas },
            { question: "Observaciones", value: data.observaciones_7 },
            { question: "8 ¿Su viabilidad es adecuada? ", value: data.viabilidad_adecuada },
            { question: "Observaciones", value: data.observaciones_8 },
            { question: "9 ¿La propuesta metodológica es pertinente?", value: data.propuesta_metodologica_pertinente },
            { question: "Observaciones", value: data.observaciones_9 },
            { question: "10 ¿El calendario de actividades por estudiantes es adecuado?", value: data.calendario_adecuado },
            { question: "Observaciones", value: data.observaciones_10 },
            { question: "Aprobado", value: data.aprobado },
            { question: "Recomendaciones adicionales", value: data.recomendaciones_adicionales }
        ];

        questions.forEach((item) => {
            doc.setTextColor(100, 150, 230); // Azul más oscuro pero aún claro 
            doc.text(item.question, 20, y);
            doc.setTextColor(0, 0, 0); // Negro
            doc.setFont("helvetica", "bold");
            doc.text(item.value || "N/A", 20, y + lineHeight);
            doc.setFont("helvetica", "normal");
            y += lineHeight * 2;

            // Verificar si se necesita una nueva página
            if (y > pageHeight - margin) {
                doc.addPage();
                addHeader();
                y = 40; // Reiniciar posición justo debajo del encabezado
            }
        });

        // Guardar el archivo con el nombre adecuado
        const sinodalNombre = protocoloData.sinodal_nombre.replace(/\s+/g, '_'); // Reemplazar espacios por guiones bajos
        const pdfPath = path.resolve(__dirname, `CalificacionSinodal(${sinodalNombre}).pdf`);
        doc.save(pdfPath); // Guardar el archivo en el servidor

        // Retornar la ruta del archivo generado
        return res.json({ message: "PDF generado y guardado exitosamente", filePath: pdfPath });
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error al generar el PDF" });
    }
};

module.exports = { generarPDFcalificacion };