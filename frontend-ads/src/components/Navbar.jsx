import {
	Box,
	Flex,
	Button,
	Link,
	Spacer,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
	Image,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const Navbar = () => {
	const userRole = 'student'; // Cambiar el rol del usuario

	return (
		<Flex
			bg="#2B6CB0"
			p={4}
			align="center"
			color="white"
			boxShadow="md"
		>
			<Box>
				<Image
					src="/images/CATT.jpeg"
					alt="CATT"
					boxSize="60px"
					objectFit="cover"
				/>
			</Box>
			<Spacer />

			{/* Menú para ADMIN */}
			{userRole === 'admin' && (
				<Flex display={{ base: 'none', md: 'flex' }}>
					<Link
						href="/admin/dashboard"
						mx={2}
						fontWeight="bold"
					>
						Dashboard
					</Link>
					<Link
						href="/admin/users"
						mx={2}
						fontWeight="bold"
					>
						Usuarios
					</Link>
					<Link
						href="/admin/teams"
						mx={2}
						fontWeight="bold"
					>
						Equipos
					</Link>
					<Link
						href="/admin/assign-judges"
						mx={2}
						fontWeight="bold"
					>
						Asignar Sinodales
					</Link>
					<Link
						href="/admin/evaluations"
						mx={2}
						fontWeight="bold"
					>
						Calificaciones
					</Link>
				</Flex>
			)}

			{/* Menú para ESTUDIANTE */}
			{userRole === 'student' && (
				<Flex display={{ base: 'none', md: 'flex' }}>
					<Link
						href="/student/dashboard"
						mx={2}
						fontWeight="bold"
					>
						Dashboard
					</Link>
					<Link
						href="/student/create-team"
						mx={2}
						fontWeight="bold"
					>
						Crear Equipo
					</Link>
				</Flex>
			)}

			{/* Menú desplegable para pantallas pequeñas */}
			<Menu>
				<MenuButton
					as={IconButton}
					icon={<HamburgerIcon />}
					display={{ base: 'block', md: 'none' }}
					variant="outline"
					color="white"
					bg="#2B6CB0"
				/>
				<MenuList>
					{userRole === 'admin' && (
						<>
							<MenuItem
								as="a"
								href="/admin/dashboard"
							>
								Dashboard
							</MenuItem>
							<MenuItem
								as="a"
								href="/admin/users"
							>
								Usuarios
							</MenuItem>
							<MenuItem
								as="a"
								href="/admin/teams"
							>
								Equipos
							</MenuItem>
							<MenuItem
								as="a"
								href="/admin/assign-judges"
							>
								Asignar Sinodales
							</MenuItem>
							<MenuItem
								as="a"
								href="/admin/evaluations"
							>
								Calificaciones
							</MenuItem>
						</>
					)}
					{userRole === 'student' && (
						<>
							<MenuItem
								as="a"
								href="/student/dashboard"
							>
								Dashboard
							</MenuItem>
							<MenuItem
								as="a"
								href="/student/create-team"
							>
								Crear Equipo
							</MenuItem>
						</>
					)}
				</MenuList>
			</Menu>

			<Button
				colorScheme="red"
				ml={4}
				size="sm"
			>
				Cerrar Sesión
			</Button>
		</Flex>
	);
};

export default Navbar;
