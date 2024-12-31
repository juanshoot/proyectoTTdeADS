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

const TeamFormPage = ({ onCreate }) => {
	const [teamData, setTeamData] = useState({
		nombre_equipo: '',
		integrantes_boletas: [''], // Mínimo dos integrantes
		lider: '',
	});

	const [protocolData, setProtocolData] = useState({
		titulo: '',
		director: '',
		director_2: '',
		academia: '',
		pdf: null, // Archivo PDF del protocolo
	});

	const toast = useToast();

	const handleTeamInputChange = (key, value) => {
		setTeamData({ ...teamData, [key]: value });
	};

	const handleProtocolInputChange = (key, value) => {
		setProtocolData({ ...protocolData, [key]: value });
	};

	const handlePDFUpload = (file) => {
		setProtocolData({ ...protocolData, pdf: file });
	};

	const handleMemberChange = (index, value) => {
		const updatedMembers = [...teamData.integrantes_boletas];
		updatedMembers[index] = value;
		setTeamData({ ...teamData, integrantes_boletas: updatedMembers });
	};

	const handleAddMember = () => {
		if (teamData.integrantes_boletas.length < 5) {
			setTeamData({
				...teamData,
				integrantes_boletas: [...teamData.integrantes_boletas, ''],
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
		onCreate({ teamData, protocolData }); // Callback para crear el equipo y protocolo

		toast({
			title: 'Equipo y protocolo creados',
			description: 'El equipo y el protocolo han sido creados exitosamente.',
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
					Crear Equipo y Protocolo
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
				{/* Datos del Equipo */}
				<Text
					fontSize="xl"
					fontWeight="bold"
					color="#2B6CB0"
				>
					Información del Equipo
				</Text>
				<Divider mb={4} />

				<FormControl>
					<FormLabel
						fontWeight="bold"
						color="#2B6CB0"
					>
						Nombre del Equipo
					</FormLabel>
					<Input
						placeholder="Ingrese el nombre del equipo"
						value={teamData.nombre_equipo}
						onChange={(e) =>
							handleTeamInputChange('nombre_equipo', e.target.value)
						}
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
					{teamData.integrantes_boletas.map((member, index) => (
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
						value={teamData.lider}
						onChange={(e) => handleTeamInputChange('lider', e.target.value)}
						focusBorderColor="#2B6CB0"
					>
						{teamData.integrantes_boletas.map((member, index) => (
							<option
								key={index}
								value={member}
							>
								{member || `Boleta Miembro ${index + 1}`}
							</option>
						))}
					</Select>
				</FormControl>

				{/* Datos del Protocolo */}
				<Text
					fontSize="xl"
					fontWeight="bold"
					color="#2B6CB0"
					mt={8}
				>
					Información del Protocolo
				</Text>
				<Divider mb={4} />

				<FormControl>
					<FormLabel
						fontWeight="bold"
						color="#2B6CB0"
					>
						Título del Protocolo
					</FormLabel>
					<Input
						placeholder="Ingrese el título del protocolo"
						value={protocolData.titulo}
						onChange={(e) =>
							handleProtocolInputChange('titulo', e.target.value)
						}
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
						value={protocolData.director}
						onChange={(e) =>
							handleProtocolInputChange('director', e.target.value)
						}
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
						value={protocolData.director_2}
						onChange={(e) =>
							handleProtocolInputChange('director_2', e.target.value)
						}
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
						value={protocolData.academia}
						onChange={(e) =>
							handleProtocolInputChange('academia', e.target.value)
						}
						focusBorderColor="#2B6CB0"
					/>
				</FormControl>

				<FormControl>
					<FormLabel
						fontWeight="bold"
						color="#2B6CB0"
					>
						Subir Archivo PDF
					</FormLabel>
					<Input
						type="file"
						accept="application/pdf"
						onChange={(e) => handlePDFUpload(e.target.files[0])}
						focusBorderColor="#2B6CB0"
					/>
				</FormControl>

				<Button
					colorScheme="green"
					size="lg"
					onClick={handleSubmit}
				>
					Crear Equipo y Protocolo
				</Button>
			</VStack>
		</Box>
	);
};

export default TeamFormPage;
