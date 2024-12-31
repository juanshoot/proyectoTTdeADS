import React from 'react';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
	<React.StrictMode>
		<ChakraProvider>
			<AuthProvider>
				<App />
			</AuthProvider>
		</ChakraProvider>
	</React.StrictMode>
);
