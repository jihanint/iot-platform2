import type { ComponentStyleConfig } from "@chakra-ui/theme";

import { poppins } from "@/configs/fonts";

export const Heading: ComponentStyleConfig = {
  baseStyle: {
    fontFamily: poppins.style.fontFamily,
    fontWeight: 700,
    letterSpacing: "0px",
  },
  variants: {
    // General Heading
    900: {
      fontSize: "44px",
      lineHeight: "52px",
    },
    800: {
      fontSize: "36px",
      lineHeight: "44px",
    },
    700: {
      fontSize: "30px",
      lineHeight: "36px",
    },
    600: {
      fontSize: "24px",
      lineHeight: "32px",
    },
    500: {
      fontSize: "20px",
      lineHeight: "24px",
    },
    400: {
      fontSize: "16px",
      lineHeight: "20px",
    },
    300: {
      fontSize: "14px",
      lineHeight: "16px",
    },
    200: {
      fontSize: "12px",
      lineHeight: "16px",
    },
    100: {
      fontSize: "10px",
      lineHeight: "12px",
    },
  },
};

export default Heading;
