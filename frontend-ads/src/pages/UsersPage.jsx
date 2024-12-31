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
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

const UsersPage = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const [editing, setEditing] = useState(false);

	const handleSave = () => {
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
						<Th>Acciones</Th>
					</Tr>
				</Thead>
				<Tbody>
					<Tr>
						<Td>Juan Pérez</Td>
						<Td>juan.perez@mail.com</Td>
						<Td>Admin</Td>
						<Td>
							<Button
								colorScheme="yellow"
								size="sm"
								mr={2}
								onClick={() => {
									setEditing(true);
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
						/>
						<Input
							placeholder="Correo"
							mb={4}
						/>
						<Input
							placeholder="Rol"
							mb={4}
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
