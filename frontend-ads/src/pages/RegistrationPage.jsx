import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Select,
	VStack,
	useToast,
	Flex,
	Heading,
	Divider,
	Text,
} from '@chakra-ui/react';
import { useState } from 'react';

const RegistrationForm = ({ onSubmit }) => {
	const [formData, setFormData] = useState({
		rol: '',
		nombre: '',
		correo: '',
		clave: '', // Clave para docente / boleta para alumno
		estado: 'A',
		contrasena: '',
		nombre_equipo: '',
		academia: '', // Solo para docentes
	});

	const toast = useToast();

	const handleInputChange = (key, value) => {
		setFormData({ ...formData, [key]: value });
	};

	const handleSubmit = () => {
		// Validar campos básicos
		if (!formData.nombre || !formData.correo || !formData.contrasena) {
			toast({
				title: 'Error',
				description: 'Todos los campos requeridos deben ser llenados.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		onSubmit(formData); // Enviar datos al backend o procesar localmente

		toast({
			title: 'Registro Exitoso',
			description: `El usuario ${formData.nombre} ha sido registrado.`,
			status: 'success',
			duration: 3000,
			isClosable: true,
		});

		// Resetear formulario
		setFormData({
			rol: '',
			nombre: '',
			correo: '',
			clave: '',
			estado: 'A',
			contrasena: '',
			nombre_equipo: '',
			academia: '',
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
					Rol
				</FormLabel>
				<Select
					placeholder="Seleccione el rol"
					value={formData.rol}
					onChange={(e) => handleInputChange('rol', e.target.value)}
					focusBorderColor="#2B6CB0"
				>
					<option value="alumno">Alumno</option>
					<option value="docente">Docente</option>
				</Select>
			</FormControl>

			<FormControl>
				<FormLabel
					fontWeight="bold"
					color="#2B6CB0"
				>
					Nombre
				</FormLabel>
				<Input
					placeholder="Ingrese el nombre"
					value={formData.nombre}
					onChange={(e) => handleInputChange('nombre', e.target.value)}
					focusBorderColor="#2B6CB0"
				/>
			</FormControl>

			<FormControl>
				<FormLabel
					fontWeight="bold"
					color="#2B6CB0"
				>
					Correo
				</FormLabel>
				<Input
					type="email"
					placeholder="Ingrese el correo"
					value={formData.correo}
					onChange={(e) => handleInputChange('correo', e.target.value)}
					focusBorderColor="#2B6CB0"
				/>
			</FormControl>

			{formData.rol === 'alumno' && (
				<FormControl>
					<FormLabel
						fontWeight="bold"
						color="#2B6CB0"
					>
						Boleta
					</FormLabel>
					<Input
						placeholder="Ingrese la boleta"
						value={formData.clave}
						onChange={(e) => handleInputChange('clave', e.target.value)}
						focusBorderColor="#2B6CB0"
					/>
				</FormControl>
			)}

			{formData.rol === 'docente' && (
				<>
					<FormControl>
						<FormLabel
							fontWeight="bold"
							color="#2B6CB0"
						>
							Clave de Empleado
						</FormLabel>
						<Input
							placeholder="Ingrese la clave de empleado"
							value={formData.clave}
							onChange={(e) => handleInputChange('clave', e.target.value)}
							focusBorderColor="#2B6CB0"
						/>
					</FormControl>
					<FormControl>
						<FormLabel
							fontWeight="bold"
							color="#2B6CB0"
						>
							Academia
						</FormLabel>
						<Input
							placeholder="Ingrese el área o academia"
							value={formData.academia}
							onChange={(e) => handleInputChange('academia', e.target.value)}
							focusBorderColor="#2B6CB0"
						/>
					</FormControl>
				</>
			)}

			<FormControl>
				<FormLabel
					fontWeight="bold"
					color="#2B6CB0"
				>
					Contraseña
				</FormLabel>
				<Input
					type="password"
					placeholder="Ingrese la contraseña"
					value={formData.contrasena}
					onChange={(e) => handleInputChange('contrasena', e.target.value)}
					focusBorderColor="#2B6CB0"
				/>
			</FormControl>

			<Button
				colorScheme="green"
				size="lg"
				onClick={handleSubmit}
			>
				Registrar Usuario
			</Button>
		</VStack>
	);
};

export default RegistrationForm;
