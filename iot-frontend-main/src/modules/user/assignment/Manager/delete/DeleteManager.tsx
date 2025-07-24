import { useRef } from "react";
import { BiTrash } from "react-icons/bi";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";

import useFetchAssignmentData from "@/pages/user/assignment/useFetchAssignmentData";
type ActionColumnProps = { userId: number; role: string };

const DeleteManager = ({ userId, role = "Manager" }: ActionColumnProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  return (
    <>
      <IconButton
        color={"red"}
        icon={<BiTrash />}
        variant={"outline"}
        w={8}
        h={8}
        minW={8}
        minH={8}
        aria-label="edit"
        p={0}
        onClick={onOpen}
      />
      <ModalDelete userId={userId} role={role} isOpen={isOpen} onClose={onClose} cancelRef={cancelRef} />
    </>
  );
};

export default DeleteManager;

const ModalDelete = ({ userId, isOpen, onClose, cancelRef, role }: any) => {
  const { handleDeleteUserAssignment } = useFetchAssignmentData();

  const handleSubmit = () => {
    handleDeleteUserAssignment({ user_id: parseInt("-" + userId) });
    onClose();
  };
  return (
    <AlertDialog isCentered isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Hapus {role}
          </AlertDialogHeader>
          <AlertDialogBody>Apakah anda yakin ingin menghapus {role}?</AlertDialogBody>
          <AlertDialogFooter>
            <Button variant="secondary" ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" bgColor="red" onClick={handleSubmit} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
