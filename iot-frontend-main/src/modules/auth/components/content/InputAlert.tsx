import React from "react";
import { FiAlertCircle } from "react-icons/fi";

import { Flex, IconButton, Text } from "@chakra-ui/react";

type InputAlertProps = {
  message: string;
};

const InputAlert = ({ message }: InputAlertProps) => {
  return (
    <Flex className="input-alert" bg="#FF3A29" p="1px" align="center" borderRadius={4} mb={4}>
      <IconButton variant="ghost" color="white" aria-label="alert-icon" icon={<FiAlertCircle fontSize="20px" />} />
      <Text color="white">{message}</Text>
    </Flex>
  );
};

export default InputAlert;
