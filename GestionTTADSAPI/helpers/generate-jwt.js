const jwt = require('jsonwebtoken');

const generarToken = (payload) => {
    return new Promise((resolve, reject) => {

        jwt.sign(payload, process.env.SECRETKEY, {
                expiresIn: '1d'
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('No se pudo generar el token.');
                } else {
                    resolve(token);
                }
            });

    })
}

const generarToken2 = (payload) => {
    return new Promise((resolve, reject) => {

        jwt.sign(payload, process.env.SECRETKEY, {
                expiresIn: '30s'
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('No se pudo generar el token.');
                } else {
                    resolve(token);
                }
            });

    })
}

module.exports = {
    generarToken,
    generarToken2
};