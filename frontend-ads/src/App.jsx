// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardAdmin from './pages/DashboardAdmin';
import UsersPage from './pages/UsersPage';
import TeamsPage from './pages/TeamsPage';
import AssignJudgesPage from './pages/AssignJudgesPage';
import EvaluationsPage from './pages/EvaluationsPage';
import DashboardStudent from './pages/DashboardStudent';
import TeamFormPage from './pages/TeamFormPage';

const App = () => {
	return (
		<Router>
			<Navbar />
			<Routes>
				{/* Rutas para ADMIN */}
				<Route
					path="/admin/dashboard"
					element={<DashboardAdmin />}
				/>
				<Route
					path="/admin/users"
					element={<UsersPage />}
				/>
				<Route
					path="/admin/teams"
					element={<TeamsPage />}
				/>
				<Route
					path="/admin/assign-judges"
					element={<AssignJudgesPage />}
				/>
				<Route
					path="/admin/evaluations"
					element={<EvaluationsPage />}
				/>

				{/* Rutas para ESTUDIANTE */}
				<Route
					path="/student/dashboard"
					element={<DashboardStudent />}
				/>
				<Route
					path="/student/create-team"
					element={<TeamFormPage />}
				/>
			</Routes>
		</Router>
	);
};

export default App;
