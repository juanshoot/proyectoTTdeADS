import React, { useState } from 'react';
import axios from 'axios';

// Importar imágenes
import logo1 from '../imagenesLogos/logo-ipn-guinda.svg';
import logo2 from '../imagenesLogos/logoProyecto.png';
import logo3 from '../imagenesLogos/logoESCOM2x.png';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que se recargue la página
    try {
      // Enviar solicitud al backend
      const response = await axios.post('http://localhost:8080/api/gestionTT/usuario/loginUsuario', { correo, password });
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
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em' }}>
        <img src={logo1} alt="Logo 1" style={{ width: '90px', height: '90px' }} />
        <img src={logo2} alt="Logo 2" style={{ width: '90px', height: '90px' }} />
        <img src={logo3} alt="Logo 3" style={{ width: '90px', height: '90px' }} />
      </header>
      <h2>Inicio de Sesión</h2>
      <form onSubmit={handleLogin} style={{ display: 'inline-block', textAlign: 'left' }}>
        <label>
          Correo:
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5em',
              marginTop: '0.5em',
              border: '1px solid #ccc',
              borderRadius: '25px',
              boxSizing: 'border-box'
            }}
          />
        </label>
        <br />
        <label>
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5em',
              marginTop: '0.5em',
              border: '1px solid #ccc',
              borderRadius: '25px',
              boxSizing: 'border-box'
            }}
          />
        </label>
        <br />
        <button
          type="submit"
          style={{
            padding: '0.5em 1em',
            marginTop: '1em',
            backgroundColor: '#00bfff',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer'
          }}
        >
          Iniciar Sesión
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;