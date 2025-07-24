import React from "react";

import type { InputProps } from "@chakra-ui/react";
import { Box, Flex, Text } from "@chakra-ui/react";

export interface IInputContainerProps extends InputProps {
  children: React.ReactElement;
  label: string;
}

const InputContainer = ({ ...props }: IInputContainerProps) => {
  return (
    <Flex direction="column" w="full">
      <Box className="input-label">
        <Text fontWeight="semibold">{props.label}</Text>
      </Box>
      {props.children}
    </Flex>
  );
};

export default InputContainer;
