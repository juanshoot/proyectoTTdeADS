import {
	Box,
	Grid,
	Card,
	CardHeader,
	CardBody,
	Text,
	Heading,
	Flex,
	Button,
} from '@chakra-ui/react';
import EditProfileModal from './EditProfileModal';
import DeleteProfileButton from './DeleteProfileButton';
import DeleteTeamButton from './DeleteTeamButton';
import EditTeamModal from './EditTeamModal';
import UpdateProtocolModal from './UpdateProtocolModal';
import EditProtocolModal from './EditProtocolModal';
import DeleteProtocolButton from './DeleteProtocolButton';

const DashboardStudent = () => {
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
					Panel de Estudiante
				</Heading>
			</Flex>
			<Grid
				templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
				gap={6}
			>
				{/* Información del Equipo */}
				<Card
					boxShadow="lg"
					borderRadius="md"
				>
					<CardHeader
						bg="#2B6CB0"
						color="white"
						p={4}
						borderRadius="md"
					>
						Información del Equipo
					</CardHeader>
					<CardBody p={4}>
						<Text fontWeight="bold">Nombre del Equipo:</Text>
						<Text mb={2}>Equipo ADS</Text>

						<Text fontWeight="bold">Título:</Text>
						<Text mb={2}>Sistema web para la detección de enfermedades</Text>

						<Text fontWeight="bold">Director:</Text>
						<Text mb={2}>Martin</Text>

						<Text fontWeight="bold">Director 2:</Text>
						<Text mb={2}>Pedro</Text>

						<Text fontWeight="bold">PDF Subido:</Text>
						<Text
							color="#38A169"
							fontWeight="bold"
						>
							Sí
						</Text>

						<Text fontWeight="bold">Líder:</Text>
						<Text mb={2}>2025033811</Text>

						<Text fontWeight="bold">Integrantes:</Text>
						<Text mb={2}>2025033811, 2025000000</Text>

						<Flex
							mt={4}
							justify="space-between"
						>
							<EditTeamModal />
							<DeleteTeamButton />
						</Flex>
					</CardBody>
				</Card>

				{/* Información del Perfil */}
				<Card
					boxShadow="lg"
					borderRadius="md"
				>
					<CardHeader
						bg="#2B6CB0"
						color="white"
						p={4}
						borderRadius="md"
					>
						Información del Perfil
					</CardHeader>
					<CardBody p={4}>
						<Text fontWeight="bold">Nombre:</Text>
						<Text mb={2}>Juan Pérez</Text>

						<Text fontWeight="bold">Boleta:</Text>
						<Text mb={2}>202300001</Text>

						<Text fontWeight="bold">Estado:</Text>
						<Text
							fontSize="lg"
							fontWeight="bold"
							color="#38A169"
						>
							Regular
						</Text>

						<Flex
							mt={4}
							justify="space-between"
						>
							<EditProfileModal />
							<DeleteProfileButton />
						</Flex>
					</CardBody>
				</Card>

				{/* Información del Protocolo */}
				<Card
					boxShadow="lg"
					borderRadius="md"
				>
					<CardHeader
						bg="#2B6CB0"
						color="white"
						p={4}
						borderRadius="md"
					>
						Información del Protocolo
					</CardHeader>
					<CardBody p={4}>
						<Text fontWeight="bold">Líder del Equipo:</Text>
						<Text mb={2}>2025033811</Text>

						<Text fontWeight="bold">Título del Protocolo:</Text>
						<Text mb={2}>Real Madrid</Text>

						<Text fontWeight="bold">Academia:</Text>
						<Text mb={2}>ISC</Text>

						<Flex
							mt={4}
							justify="space-between"
						>
							<EditProtocolModal />
							<DeleteProtocolButton />
						</Flex>
					</CardBody>
				</Card>

				{/* Sinodales Asignados */}
				<Card
					boxShadow="lg"
					borderRadius="md"
				>
					<CardHeader
						bg="#2B6CB0"
						color="white"
						p={4}
						borderRadius="md"
					>
						Sinodales Asignados
					</CardHeader>
					<CardBody p={4}>
						<Text fontWeight="bold">Sinodal 1:</Text>
						<Text mb={2}>Patricia</Text>

						<Text fontWeight="bold">Sinodal 2:</Text>
						<Text mb={2}>Denisse</Text>

						<Text fontWeight="bold">Sinodal 3:</Text>
						<Text>Fernanda</Text>
					</CardBody>
				</Card>

				{/* Etapa del Protocolo */}
				<Card
					boxShadow="lg"
					borderRadius="md"
				>
					<CardHeader
						bg="#2B6CB0"
						color="white"
						p={4}
						borderRadius="md"
					>
						Etapa del Protocolo
					</CardHeader>
					<CardBody p={4}>
						<Text fontWeight="bold">Etapa Actual:</Text>
						<Text
							fontSize="lg"
							fontWeight="bold"
							color="#D69E2E"
						>
							Revisión
						</Text>
					</CardBody>
				</Card>

				{/* Actualizar Protocolo */}
				<Card
					boxShadow="lg"
					borderRadius="md"
				>
					<CardHeader
						bg="#2B6CB0"
						color="white"
						p={4}
						borderRadius="md"
					>
						Actualizar Protocolo
					</CardHeader>
					<CardBody p={4}>
						<Text fontWeight="bold">
							Sube un nuevo archivo PDF si es necesario.
						</Text>
						<Flex
							mt={4}
							justify="center"
						>
							<UpdateProtocolModal />
						</Flex>
					</CardBody>
				</Card>
			</Grid>
		</Box>
	);
};

export default DashboardStudent;
