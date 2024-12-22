const axios = require('axios');

const generarPdfCalificacion = async (id_protocolo, sinodal) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Realizar la petición POST al servidor
            const pdfGenerated = await axios.post('http://localhost:3000/generarPDFcalificacion', {
                id_protocolo, 
                sinodal      
            });

            resolve(pdfGenerated.data);  // Respuesta del PDF generado
        } catch (err) {
            console.log(err);
            reject({ msg: err });  // Si ocurre un error, se rechaza con el mensaje
        }
    });
};

module.exports = { generarPdfCalificacion };