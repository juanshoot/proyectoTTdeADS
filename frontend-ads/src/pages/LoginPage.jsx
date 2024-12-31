import { Box, Button, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simular inicio de sesión (debe conectarse con el backend)
    const userData = {
      role: "ADMIN", // Este dato debe provenir de la API
      name: "Administrador",
    };
    login(userData);
    navigate("/admin/dashboard"); // Redirigir según el rol
  };

  return (
    <Box p={8} maxW="400px" mx="auto">
      <Text fontSize="2xl" mb={6} fontWeight="bold">
        Iniciar Sesión
      </Text>
      <FormControl id="email" mb={4}>
        <FormLabel>Correo Electrónico</FormLabel>
        <Input type="email" placeholder="Ingrese su correo" />
      </FormControl>
      <FormControl id="password" mb={4}>
        <FormLabel>Contraseña</FormLabel>
        <Input type="password" placeholder="Ingrese su contraseña" />
      </FormControl>
      <Button colorScheme="blue" width="full" onClick={handleLogin}>
        Iniciar Sesión
      </Button>
    </Box>
  );
};

export default LoginPage;
