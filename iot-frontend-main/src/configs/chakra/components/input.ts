import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys);

const variants = {
  commonTextInput: definePartsStyle(props => ({
    field: {
      height: "50px",
      alignItems: "center",
      background: props.background || "transparent",
      fontSize: "14px",
      color: "#000000",
      border: "1px solid",
      borderColor: "#E0E2E9",
      paddingY: "20px",
      _placeholder: {
        color: "#969AB8",
      },
    },
  })),
};

export const Input = defineMultiStyleConfig({ variants });
