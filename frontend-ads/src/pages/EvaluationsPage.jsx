// EvaluationsPage.js
import {
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Heading,
} from '@chakra-ui/react';

const EvaluationsPage = () => {
	return (
		<Box
			p={8}
			bg="#EDF2F7"
			minH="100vh"
		>
			<Heading
				fontSize="2xl"
				mb={6}
				color="#2B6CB0"
			>
				Evaluaciones
			</Heading>
			<Table
				variant="simple"
				bg="white"
				boxShadow="lg"
				borderRadius="md"
			>
				<Thead>
					<Tr>
						<Th>Título del Protocolo</Th>
						<Th>Sinodal</Th>
						<Th>Calificación</Th>
						<Th>Observaciones</Th>
					</Tr>
				</Thead>
				<Tbody>
					<Tr>
						<Td>Protocolo Alpha</Td>
						<Td>Dr. López</Td>
						<Td>Aprobado</Td>
						<Td>Excelente propuesta.</Td>
					</Tr>
					<Tr>
						<Td>Protocolo Beta</Td>
						<Td>Dra. Martínez</Td>
						<Td>No Aprobado</Td>
						<Td>Mejorar planteamiento del problema.</Td>
					</Tr>
				</Tbody>
			</Table>
		</Box>
	);
};

export default EvaluationsPage;
