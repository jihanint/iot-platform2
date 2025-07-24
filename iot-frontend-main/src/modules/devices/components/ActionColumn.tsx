import { useRef } from "react";

import { useRouter } from "next/router";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Center,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/common/hooks";
import { saveDevice } from "@/services/device";
type ActionColumnProps = { deviceId: number };

const ActionColumn = ({ deviceId }: ActionColumnProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const { push } = useRouter();
  return (
    <>
      <Button color="green" variant="link" onClick={() => push("/devices/edit/" + deviceId)}>
        Ubah
      </Button>
      <Center height="20px" mx={4}>
        <Divider orientation="vertical" borderColor={"blackAlpha"} />
      </Center>
      <Button color="red" variant="link" onClick={onOpen}>
        Delete
      </Button>
      <ModalDelete deviceId={deviceId} isOpen={isOpen} onClose={onClose} cancelRef={cancelRef} />
    </>
  );
};

export default ActionColumn;

const ModalDelete = ({ deviceId, isOpen, onClose, cancelRef }: any) => {
  const queryClient = useQueryClient();

  const toast = useToast();
  const { mutate } = useMutation({
    mutationFn: async () => {
      saveDevice({ device_id: -Math.abs(deviceId) })
        .then(() => {
          toast({
            title: "Success",
            status: "success",
            description: "Berhasil Hapus Device",
          });
          queryClient.invalidateQueries({ queryKey: ["get_device_list"] });
        })
        .catch(err =>
          toast({
            title: "Error",
            status: "error",
            description: err.response.data.message || err.message,
          })
        );
    },
  });

  const handleSubmit = () => {
    mutate();
    onClose();
  };
  return (
    <AlertDialog isCentered isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Hapus Desa
          </AlertDialogHeader>
          <AlertDialogBody>Apakah anda yakin ingin menghapus desa?</AlertDialogBody>
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
