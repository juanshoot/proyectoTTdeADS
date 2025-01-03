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
	useDisclosure,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const TeamsPage = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const [editing, setEditing] = useState(false);
	const [data, setData] = useState({
		nombre_equipo: '',
		integrantes_boletas: ['', ''],
		lider: '',
		titulo: '',
		director: '',
		director_2: '',
		academia: '',
	});
	const [teams, setTeams] = useState([]);
	const [filteredTeams, setFilteredTeams] = useState([]);
	const [filters, setFilters] = useState({
		nombre_equipo: '',
		lider: '',
		titulo: '',
	});

	// Obtener equipos desde el backend
	const fetchTeams = async () => {
		try {
			const response = await fetch('/api/consult-team', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'log-token': 'your-token-here',
				},
				body: JSON.stringify(filters),
			});
			const result = await response.json();

			if (response.ok) {
				setTeams(result.equipos || []);
				setFilteredTeams(result.equipos || []);
			} else {
				toast({
					title: 'Error al cargar equipos',
					description: result.message || 'Intenta más tarde.',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: 'Error del servidor',
				description: 'No se pudieron cargar los equipos.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	// Guardar equipo (nuevo o actualizado)
	const handleSave = async () => {
		try {
			const endpoint = editing ? '/api/update-team' : '/api/new-team';
			const response = await fetch(endpoint, {
				method: editing ? 'PUT' : 'POST',
				headers: {
					'Content-Type': 'application/json',
					'log-token': 'your-token-here',
				},
				body: JSON.stringify(data),
			});
			const result = await response.json();

			if (response.ok) {
				toast({
					title: editing ? 'Equipo actualizado.' : 'Equipo creado.',
					description: 'La operación se realizó exitosamente.',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				fetchTeams();
				onClose();
			} else {
				toast({
					title: 'Error',
					description: result.message || 'Intenta más tarde.',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: 'Error del servidor',
				description: 'No se pudo guardar el equipo.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	// Eliminar equipo
	const handleDelete = async (id, nombre_equipo, lider) => {
		try {
			const response = await fetch('/api/delete-team', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'log-token': 'your-token-here',
				},
				body: JSON.stringify({ lider, nombre_equipo }),
			});
			const result = await response.json();

			if (response.ok) {
				toast({
					title: 'Equipo eliminado.',
					description: `El equipo ${nombre_equipo} ha sido eliminado.`,
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				fetchTeams();
			} else {
				toast({
					title: 'Error',
					description: result.message || 'Intenta más tarde.',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: 'Error del servidor',
				description: 'No se pudo eliminar el equipo.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	// Filtrar equipos localmente
	const handleFilter = () => {
		let results = teams;

		if (filters.nombre_equipo) {
			results = results.filter((team) =>
				team.nombre_equipo
					.toLowerCase()
					.includes(filters.nombre_equipo.toLowerCase())
			);
		}

		if (filters.lider) {
			results = results.filter((team) =>
				team.lider.toLowerCase().includes(filters.lider.toLowerCase())
			);
		}

		if (filters.titulo) {
			results = results.filter((team) =>
				team.titulo.toLowerCase().includes(filters.titulo.toLowerCase())
			);
		}

		setFilteredTeams(results);

		if (results.length === 0) {
			toast({
				title: 'Sin resultados',
				description: 'No se encontraron equipos con los filtros aplicados.',
				status: 'info',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	// Cargar equipos al montar el componente
	useEffect(() => {
		fetchTeams();
	}, []);

	return (
		<Box
			p={8}
			bg="#EDF2F7"
			minH="100vh"
		>
			{/* Filtros */}
			<Box mb={4}>
				<Input
					placeholder="Filtrar por nombre del equipo"
					value={filters.nombre_equipo}
					onChange={(e) =>
						setFilters({ ...filters, nombre_equipo: e.target.value })
					}
					mb={2}
				/>
				<Input
					placeholder="Filtrar por líder"
					value={filters.lider}
					onChange={(e) => setFilters({ ...filters, lider: e.target.value })}
					mb={2}
				/>
				<Input
					placeholder="Filtrar por título"
					value={filters.titulo}
					onChange={(e) => setFilters({ ...filters, titulo: e.target.value })}
					mb={4}
				/>
				<Button
					colorScheme="blue"
					onClick={handleFilter}
				>
					Aplicar Filtros
				</Button>
			</Box>

			<Button
				colorScheme="green"
				mb={4}
				onClick={() => {
					setEditing(false);
					setData({
						nombre_equipo: '',
						integrantes_boletas: ['', ''],
						lider: '',
						titulo: '',
						director: '',
						director_2: '',
						academia: '',
					});
					onOpen();
				}}
			>
				Crear Equipo
			</Button>

			{/* Tabla de equipos */}
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
						<Th>Acciones</Th>
					</Tr>
				</Thead>
				<Tbody>
					{filteredTeams.map((team) => (
						<Tr key={team.id_equipo}>
							<Td>{team.nombre_equipo}</Td>
							<Td>{team.lider}</Td>
							<Td>{team.titulo}</Td>
							<Td>{team.director}</Td>
							<Td>{team.director_2 || 'N/A'}</Td>
							<Td>{team.academia}</Td>
							<Td>
								<Button
									colorScheme="yellow"
									size="sm"
									mr={2}
									onClick={() => {
										setEditing(true);
										setData(team);
										onOpen();
									}}
								>
									Editar
								</Button>
								<Button
									colorScheme="red"
									size="sm"
									onClick={() =>
										handleDelete(team.id_equipo, team.nombre_equipo, team.lider)
									}
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
									value={data.nombre_equipo}
									onChange={(e) =>
										setData({ ...data, nombre_equipo: e.target.value })
									}
									placeholder="Ingrese el nombre del equipo"
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Líder</FormLabel>
								<Input
									value={data.lider}
									onChange={(e) => setData({ ...data, lider: e.target.value })}
									placeholder="Ingrese el líder del equipo"
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Título</FormLabel>
								<Input
									value={data.titulo}
									onChange={(e) => setData({ ...data, titulo: e.target.value })}
									placeholder="Ingrese el título del equipo"
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Director</FormLabel>
								<Input
									value={data.director}
									onChange={(e) =>
										setData({ ...data, director: e.target.value })
									}
									placeholder="Ingrese el director del equipo"
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Director 2</FormLabel>
								<Input
									value={data.director_2}
									onChange={(e) =>
										setData({ ...data, director_2: e.target.value })
									}
									placeholder="Ingrese el segundo director del equipo"
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Academia</FormLabel>
								<Input
									value={data.academia}
									onChange={(e) =>
										setData({ ...data, academia: e.target.value })
									}
									placeholder="Ingrese la academia"
								/>
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
