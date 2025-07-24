import { ComponentStyleConfig } from "@chakra-ui/theme";

export const TextVariantList = {
  // General Text (Body)
  600: {
    fontSize: "24px",
    lineHeight: "36px",
  },
  500: {
    fontSize: "20px",
    lineHeight: "32px",
  },
  400: {
    fontSize: "16px",
    lineHeight: "28px",
  },
  300: {
    fontSize: "14px",
    lineHeight: "24px",
  },
  200: { fontSize: "12px", lineHeight: "20px" },
  100: { fontSize: "10px", lineHeight: "12px" },

  "link-primary": {
    fontWeight: "bold",
    color: "#0062FF",
    fontSize: "15px",
  },
};

export const Text: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 400,
    letterSpacing: "0px",
  },
  variants: { ...TextVariantList },
};

export default Text;
