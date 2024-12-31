// EditProfileModal.js
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	FormControl,
	FormLabel,
	Input,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';

const EditProfileModal = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	const handleSave = () => {
		toast({
			title: 'Perfil actualizado.',
			description: 'Tu información ha sido guardada exitosamente.',
			status: 'success',
			duration: 5000,
			isClosable: true,
		});
		onClose();
	};

	return (
		<>
			<Button
				colorScheme="blue"
				onClick={onOpen}
			>
				Editar Perfil
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Editar Perfil</ModalHeader>
					<ModalBody>
						<FormControl>
							<FormLabel>Nombre</FormLabel>
							<Input placeholder="Tu nombre" />
						</FormControl>
						<FormControl mt={4}>
							<FormLabel>Boleta</FormLabel>
							<Input placeholder="Tu boleta" />
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={handleSave}
						>
							Guardar
						</Button>
						<Button onClick={onClose}>Cancelar</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default EditProfileModal;
