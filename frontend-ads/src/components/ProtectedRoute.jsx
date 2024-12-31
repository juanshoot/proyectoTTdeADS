import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Asegúrate de tener un contexto de autenticación

const ProtectedRoute = ({ role, orRole, children }) => {
	const { user } = useAuth();

	if (!user) {
		return <Navigate to="/" />;
	}

	if (user.role !== role && (!orRole || user.role !== orRole)) {
		return <Navigate to="/not-authorized" />;
	}

	return children;
};

export default ProtectedRoute;
