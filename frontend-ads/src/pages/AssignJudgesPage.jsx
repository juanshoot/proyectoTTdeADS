// AssignJudgesPage.js
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Select,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

const AssignJudgesPage = () => {
	const toast = useToast();
	const [protocols, setProtocols] = useState([
		'Protocolo Alpha',
		'Protocolo Beta',
	]); // Simulación de protocolos
	const [sinodales, setSinodales] = useState([
		'Dr. López',
		'Dra. Martínez',
		'Dr. Pérez',
		'Dra. Sánchez',
	]); // Simulación de sinodales
	const [selectedProtocol, setSelectedProtocol] = useState('');
	const [selectedJudges, setSelectedJudges] = useState([]);

	const handleAssign = () => {
		if (selectedProtocol && selectedJudges.length === 3) {
			toast({
				title: 'Sinodales asignados.',
				description: `Sinodales asignados para el ${selectedProtocol} exitosamente.`,
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
			setSelectedProtocol('');
			setSelectedJudges([]);
		} else {
			toast({
				title: 'Error.',
				description:
					'Debe seleccionar un protocolo y exactamente tres sinodales.',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};

	const handleJudgeSelect = (event) => {
		const value = event.target.value;
		if (selectedJudges.includes(value)) {
			setSelectedJudges(selectedJudges.filter((judge) => judge !== value));
		} else if (selectedJudges.length < 3) {
			setSelectedJudges([...selectedJudges, value]);
		}
	};

	return (
		<Box
			p={8}
			bg="#EDF2F7"
			minH="100vh"
		>
			<Box
				bg="white"
				p={6}
				borderRadius="md"
				boxShadow="lg"
				mb={6}
			>
				<FormControl mb={4}>
					<FormLabel>Seleccionar Protocolo</FormLabel>
					<Select
						placeholder="Seleccione un protocolo"
						value={selectedProtocol}
						onChange={(e) => setSelectedProtocol(e.target.value)}
					>
						{protocols.map((protocol, index) => (
							<option
								key={index}
								value={protocol}
							>
								{protocol}
							</option>
						))}
					</Select>
				</FormControl>

				<FormControl mb={4}>
					<FormLabel>Seleccionar Sinodales (máximo 3)</FormLabel>
					<Select
						placeholder="Seleccione sinodales"
						multiple
						onChange={handleJudgeSelect}
						value={selectedJudges}
					>
						{sinodales.map((judge, index) => (
							<option
								key={index}
								value={judge}
							>
								{judge}
							</option>
						))}
					</Select>
					<Box mt={2}>
						{selectedJudges.map((judge, index) => (
							<Box
								key={index}
								bg="blue.100"
								p={2}
								borderRadius="md"
								mb={2}
							>
								{judge}
							</Box>
						))}
					</Box>
				</FormControl>

				<Button
					colorScheme="blue"
					onClick={handleAssign}
				>
					Asignar Sinodales
				</Button>
			</Box>

			<Table
				variant="simple"
				bg="white"
				boxShadow="lg"
				borderRadius="md"
			>
				<Thead>
					<Tr>
						<Th>Protocolo</Th>
						<Th>Sinodales</Th>
					</Tr>
				</Thead>
				<Tbody>
					<Tr>
						<Td>Protocolo Alpha</Td>
						<Td>Dr. López, Dra. Martínez, Dr. Pérez</Td>
					</Tr>
				</Tbody>
			</Table>
		</Box>
	);
};

export default AssignJudgesPage;
