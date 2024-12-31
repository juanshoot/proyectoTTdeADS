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
} from '@chakra-ui/react';
import { useState } from 'react';

const UsersPage = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const [editing, setEditing] = useState(false);
	const [userData, setUserData] = useState({
		nombre: '',
		correo: '',
		rol: '',
		clave: '',
	});
	const [users, setUsers] = useState([
		{
			id: 1,
			nombre: 'Juan Pérez',
			correo: 'juan.perez@mail.com',
			rol: 'Admin',
			clave: '202300001',
		},
	]);

	const handleInputChange = (key, value) => {
		setUserData({ ...userData, [key]: value });
	};

	const handleSave = () => {
		const updatedUsers = editing
			? users.map((user) => (user.id === userData.id ? userData : user))
			: [...users, { ...userData, id: users.length + 1 }];

		setUsers(updatedUsers);

		toast({
			title: editing ? 'Usuario actualizado.' : 'Usuario creado.',
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
					setUserData({ nombre: '', correo: '', rol: '', clave: '' });
					onOpen();
				}}
			>
				Agregar Usuario
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
								>
									Eliminar
								</Button>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>

			{/* Modal para agregar/editar usuario */}
			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						{editing ? 'Editar Usuario' : 'Agregar Usuario'}
					</ModalHeader>
					<ModalBody>
						<Input
							placeholder="Nombre"
							mb={4}
							value={userData.nombre}
							onChange={(e) => handleInputChange('nombre', e.target.value)}
						/>
						<Input
							placeholder="Correo"
							mb={4}
							value={userData.correo}
							onChange={(e) => handleInputChange('correo', e.target.value)}
						/>
						<Select
							placeholder="Seleccione un rol"
							mb={4}
							value={userData.rol}
							onChange={(e) => handleInputChange('rol', e.target.value)}
						>
							<option value="Admin">Admin</option>
							<option value="Usuario">Usuario</option>
							<option value="Estudiante">Estudiante</option>
						</Select>
						<Input
							placeholder="Clave/Boleta"
							mb={4}
							value={userData.clave}
							onChange={(e) => handleInputChange('clave', e.target.value)}
						/>
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
