import React, { useMemo } from "react";

import type { BoxProps, TextProps } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";

interface FormWarningProps extends TextProps {
  type: "warning" | "error" | "info" | "success";
  boxProps?: BoxProps;
  message?: string;
}

const FormWarning = (props: FormWarningProps) => {
  const textColor: string = useMemo(() => {
    switch (props.type) {
      case "error":
        return "red";
      case "info":
        return "blue";
      case "success":
        return "green";
      case "warning":
        return "yellow";
      default:
        return "";
    }
  }, [props.type]);
  return (
    <Box py={2} {...props.boxProps}>
      <Text textAlign="left" color={textColor} {...props}>
        {props.message}
      </Text>
    </Box>
  );
};

export default FormWarning;
