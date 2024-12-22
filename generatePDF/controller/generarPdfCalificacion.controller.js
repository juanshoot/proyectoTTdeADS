const { request, response } = require("express");
const { getConnection } = require("../models/sqlConnection.js");
const { jsPDF } = require("jspdf");
const fs = require('fs');  // Para cargar las imágenes si es necesario

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

        // Consulta para obtener los detalles del protocolo
        const queryProtocolo = 
            `SELECT 
                p.titulo AS titulo_protocolo, 
                p.academia,
                d.nombre AS sinodal_nombre, 
                d.correo AS sinodal_correo
            FROM Protocolos p
            JOIN Docentes d ON (d.clave_empleado = ? AND (d.clave_empleado = p.sinodal_1 OR d.clave_empleado = p.sinodal_2 OR d.clave_empleado = p.sinodal_3))
            WHERE p.id_protocolo = ?`
            
        ;
    
        const [rowsProtocolo] = await connection.execute(queryProtocolo, [sinodal, id_protocolo]);

        // Verificar si se encontró el protocolo
        if (rowsProtocolo.length === 0) {
            return res.status(404).json({
                message: "No se encontró el protocolo o el sinodal no está asociado a este protocolo"
            });
        }

        const protocoloData = rowsProtocolo[0];

        // Consulta para obtener los detalles de la evaluación
        const queryEvaluacion = 
            `SELECT * 
            FROM Evaluacion 
            WHERE id_protocolo = ? AND sinodal = ? `
        ;
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

        // Título y detalles generales
        doc.text("Evaluación de Protocolos de Trabajo Terminal", 20, 20);
        doc.text(`Fecha de Evaluación: ${new Date(data.fecha_evaluacion).toLocaleString()}`, 20, 30);
        doc.text(`Sinodal: ${protocoloData.sinodal_nombre}`, 20, 40);
        doc.text(`Correo del Sinodal: ${protocoloData.sinodal_correo}`, 20, 50);
        doc.text(`Título del Protocolo:" ${protocoloData.titulo_protocolo}`, 20, 60);
        doc.text(`Academia del Protocolo: ${protocoloData.academia}`, 20, 70);

          // Función para agregar el encabezado en cada página
          const addHeader = () => {
            // Línea azul clara
            doc.setDrawColor(173, 216, 230); // Azul claro
            doc.setLineWidth(2);
            doc.line(10, 35, 200, 35); // Línea de la parte superior
        };

        // Agregar encabezado en la primera página
        addHeader();

        let y = 80; // Comienza desde aquí el contenido de las preguntas
        const pageHeight = doc.internal.pageSize.height; // Altura de la página
        const margin = 20; // Margen de la hoja
        const lineHeight = 10; // Espaciado entre líneas de texto

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

        // Loop a través de las preguntas y respuestas
        questions.forEach((item, index) => {
            // Pregunta en azul
            doc.setTextColor(0, 0, 255); // Azul
            doc.text(item.question, 20, y);
            doc.setTextColor(0, 0, 0); // Volver al negro

            // Añadir el valor en negritas
            doc.setFont("helvetica", "bold");
            doc.text(item.value || "N/A", 20, y + lineHeight);
            doc.setFont("helvetica", "normal");

            y += lineHeight * 2; // Incrementar la posición Y para la siguiente línea

          // Si el contenido se pasa de la altura de la página, agregamos una nueva página
            if (y > pageHeight - margin) {
                doc.addPage();
                y = margin; // Resetear la posición Y al inicio de la nueva página

                // Repetir el encabezado en la nueva página
                addHeader();
            }
        });

        // Generar el PDF en formato Base64
        const pdfBase64 = doc.output("datauristring");

        // Enviar el PDF como respuesta en Base64
        return res.json({
            pdf: pdfBase64
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error al generar el PDF" });
    }
};

module.exports = {
    generarPDFcalificacion,
};