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
	Input,
	Select,
	useDisclosure,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const UsersPage = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const [editing, setEditing] = useState(false);
	const [filters, setFilters] = useState({
		rol: '',
		correo: '',
	});
	const [users, setUsers] = useState([]);
	const [userData, setUserData] = useState({
		nombre: '',
		correo: '',
		rol: '',
		clave: '', // Boleta o Clave de empleado
		contrasena: '',
	});

	// Obtener usuarios desde el backend
	const fetchUsers = async () => {
		try {
			const response = await fetch('/api/consult-users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'log-token': 'your-token-here',
				},
				body: JSON.stringify(filters),
			});
			const result = await response.json();

			if (response.ok) {
				setUsers(result.usuarios || []);
			} else {
				toast({
					title: 'Error al cargar usuarios',
					description: result.message || 'Intenta más tarde.',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: 'Error del servidor',
				description: 'No se pudieron cargar los usuarios.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	// Guardar usuario (crear o actualizar)
	const handleSave = async () => {
		try {
			const endpoint = editing ? '/api/update-user' : '/api/create-user';
			const method = editing ? 'PUT' : 'POST';

			const response = await fetch(endpoint, {
				method,
				headers: {
					'Content-Type': 'application/json',
					'log-token': 'your-token-here',
				},
				body: JSON.stringify(userData),
			});
			const result = await response.json();

			if (response.ok) {
				toast({
					title: editing ? 'Usuario actualizado.' : 'Usuario creado.',
					description: 'La operación se realizó exitosamente.',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				fetchUsers();
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
				description: 'No se pudo guardar el usuario.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	// Eliminar usuario
	const handleDelete = async (clave) => {
		try {
			const response = await fetch('/api/delete-user', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'log-token': 'your-token-here',
				},
				body: JSON.stringify({ clave }),
			});
			const result = await response.json();

			if (response.ok) {
				toast({
					title: 'Usuario eliminado.',
					description: `El usuario con clave ${clave} ha sido eliminado.`,
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				fetchUsers();
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
				description: 'No se pudo eliminar el usuario.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	// Cargar usuarios al montar el componente
	useEffect(() => {
		fetchUsers();
	}, []);

	return (
		<Box
			p={8}
			bg="#EDF2F7"
			minH="100vh"
		>
			<Box mb={4}>
				<Input
					placeholder="Filtrar por correo"
					value={filters.correo}
					onChange={(e) => setFilters({ ...filters, correo: e.target.value })}
					mb={2}
				/>
				<Select
					placeholder="Filtrar por rol"
					value={filters.rol}
					onChange={(e) => setFilters({ ...filters, rol: e.target.value })}
					mb={4}
				>
					<option value="Estudiante">Estudiante</option>
					<option value="Docente">Docente</option>
					<option value="Admin">Admin</option>
				</Select>
				<Button
					colorScheme="blue"
					onClick={fetchUsers}
				>
					Filtrar
				</Button>
			</Box>

			<Button
				colorScheme="green"
				mb={4}
				onClick={() => {
					setEditing(false);
					setUserData({
						nombre: '',
						correo: '',
						rol: '',
						clave: '',
						contrasena: '',
					});
					onOpen();
				}}
			>
				Crear Usuario
			</Button>

			<Table
				variant="simple"
				bg="white"
				boxShadow="lg"
				borderRadius="md"
			>
				<Thead>
					<Tr>
						<Th>Nombre</Th>
						<Th>Correo</Th>
						<Th>Rol</Th>
						<Th>Clave/Boleta</Th>
						<Th>Acciones</Th>
					</Tr>
				</Thead>
				<Tbody>
					{users.map((user) => (
						<Tr key={user.id}>
							<Td>{user.nombre}</Td>
							<Td>{user.correo}</Td>
							<Td>{user.rol}</Td>
							<Td>{user.clave}</Td>
							<Td>
								<Button
									colorScheme="yellow"
									size="sm"
									mr={2}
									onClick={() => {
										setEditing(true);
										setUserData(user);
										onOpen();
									}}
								>
									Editar
								</Button>
								<Button
									colorScheme="red"
									size="sm"
									onClick={() => handleDelete(user.clave)}
								>
									Eliminar
								</Button>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>

			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						{editing ? 'Editar Usuario' : 'Crear Usuario'}
					</ModalHeader>
					<ModalBody>
						<VStack
							spacing={4}
							align="stretch"
						>
							<Input
								placeholder="Nombre"
								value={userData.nombre}
								onChange={(e) =>
									setUserData({ ...userData, nombre: e.target.value })
								}
							/>
							<Input
								placeholder="Correo"
								value={userData.correo}
								onChange={(e) =>
									setUserData({ ...userData, correo: e.target.value })
								}
							/>
							<Select
								placeholder="Seleccione un rol"
								value={userData.rol}
								onChange={(e) =>
									setUserData({ ...userData, rol: e.target.value })
								}
							>
								<option value="Estudiante">Estudiante</option>
								<option value="Docente">Docente</option>
								<option value="Admin">Admin</option>
							</Select>
							<Input
								placeholder="Clave/Boleta"
								value={userData.clave}
								onChange={(e) =>
									setUserData({ ...userData, clave: e.target.value })
								}
							/>
							<Input
								placeholder="Contraseña"
								type="password"
								value={userData.contrasena}
								onChange={(e) =>
									setUserData({ ...userData, contrasena: e.target.value })
								}
							/>
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

export default UsersPage;
