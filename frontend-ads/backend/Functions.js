const axios = require('axios');

// Base URL for the backend API
const BASE_URL = '{{GestionTT}}';

/**
 * Handles user login
 * @param {Object} loginData - Contains email and password
 * @returns {Promise<Object>} - Token and user data
 */
const loginUser = async (loginData) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/usuario/inicioSesion`,
			loginData
		);
		return response.data;
	} catch (error) {
		console.error('Error logging in:', error);
		throw error;
	}
};

/**
 * Registers a new user
 * @param {Object} userData - Contains user details (name, email, password, etc.)
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - Details of the created user
 */
const registerUser = async (userData, token) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/usuario/registroUsuario`,
			userData,
			{
				headers: { 'log-token': token },
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error registering user:', error);
		throw error;
	}
};

/**
 * Creates a new team
 * @param {Object} teamData - Contains team details
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - Details of the created team
 */
const createTeam = async (teamData, token) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/usuario/nuevoEquipo`,
			teamData,
			{
				headers: { 'log-token': token },
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error creating team:', error);
		throw error;
	}
};

/**
 * Fetches teams based on criteria
 * @param {Object} criteria - Filter criteria (e.g., team name, leader ID)
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - List of teams
 */
const fetchTeams = async (criteria, token) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/usuario/consultarEquipos`,
			criteria,
			{
				headers: { 'log-token': token },
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error fetching teams:', error);
		throw error;
	}
};

/**
 * Creates a protocol
 * @param {Object} protocolData - Contains protocol details
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - Details of the created protocol
 */
const createProtocol = async (protocolData, token) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/protocolos/crearProtocolo`,
			protocolData,
			{
				headers: { 'log-token': token },
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error creating protocol:', error);
		throw error;
	}
};

/**
 * Rates a protocol
 * @param {Object} ratingData - Contains protocol rating data
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - Result of the rating
 */
const rateProtocol = async (ratingData, token) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/protocolos/calificarProtocolo`,
			ratingData,
			{
				headers: { 'log-token': token },
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error rating protocol:', error);
		throw error;
	}
};

/**
 * Uploads a PDF for a protocol
 * @param {Object} pdfData - Contains leader ID, protocol title, and PDF URL
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - Result of the upload
 */
const uploadProtocolPDF = async (pdfData, token) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/protocolos/subirPDF`,
			pdfData,
			{
				headers: { 'log-token': token },
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error uploading PDF:', error);
		throw error;
	}
};

module.exports = {
	loginUser,
	registerUser,
	createTeam,
	fetchTeams,
	createProtocol,
	rateProtocol,
	uploadProtocolPDF,
};
