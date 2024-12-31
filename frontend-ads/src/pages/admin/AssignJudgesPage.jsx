import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Checkbox,
	CheckboxGroup,
	Stack,
	useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

const AssignJudgesPage = () => {
	const toast = useToast();
	const [protocols, setProtocols] = useState([
		{ id: 1, titulo: 'TT Gestion' },
		{ id: 2, titulo: 'CryptoPredict' },
	]);
	const [judges, setJudges] = useState([
		{ id: 1, nombre: 'Alexis' },
		{ id: 2, nombre: 'Martin' },
		{ id: 3, nombre: 'Diego' },
		{ id: 4, nombre: 'Alan' },
	]);
	const [selectedProtocol, setSelectedProtocol] = useState('');
	const [selectedJudges, setSelectedJudges] = useState([]);
	const [assignments, setAssignments] = useState([]);

	const handleAssign = () => {
		if (selectedProtocol && selectedJudges.length === 3) {
			const protocolTitle = protocols.find(
				(p) => p.id === parseInt(selectedProtocol)
			).titulo;
			const selectedJudgeNames = selectedJudges.map((id) => {
				const judge = judges.find((j) => j.id === parseInt(id));
				return judge ? judge.nombre : '';
			});

			setAssignments([
				...assignments,
				{ protocolo: protocolTitle, sinodales: selectedJudgeNames },
			]);

			toast({
				title: 'Sinodales asignados.',
				description: `Sinodales asignados para el protocolo: ${protocolTitle}.`,
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

	const handleJudgeChange = (selectedValues) => {
		setSelectedJudges(selectedValues);
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
					<select
						value={selectedProtocol}
						onChange={(e) => setSelectedProtocol(e.target.value)}
						style={{
							width: '100%',
							padding: '8px',
							borderRadius: '4px',
							border: '1px solid #CBD5E0',
						}}
					>
						<option
							value=""
							disabled
						>
							Seleccione un protocolo
						</option>
						{protocols.map((protocol) => (
							<option
								key={protocol.id}
								value={protocol.id}
							>
								{protocol.titulo}
							</option>
						))}
					</select>
				</FormControl>

				<FormControl mb={4}>
					<FormLabel>Seleccionar Sinodales (3 sinodales)</FormLabel>
					<CheckboxGroup
						value={selectedJudges}
						onChange={handleJudgeChange}
					>
						<Stack spacing={2}>
							{judges.map((judge) => (
								<Checkbox
									key={judge.id}
									value={judge.id.toString()}
									isDisabled={
										selectedJudges.length >= 3 &&
										!selectedJudges.includes(judge.id.toString())
									}
								>
									{judge.nombre}
								</Checkbox>
							))}
						</Stack>
					</CheckboxGroup>
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
					{assignments.map((assignment, index) => (
						<Tr key={index}>
							<Td>{assignment.protocolo}</Td>
							<Td>{assignment.sinodales.join(', ')}</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};

export default AssignJudgesPage;
