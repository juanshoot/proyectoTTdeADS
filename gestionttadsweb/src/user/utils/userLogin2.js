import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/gestionTT/usuario/loginUsuario', // Cambia esto si el backend tiene otra URL base
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;