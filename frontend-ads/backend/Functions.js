// Archivo: apiFunctions.js
// Descripción: Este archivo contiene todas las funciones posibles generadas a partir del archivo Postman compartido.

import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
	baseURL: 'https://tu-servidor-api.com', // Cambia esto a la URL real del backend
	headers: {
		'Content-Type': 'application/json',
	},
});

// Función para iniciar sesión
// Información necesaria:
// - credenciales: Objeto con 'correo' y 'contrasena'.
// Ejemplo:
//   {
//       "correo": "usuario@gmail.com",
//       "contrasena": "password123"
//   }
export const iniciarSesion = async (credenciales) => {
	try {
		const response = await api.post('/usuario/inicioSesion', credenciales);
		return response.data;
	} catch (error) {
		console.error('Error al iniciar sesión:', error);
		throw error;
	}
};

// Función para registrar un usuario
// Información necesaria:
// - datosUsuario: Objeto con información del usuario a registrar.
// - token: Token de autenticación.
// Ejemplo:
//   {
//       "nombre": "Juan Pérez",
//       "correo": "juan.perez@gmail.com",
//       "contrasena": "password123",
//       "rol": "ESTUDIANTE"
//   }
export const registrarUsuario = async (datosUsuario, token) => {
	try {
		const response = await api.post('/usuario/registroUsuario', datosUsuario, {
			headers: { 'log-token': token },
		});
		return response.data;
	} catch (error) {
		console.error('Error al registrar usuario:', error);
		throw error;
	}
};

// Función para consultar usuarios
// Información necesaria:
// - filtros: Objeto con filtros opcionales como 'rol', 'boleta', etc.
// - token: Token de autenticación.
// Ejemplo:
//   {
//       "rol": "ESTUDIANTE"
//   }
export const consultarUsuarios = async (filtros, token) => {
	try {
		const response = await api.post('/usuario/consultarUsuarios', filtros, {
			headers: { 'log-token': token },
		});
		return response.data;
	} catch (error) {
		console.error('Error al consultar usuarios:', error);
		throw error;
	}
};

// Función para actualizar un estudiante
// Información necesaria:
// - datosEstudiante: Objeto con información del estudiante a actualizar.
// - token: Token de autenticación.
// Ejemplo:
//   {
//       "boleta": "2025000001",
//       "nombre": "Luis Gómez",
//       "correo_actual": "luis.gomez@gmail.com",
//       "correo_nuevo": "lgomez@gmail.com",
//       "contrasena_actual": "password123",
//       "contrasena_nueva": "newpassword123"
//   }
export const actualizarEstudiante = async (datosEstudiante, token) => {
	try {
		const response = await api.post(
			'/usuario/actualizarEstudiante',
			datosEstudiante,
			{
				headers: { 'log-token': token },
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error al actualizar estudiante:', error);
		throw error;
	}
};

// Función para eliminar un usuario
// Información necesaria:
// - datosUsuario: Objeto con 'clave_empleado' o 'boleta' del usuario a eliminar.
// - token: Token de autenticación.
// Ejemplo:
//   {
//       "clave_empleado": "2025000001"
//   }
export const darDeBajaUsuario = async (datosUsuario, token) => {
	try {
		const response = await api.post('/usuario/darDeBajaUsuario', datosUsuario, {
			headers: { 'log-token': token },
		});
		return response.data;
	} catch (error) {
		console.error('Error al dar de baja usuario:', error);
		throw error;
	}
};

// Función para crear un equipo
// Información necesaria:
// - datosEquipo: Objeto con información del equipo a crear.
// - token: Token de autenticación.
// Ejemplo:
//   {
//       "nombre_equipo": "Real Madrid",
//       "titulo": "Campeones 2024",
//       "director": "0000000002",
//       "integrantes_boletas": ["2025033811", "2025000000"],
//       "lider": "2025033811"
//   }
export const crearEquipo = async (datosEquipo, token) => {
	try {
		const response = await api.post('/usuario/nuevoequipo', datosEquipo, {
			headers: { 'log-token': token },
		});
		return response.data;
	} catch (error) {
		console.error('Error al crear equipo:', error);
		throw error;
	}
};

// Función para consultar equipos
// Información necesaria:
// - filtros: Objeto con filtros opcionales como 'nombre_equipo', 'titulo', etc.
// - token: Token de autenticación.
// Ejemplo:
//   {
//       "nombre_equipo": "Real Madrid"
//   }
export const consultarEquipos = async (filtros, token) => {
	try {
		const response = await api.post('/usuario/consultarEquipos', filtros, {
			headers: { 'log-token': token },
		});
		return response.data;
	} catch (error) {
		console.error('Error al consultar equipos:', error);
		throw error;
	}
};

// Función para dar de baja un equipo
// Información necesaria:
// - datosEquipo: Objeto con 'nombre_equipo' y 'lider' del equipo a eliminar.
// - token: Token de autenticación.
// Ejemplo:
//   {
//       "lider": "2025033811",
//       "nombre_equipo": "Real Madrid"
//   }
export const darDeBajaEquipo = async (datosEquipo, token) => {
	try {
		const response = await api.post('/usuario/darDeBajaEquipo', datosEquipo, {
			headers: { 'log-token': token },
		});
		return response.data;
	} catch (error) {
		console.error('Error al dar de baja equipo:', error);
		throw error;
	}
};

// Función para actualizar un equipo
// Información necesaria:
// - datosEquipo: Objeto con información del equipo a actualizar.
// - token: Token de autenticación.
// Ejemplo:
//   {
//       "lider": "2025033811",
//       "nombre_equipo": "Real Madrid",
//       "titulo": "Campeones 2025",
//       "director": "0000000002"
//   }
export const actualizarEquipo = async (datosEquipo, token) => {
	try {
		const response = await api.post('/usuario/actualizarEquipo', datosEquipo, {
			headers: { 'log-token': token },
		});
		return response.data;
	} catch (error) {
		console.error('Error al actualizar equipo:', error);
		throw error;
	}
};

// Función para crear un protocolo
// Información necesaria:
// - datosProtocolo: Objeto con información del protocolo a crear.
// - token: Token de autenticación.
// Ejemplo:
//   {
//       "lider_equipo": "2025033811",
//       "titulo_protocolo": "Gestión de Protocolo",
//       "academia": "ISC"
//   }
export const crearProtocolo = async (datosProtocolo, token) => {
	try {
		const response = await api.post(
			'/protocolos/crearProtocolo',
			datosProtocolo,
			{
				headers: { 'log-token': token },
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error al crear protocolo:', error);
		throw error;
	}
};

// Función para consultar protocolos
// Información necesaria:
// - filtros: Objeto con filtros opcionales como 'titulo_protocolo', 'lider', etc.
// - token: Token de autenticación.
// Ejemplo:
//   {
//       "titulo_protocolo": "Gestión de Protocolo"
//   }
export const consultarProtocolos = async (filtros, token) => {
	try {
		const response = await api.post(
			'/protocolos/consultarProtocolos',
			filtros,
			{
				headers: { 'log-token': token },
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error al consultar protocolos:', error);
		throw error;
	}
};

// Función para dar de baja un protocolo
// Información necesaria:
// - datosProtocolo: Objeto con 'lider' y 'titulo_protocolo' del protocolo a eliminar.
// - token: Token de autenticación.
// Ejemplo:
//   {
//       "lider": "2025033811",
//       "titulo_protocolo": "Gestión de Protocolo"
//   }
export const darDeBajaProtocolo = async (datosProtocolo, token) => {
	try {
		const response = await api.post(
			'/protocolos/darDeBajaProtocolo',
			datosProtocolo,
			{
				headers: { 'log-token': token },
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error al dar de baja protocolo:', error);
		throw error;
	}
};

// Función para actualizar un protocolo
// Información necesaria:
// - datosProtocolo: Objeto con información del protocolo a actualizar.
// - token: Token de autenticación.
// Ejemplo:
//   {
//       "lider": "2025033811",
//       "titulo": "Actualización de Protocolo",
//       "contrasena": "newpassword123"
//   }
export const actualizarProtocolo = async (datosProtocolo, token) => {
	try {
		const response = await api.post(
			'/protocolos/actualizarProtocolo',
			datosProtocolo,
			{
				headers: { 'log-token': token },
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error al actualizar protocolo:', error);
		throw error;
	}
};
