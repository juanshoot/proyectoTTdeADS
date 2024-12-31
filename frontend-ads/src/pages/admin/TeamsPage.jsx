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
	Divider,
	Text,
} from '@chakra-ui/react';
import { useState } from 'react';

const TeamsAndProtocolsPage = () => {
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
		pdf: null,
	});
	const [records, setRecords] = useState([
		{
			id: 1,
			nombre_equipo: 'Equipo ADS',
			lider: '2025033811',
			titulo: 'Campeones 2024',
			director: 'Regina',
			director_2: '',
			academia: 'Electrónica',
			integrantes_boletas: ['2025033811', '2025000000'],
		},
	]);

	const handleInputChange = (key, value) => {
		setData({ ...data, [key]: value });
	};

	const handleFileChange = (file) => {
		setData({ ...data, pdf: file });
	};

	const handleMemberChange = (index, value) => {
		const updatedMembers = [...data.integrantes_boletas];
		updatedMembers[index] = value;
		setData({ ...data, integrantes_boletas: updatedMembers });
	};

	const handleAddMember = () => {
		if (data.integrantes_boletas.length < 5) {
			setData({
				...data,
				integrantes_boletas: [...data.integrantes_boletas, ''],
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
		const updatedRecords = editing
			? records.map((record) => (record.id === data.id ? data : record))
			: [...records, { ...data, id: records.length + 1 }];

		setRecords(updatedRecords);

		toast({
			title: editing ? 'Registro actualizado.' : 'Registro creado.',
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
					setData({
						nombre_equipo: '',
						integrantes_boletas: [''],
						lider: '',
						titulo: '',
						director: '',
						director_2: '',
						academia: '',
						pdf: null,
					});
					onOpen();
				}}
			>
				Crear Registro
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
					{records.map((record) => (
						<Tr key={record.id}>
							<Td>{record.nombre_equipo}</Td>
							<Td>{record.lider}</Td>
							<Td>{record.titulo}</Td>
							<Td>{record.director}</Td>
							<Td>{record.director_2 || 'N/A'}</Td>
							<Td>{record.academia}</Td>
							<Td>{record.integrantes_boletas.join(', ')}</Td>
							<Td>
								<Button
									colorScheme="yellow"
									size="sm"
									mr={2}
									onClick={() => {
										setEditing(true);
										setData(record);
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

			{/* Modal para agregar/editar registro */}
			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						{editing ? 'Editar Registro' : 'Crear Registro'}
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
										handleInputChange('nombre_equipo', e.target.value)
									}
									placeholder="Ingrese el nombre del equipo"
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Título del Protocolo</FormLabel>
								<Input
									value={data.titulo}
									onChange={(e) => handleInputChange('titulo', e.target.value)}
									placeholder="Ingrese el título del protocolo"
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Director</FormLabel>
								<Input
									value={data.director}
									onChange={(e) =>
										handleInputChange('director', e.target.value)
									}
									placeholder="Ingrese el nombre del director"
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Director 2 (Opcional)</FormLabel>
								<Input
									value={data.director_2}
									onChange={(e) =>
										handleInputChange('director_2', e.target.value)
									}
									placeholder="Ingrese el nombre del segundo director"
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Academia</FormLabel>
								<Input
									value={data.academia}
									onChange={(e) =>
										handleInputChange('academia', e.target.value)
									}
									placeholder="Ingrese la academia"
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Miembros del Equipo</FormLabel>
								{data.integrantes_boletas.map((member, index) => (
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
								<FormLabel>Archivo PDF</FormLabel>
								<Input
									type="file"
									accept="application/pdf"
									onChange={(e) => handleFileChange(e.target.files[0])}
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

export default TeamsAndProtocolsPage;
