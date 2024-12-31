import {
	Box,
	Button,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	FormControl,
	FormLabel,
	Input,
	Select,
	useDisclosure,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

const TeamsPage = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const [editing, setEditing] = useState(false);
	const [teamData, setTeamData] = useState({
		nombre_equipo: '',
		titulo: '',
		director: '',
		director_2: '',
		academia: '',
		integrantes_boletas: ['', ''], // Mínimo dos integrantes
		lider: '',
	});
	const [teams, setTeams] = useState([
		{
			id: 1,
			nombre_equipo: 'Equipo Alpha',
			lider: '2025033811',
			titulo: 'Campeones 2024',
			director: '0000000002',
			director_2: '',
			academia: 'ISC',
			integrantes_boletas: ['2025033811', '2025000000'],
		},
	]); // Simulación de equipos

	const handleInputChange = (key, value) => {
		setTeamData({ ...teamData, [key]: value });
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
				title: 'Máximo alcanzado.',
				description: 'Solo se permiten hasta 5 miembros en el equipo.',
				status: 'warning',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const handleSave = () => {
		const updatedTeams = editing
			? teams.map((team) => (team.id === teamData.id ? teamData : team))
			: [...teams, { ...teamData, id: teams.length + 1 }];

		setTeams(updatedTeams);

		toast({
			title: editing ? 'Equipo actualizado.' : 'Equipo creado.',
			description: 'La operación se realizó exitosamente.',
			status: 'success',
			duration: 5000,
			isClosable: true,
		});
		onClose();
	};

	return (
		<Box
			p={8}
			bg="#EDF2F7"
			minH="100vh"
		>
			<Button
				colorScheme="blue"
				mb={4}
				onClick={() => {
					setEditing(false);
					setTeamData({
						nombre_equipo: '',
						titulo: '',
						director: '',
						director_2: '',
						academia: '',
						integrantes_boletas: ['', ''], // Reiniciar a dos integrantes
						lider: '',
					});
					onOpen();
				}}
			>
				Crear Equipo
			</Button>

			<Table
				variant="simple"
				bg="white"
				boxShadow="lg"
				borderRadius="md"
			>
				<Thead>
					<Tr>
						<Th>Nombre del Equipo</Th>
						<Th>Líder</Th>
						<Th>Título</Th>
						<Th>Director</Th>
						<Th>Director 2</Th>
						<Th>Academia</Th>
						<Th>Miembros</Th>
						<Th>Acciones</Th>
					</Tr>
				</Thead>
				<Tbody>
					{teams.map((team) => (
						<Tr key={team.id}>
							<Td>{team.nombre_equipo}</Td>
							<Td>{team.lider}</Td>
							<Td>{team.titulo}</Td>
							<Td>{team.director}</Td>
							<Td>{team.director_2 || 'N/A'}</Td>
							<Td>{team.academia}</Td>
							<Td>{team.integrantes_boletas.join(', ')}</Td>
							<Td>
								<Button
									colorScheme="yellow"
									size="sm"
									mr={2}
									onClick={() => {
										setEditing(true);
										setTeamData(team);
										onOpen();
									}}
								>
									Editar
								</Button>
								<Button
									colorScheme="red"
									size="sm"
								>
									Eliminar
								</Button>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>

			{/* Modal para agregar/editar equipo */}
			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						{editing ? 'Editar Equipo' : 'Crear Equipo'}
					</ModalHeader>
					<ModalBody>
						<VStack
							spacing={4}
							align="stretch"
						>
							<FormControl>
								<FormLabel>Nombre del Equipo</FormLabel>
								<Input
									value={teamData.nombre_equipo}
									onChange={(e) =>
										handleInputChange('nombre_equipo', e.target.value)
									}
									placeholder="Ingrese el nombre del equipo"
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Título del Protocolo</FormLabel>
								<Input
									value={teamData.titulo}
									onChange={(e) => handleInputChange('titulo', e.target.value)}
									placeholder="Ingrese el título del protocolo"
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Director</FormLabel>
								<Input
									value={teamData.director}
									onChange={(e) =>
										handleInputChange('director', e.target.value)
									}
									placeholder="Ingrese el nombre del director"
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Director 2 (Opcional)</FormLabel>
								<Input
									value={teamData.director_2}
									onChange={(e) =>
										handleInputChange('director_2', e.target.value)
									}
									placeholder="Ingrese el nombre del segundo director"
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Academia</FormLabel>
								<Input
									value={teamData.academia}
									onChange={(e) =>
										handleInputChange('academia', e.target.value)
									}
									placeholder="Ingrese la academia"
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Miembros del Equipo</FormLabel>
								{teamData.integrantes_boletas.map((member, index) => (
									<Input
										key={index}
										placeholder={`Boleta Miembro ${index + 1}`}
										value={member}
										onChange={(e) => handleMemberChange(index, e.target.value)}
										mb={2}
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
								<FormLabel>Líder del Equipo</FormLabel>
								<Select
									placeholder="Seleccione al líder"
									value={teamData.lider}
									onChange={(e) => handleInputChange('lider', e.target.value)}
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
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							onClick={handleSave}
						>
							Guardar
						</Button>
						<Button
							onClick={onClose}
							ml={3}
						>
							Cancelar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default TeamsPage;
