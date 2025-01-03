import { Box, Button, Flex, VStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';

const AuthPage = () => {
	const [isLogin, setIsLogin] = useState(true);

	const toggleForm = () => {
		setIsLogin(!isLogin);
	};

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
				<Text
					fontSize="3xl"
					fontWeight="bold"
					color="#2B6CB0"
				>
					{isLogin ? 'Iniciar Sesión' : 'Registro de Usuario'}
				</Text>
			</Flex>
			<VStack
				spacing={6}
				align="stretch"
				bg="white"
				p={6}
				borderRadius="md"
				boxShadow="lg"
			>
				{isLogin ? <LoginPage /> : <RegistrationPage />}
				<Button
					variant="link"
					colorScheme="blue"
					onClick={toggleForm}
					alignSelf="center"
				>
					{isLogin
						? '¿No tienes una cuenta? Regístrate'
						: '¿Ya tienes una cuenta? Inicia sesión'}
				</Button>
			</VStack>
		</Box>
	);
};

export default AuthPage;
