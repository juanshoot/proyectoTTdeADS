import {
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Heading,
	Flex,
	Text,
	useBreakpointValue,
} from '@chakra-ui/react';

const EvaluationsPage = () => {
	const isMobile = useBreakpointValue({ base: true, md: false });

	const data = [
		{
			titulo: 'CryptoPredict',
			sinodales: [
				{
					nombre: 'Alexis',
					calificacion: 10,
					observaciones: 'Excelente propuesta.',
				},
				{
					nombre: 'Carlos',
					calificacion: 8,
					observaciones: 'Buena pero puede mejorar.',
				},
				{
					nombre: 'Juan',
					calificacion: 9,
					observaciones: 'Bien trabajado.',
				},
			],
		},
		{
			titulo: 'Equipo ADS',
			sinodales: [
				{
					nombre: 'Pedro',
					calificacion: 5,
					observaciones: 'Mejorar planteamiento del problema.',
				},
				{
					nombre: 'Odette',
					calificacion: 6,
					observaciones: 'Falta profundizar más.',
				},
				{
					nombre: 'Maria',
					calificacion: 7,
					observaciones: 'Regular, pero aceptable.',
				},
			],
		},
	];

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
			{data.map((protocolo) => (
				<Box
					key={protocolo.titulo}
					mb={6}
					bg="white"
					boxShadow="lg"
					borderRadius="md"
					p={4}
				>
					<Heading
						fontSize="lg"
						color="#2B6CB0"
						mb={4}
					>
						{protocolo.titulo}
					</Heading>
					<Table variant="simple">
						<Thead>
							<Tr>
								<Th>Sinodal</Th>
								<Th>Calificación</Th>
								<Th>Observaciones</Th>
							</Tr>
						</Thead>
						<Tbody>
							{protocolo.sinodales.map((sinodal, index) => (
								<Tr key={index}>
									<Td>{sinodal.nombre}</Td>
									<Td>{sinodal.calificacion}</Td>
									<Td>
										{isMobile ? (
											<Text fontSize="sm">{sinodal.observaciones}</Text>
										) : (
											sinodal.observaciones
										)}
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			))}
		</Box>
	);
};

export default EvaluationsPage;
