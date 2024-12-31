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
} from '@chakra-ui/react';
import { useState } from 'react';

const TeamFormPage = ({ teamData, onUpdate }) => {
	const [formData, setFormData] = useState({
		nombre_equipo: teamData?.nombre_equipo || '',
		titulo: teamData?.titulo || '',
		director: teamData?.director || '',
		director_2: teamData?.director_2 || '',
		area: teamData?.area || '',
		integrantes_boletas: teamData?.integrantes_boletas || ['', ''], // Mínimo dos integrantes
		lider: teamData?.lider || '',
		contrasena: '', // Campo adicional requerido
	});
	const toast = useToast();

	const handleInputChange = (key, value) => {
		setFormData({ ...formData, [key]: value });
	};

	const handleMemberChange = (index, value) => {
		const updatedMembers = [...formData.integrantes_boletas];
		updatedMembers[index] = value;
		setFormData({ ...formData, integrantes_boletas: updatedMembers });
	};

	const handleAddMember = () => {
		if (formData.integrantes_boletas.length < 5) {
			setFormData({
				...formData,
				integrantes_boletas: [...formData.integrantes_boletas, ''],
			});
		} else {
			toast({
				title: 'Máximo alcanzado',
				description: 'Solo se permiten hasta 5 miembros en el equipo.',
				status: 'warning',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const handleSubmit = () => {
		if (!formData.contrasena) {
			toast({
				title: 'Error',
				description: 'La contraseña es requerida para actualizar el equipo.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		onUpdate(formData); // Callback para actualizar el equipo

		toast({
			title: 'Equipo actualizado',
			description: 'El equipo ha sido actualizado exitosamente.',
			status: 'success',
			duration: 3000,
			isClosable: true,
		});
	};

	return (
		<Box
			bg="#EDF2F7"
			minH="100vh"
			p={8}
		>
			<Flex
				justify="center"
				mb={6}
			>
				<Heading
					fontSize="3xl"
					color="#2B6CB0"
				>
					Actualizar Equipo
				</Heading>
			</Flex>
			<VStack
				spacing={6}
				align="stretch"
				bg="white"
				p={6}
				borderRadius="md"
				boxShadow="lg"
			>
				<FormControl>
					<FormLabel
						fontWeight="bold"
						color="#2B6CB0"
					>
						Nombre del Equipo
					</FormLabel>
					<Input
						placeholder="Ingrese el nombre del equipo"
						value={formData.nombre_equipo}
						onChange={(e) => handleInputChange('nombre_equipo', e.target.value)}
						focusBorderColor="#2B6CB0"
					/>
				</FormControl>

				<FormControl>
					<FormLabel
						fontWeight="bold"
						color="#2B6CB0"
					>
						Título del Protocolo
					</FormLabel>
					<Input
						placeholder="Ingrese el título del protocolo"
						value={formData.titulo}
						onChange={(e) => handleInputChange('titulo', e.target.value)}
						focusBorderColor="#2B6CB0"
					/>
				</FormControl>

				<FormControl>
					<FormLabel
						fontWeight="bold"
						color="#2B6CB0"
					>
						Director
					</FormLabel>
					<Input
						placeholder="Ingrese el nombre del director"
						value={formData.director}
						onChange={(e) => handleInputChange('director', e.target.value)}
						focusBorderColor="#2B6CB0"
					/>
				</FormControl>

				<FormControl>
					<FormLabel
						fontWeight="bold"
						color="#2B6CB0"
					>
						Director 2 (Opcional)
					</FormLabel>
					<Input
						placeholder="Ingrese el nombre del segundo director"
						value={formData.director_2}
						onChange={(e) => handleInputChange('director_2', e.target.value)}
						focusBorderColor="#2B6CB0"
					/>
				</FormControl>

				<FormControl>
					<FormLabel
						fontWeight="bold"
						color="#2B6CB0"
					>
						Área/Academia
					</FormLabel>
					<Input
						placeholder="Ingrese el área o academia"
						value={formData.area}
						onChange={(e) => handleInputChange('area', e.target.value)}
						focusBorderColor="#2B6CB0"
					/>
				</FormControl>

				<FormControl>
					<FormLabel
						fontWeight="bold"
						color="#2B6CB0"
					>
						Miembros del Equipo
					</FormLabel>
					{formData.integrantes_boletas.map((member, index) => (
						<Input
							key={index}
							placeholder={`Boleta Miembro ${index + 1}`}
							value={member}
							onChange={(e) => handleMemberChange(index, e.target.value)}
							mb={2}
							focusBorderColor="#2B6CB0"
						/>
					))}
					<Button
						onClick={handleAddMember}
						colorScheme="blue"
						mt={2}
					>
						Añadir Miembro
					</Button>
				</FormControl>

				<FormControl>
					<FormLabel
						fontWeight="bold"
						color="#2B6CB0"
					>
						Líder del Equipo
					</FormLabel>
					<Select
						placeholder="Seleccione al líder"
						value={formData.lider}
						onChange={(e) => handleInputChange('lider', e.target.value)}
						focusBorderColor="#2B6CB0"
					>
						{formData.integrantes_boletas.map((member, index) => (
							<option
								key={index}
								value={member}
							>
								{member || `Boleta Miembro ${index + 1}`}
							</option>
						))}
					</Select>
				</FormControl>

				<FormControl>
					<FormLabel
						fontWeight="bold"
						color="#2B6CB0"
					>
						Contraseña
					</FormLabel>
					<Input
						placeholder="Ingrese la contraseña para confirmar"
						type="password"
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
					Actualizar Equipo
				</Button>
			</VStack>
		</Box>
	);
};

export default TeamFormPage;
