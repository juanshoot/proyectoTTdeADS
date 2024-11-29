// const jwt = require('jsonwebtoken');
// const { request, response } = require("express");

// const validateAuth = (req = request, res = response, next) => {
 
//     const token = req.header('auth-token');

//     if (!token) {
//         return res.status(403).json({ message: 'Porfavor verifica tu autenticacion' });
//     }

//     try {
//         const payload = jwt.verify(token, process.env.SECRETKEY, { maxAge: '30s' });
//         if (payload.tokenType !== 'auth-token') {
//             return res.status(403).json({ message: 'Hubo un problema al procesar tus permisos, intentelo de nuevo' });
//         }

//         console.log(payload.rol);
//         console.log(req.rol);

//         if(!req.rol){
//             return res.status(403).json({ message: 'Ha ocurrido un problema, vuelve a iniciar sesion' });
//         }else if(req.rol != payload.rol){
//             return res.status(403).json({ message: 'Tus credenciales no coinciden. Verifica tu informacion o vuleve a iniciar sesion' });
//         }else{
//             req.nivel = payload.nivel;
//         }

        
        
//         next();
//         } catch (err) {

//         return res.status(403).json({ message: 'Ha expirado tu permiso,vuelve a intentarlo.' });
//     }
// };

// module.exports = { validateAuth };
