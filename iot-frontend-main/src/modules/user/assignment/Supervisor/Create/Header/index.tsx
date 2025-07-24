import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";

import { useRouter } from "next/router";

import { Button, Flex } from "@chakra-ui/react";

// TODO: Make global compoenent for create header
const UserAssignmentSupervisorCreateHeader = () => {
  const { back } = useRouter();
  return (
    <Flex mb={8} justify="space-between">
      <Button
        background="primary.1"
        color="primary.7"
        border="2px solid"
        borderColor="primary.7"
        size="sm"
        minH="40px"
        _active={{
          background: "primary.7",
          color: "white",
        }}
        _hover={{
          background: "primary.7",
          color: "white",
        }}
        leftIcon={<IoMdArrowRoundBack />}
        onClick={back}
      >
        Kembali
      </Button>
    </Flex>
  );
};

export default UserAssignmentSupervisorCreateHeader;
