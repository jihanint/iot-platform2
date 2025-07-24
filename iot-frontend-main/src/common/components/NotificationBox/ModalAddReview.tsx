import React, { useState } from "react";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";

import type { IModalProps } from "@/interfaces/modal";

interface IModalAddReviewProps extends IModalProps {
  onClick: (message: string) => void;
}

const ModalAddReview = ({ ...props }: IModalAddReviewProps) => {
  const [message, setMessage] = useState("");
  return (
    <Modal isCentered onClose={props.onClose} isOpen={props.isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tinjau Peringatan</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={1}>
          <FormControl>
            <FormLabel>Tinjauan</FormLabel>
            <Textarea onChange={e => setMessage(e.target.value)} placeholder="Masukkan Tinjauan" />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button size={"sm"} variant={"secondary"} mr={3} onClick={props.onClose}>
            Tutup
          </Button>
          <Button onClick={() => props.onClick(message)} size={"sm"} variant="solid">
            Tambah Tinjauan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalAddReview;
