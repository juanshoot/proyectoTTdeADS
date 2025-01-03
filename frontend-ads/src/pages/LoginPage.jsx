import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	VStack,
	Flex,
	Heading,
	useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const toast = useToast();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const handleInputChange = (key, value) => {
		setFormData({ ...formData, [key]: value });
	};

	const handleLogin = () => {
		// Simulación de autenticación (debe conectarse con el backend)
		if (!formData.email || !formData.password) {
			toast({
				title: 'Error',
				description: 'Por favor complete todos los campos.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		const userData = {
			role: 'ADMIN', // Este dato debe provenir de la API
			name: 'Administrador',
		};

		login(userData);
		navigate('/admin/dashboard'); // Redirigir según el rol

		toast({
			title: 'Inicio de sesión exitoso',
			description: `Bienvenido, ${userData.name}`,
			status: 'success',
			duration: 3000,
			isClosable: true,
		});
	};

	return (
		<VStack
			spacing={6}
			align="stretch"
			bg="white"
			p={6}
			borderRadius="md"
		>
			<FormControl>
				<FormLabel
					fontWeight="bold"
					color="#2B6CB0"
				>
					Correo Electrónico
				</FormLabel>
				<Input
					type="email"
					placeholder="Ingrese su correo"
					value={formData.email}
					onChange={(e) => handleInputChange('email', e.target.value)}
					focusBorderColor="#2B6CB0"
				/>
			</FormControl>

			<FormControl>
				<FormLabel
					fontWeight="bold"
					color="#2B6CB0"
				>
					Contraseña
				</FormLabel>
				<Input
					type="password"
					placeholder="Ingrese su contraseña"
					value={formData.password}
					onChange={(e) => handleInputChange('password', e.target.value)}
					focusBorderColor="#2B6CB0"
				/>
			</FormControl>

			<Button
				colorScheme="blue"
				size="lg"
				onClick={handleLogin}
			>
				Iniciar Sesión
			</Button>
		</VStack>
	);
};

export default LoginPage;
