import {
	Box,
	Grid,
	Stat,
	StatLabel,
	StatNumber,
	Heading,
	Flex,
	VStack,
	Card,
	CardBody,
	CardHeader,
} from '@chakra-ui/react';
import { PieChart } from 'react-minimal-pie-chart';

const DashboardAdmin = () => {
	return (
		<Box
			bg="#EDF2F7"
			minH="100vh"
			p={8}
		>
			<Flex
				justify="center"
				mb={6}
			>
				<Heading
					fontSize="3xl"
					color="#2B6CB0"
				>
					Panel de Administración
				</Heading>
			</Flex>

			<Grid
				templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
				gap={6}
			>
				<Stat
					bg="white"
					boxShadow="lg"
					borderRadius="md"
					p={4}
				>
					<StatLabel>Usuarios Registrados</StatLabel>
					<StatNumber>120</StatNumber>
				</Stat>
				<Stat
					bg="white"
					boxShadow="lg"
					borderRadius="md"
					p={4}
				>
					<StatLabel>Equipos Activos</StatLabel>
					<StatNumber>45</StatNumber>
				</Stat>
				<Stat
					bg="white"
					boxShadow="lg"
					borderRadius="md"
					p={4}
				>
					<StatLabel>Protocolos en Revisión</StatLabel>
					<StatNumber>30</StatNumber>
				</Stat>
				<Stat
					bg="white"
					boxShadow="lg"
					borderRadius="md"
					p={4}
				>
					<StatLabel>Calificaciones Pendientes</StatLabel>
					<StatNumber>10</StatNumber>
				</Stat>
			</Grid>

			<Box
				mt={8}
				bg="white"
				p={6}
				borderRadius="md"
				boxShadow="lg"
			>
				<Heading
					fontSize="lg"
					mb={4}
					color="#2B6CB0"
				>
					Distribución de Protocolos
				</Heading>
				{/* <PieChart
					data={[
						{ title: 'Aprobados', value: 30, color: '#38A169' },
						{ title: 'Rechazados', value: 10, color: '#E53E3E' },
						{ title: 'Pendientes', value: 50, color: '#D69E2E' },
					]}
				/> */}
			</Box>
		</Box>
	);
};

export default DashboardAdmin;
