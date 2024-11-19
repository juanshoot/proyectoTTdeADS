import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); // Evita que se recargue la página

        try {
            // Enviar solicitud al backend
            const response = await axios.post('http://localhost:8080/api/gestionTT/usuario/loginUsuario', {
                correo,
                password
            });

            // Verificar el token en la respuesta
            console.log(response.data.token);

            // Guardar el token en el almacenamiento local
            localStorage.setItem('token', response.data.token);

            setMessage('Inicio de sesión exitoso');
        } catch (error) {
            // Manejar errores
            const errorMsg = error.response?.data?.message || 'Error en el servidor';
            setMessage(errorMsg);
        }
    };

    return (
        <div>
            <h2>Inicio de Sesión</h2>
            <form onSubmit={handleLogin}>
                <label>
                    Correo:
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5em', marginTop: '0.5em' }}
                    />
                </label>
                <label>
                    Contraseña:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5em', marginTop: '0.5em' }}
                    />
                </label>
                <button type="submit">Iniciar Sesión</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;