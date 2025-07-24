import type { ComponentStyleConfig } from "@chakra-ui/theme";

// You can also use the more specific type for
// a single part component: ComponentSingleStyleConfig
const Button: ComponentStyleConfig = {
  // The styles all button have in common
  baseStyle: {
    fontSize: "body.3",
    fontWeight: "normal",
    lineHeight: "16",
    minW: 24,
    minH: 50,
    px: 4,
    py: 2,
    borderRadius: "md",
    _disabled: {
      pointerEvents: "none",
      opacity: 0.3,
    },
    _hover: {
      _disabled: {
        opacity: 0.3,
      },
    },
    _active: {
      _disabled: {
        opacity: 0.3,
      },
    },
    _loading: {
      opacity: 0.7,
    },
  },
  sizes: {
    lg: {
      fontSize: "body.3",
      lineHeight: "20",
      letterSpacing: "0",
      fontWeight: "normal",
      h: 12,
    },
    md: {
      fontSize: "body.4",
      lineHeight: "16",
      letterSpacing: "0",
      fontWeight: "normal",
      h: 10,
    },
    sm: {
      fontSize: "body.4",
      lineHeight: "16",
      letterSpacing: "0",
      fontWeight: "normal",
      maxH: "35px",
      minH: "35px",
    },
    xs: {
      fontSize: "body.4",
      lineHeight: "16",
      letterSpacing: "0",
      fontWeight: "normal",
      h: 6,
    },
  },
  // Two variants: outline and solid
  variants: {
    solid: {
      color: "greylight.1",
      bg: "primary.7",
      _disabled: {
        opacity: 1,
        bg: "greylight.4",
      },
      _hover: {
        _disabled: {
          bg: "greylight.2",
        },
        bg: "primary.6",
      },
      _active: {
        bg: "primary.7",
      },
      _focus: {
        bg: "primary.7",
      },
    },
    secondary: {
      color: "greydark.2",
      bg: "greylight.3",
      _disabled: {
        bg: "greylight.2",
      },
      _hover: {
        bg: "greylight.4",
      },
      _active: {
        bg: "greylight.3",
      },
      _focus: {
        bg: "greylight.3",
      },
    },
    outline: {
      color: "primary.5",
      borderWidth: 1,
      borderStyle: "inside",
      borderColor: "primary.5",
      _hover: {
        bg: "primary.1",
      },
      _active: {
        bg: "primary.1",
      },
      _focus: {
        bg: "primary.1",
      },
    },
    "outline-secondary": {
      color: "greydark.2",
      bg: "greylight.1",
      borderWidth: 1,
      borderStyle: "inside",
      borderColor: "greylight.5",
      _disabled: {
        bg: "greylight.2",
      },
      _hover: {
        bg: "greylight.2",
      },
      _active: {
        bg: "greylight.2",
      },
      _focus: {
        bg: "greylight.2",
      },
    },
    ghost: {
      color: "primary.5",
      _disabled: {
        bg: "primary.1",
      },
    },
    link: {
      bg: "transparent",
      color: "primary.5",
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "solid",
    orientation: "vertical",
    colorScheme: "primary",
  },
};

export default Button;
