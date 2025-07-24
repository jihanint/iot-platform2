import colors from "./colors";

const fonts = {
  inter: `'Inter', sans-serif`,
};

const fontWeights = {
  hairline: 100,
  thin: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

const lineHeights = {
  normal: "normal",
  none: 1,
  shorter: 1.25,
  short: 1.375,
  base: 1.5,
  tall: 1.625,
  52: "52px",
  44: "44px",
  36: "36px",
  32: "32px",
  28: "28px",
  24: "24px",
  20: "20px",
  16: "16px",
};

const fontSizes = {
  heading: {
    1: "44px",
    2: "36px",
    3: "30px",
    4: "24px",
    5: "20px",
    6: "16px",
    7: "14px",
    8: "12px",
  },
  body: {
    1: "24px",
    2: "20px",
    3: "16px",
    4: "15px",
    5: "12px",
    6: "10px",
  },
};

const heading = {
  1: {
    fontSize: fontSizes.heading[1],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[52],
    letterSpacing: "0",
  },
  2: {
    fontSize: fontSizes.heading[2],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[44],
    letterSpacing: "0",
  },
  3: {
    fontSize: fontSizes.heading[3],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[36],
    letterSpacing: "0",
  },
  4: {
    fontSize: fontSizes.heading[4],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[32],
    letterSpacing: "0",
  },
  5: {
    fontSize: fontSizes.heading[5],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[24],
    letterSpacing: "0",
  },
  6: {
    fontSize: fontSizes.heading[6],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[20],
    letterSpacing: "0",
  },
  7: {
    fontSize: fontSizes.heading[7],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[16],
    letterSpacing: "0",
  },
  8: {
    fontSize: fontSizes.heading[8],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[16],
    letterSpacing: "0",
  },
};

const body = {
  1: {
    fontSize: fontSizes.body[1],
    lineHeight: lineHeights[36],
    letterSpacing: "0",
  },
  2: {
    fontSize: fontSizes.body[2],
    lineHeight: lineHeights[32],
    letterSpacing: "0",
  },
  3: {
    fontSize: fontSizes.body[3],
    lineHeight: lineHeights[28],
    letterSpacing: "0",
  },
  4: {
    fontSize: fontSizes.body[4],
    lineHeight: lineHeights[24],
    letterSpacing: "0",
  },
  5: {
    fontSize: fontSizes.body[5],
    lineHeight: lineHeights[20],
    letterSpacing: "0",
  },
};

const label = {
  1: {
    fontSize: fontSizes.heading[6],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[20],
    letterSpacing: "0",
    color: colors.greymed[4],
  },
};

const button = {
  lg: {
    fontSize: fontSizes.body[3],
    lineHeight: lineHeights[20],
    letterSpacing: "0",
    fontWeight: fontWeights.normal,
  },
  md: {
    fontSize: fontSizes.body[4],
    lineHeight: lineHeights[16],
    letterSpacing: "0",
    fontWeight: fontWeights.normal,
  },
  sm: {
    fontSize: fontSizes.body[5],
    lineHeight: lineHeights[16],
    letterSpacing: "0",
    fontWeight: fontWeights.normal,
  },
};

const textStyles = {
  heading,
  body,
  button,
  label,
};

export { fonts, fontSizes, fontWeights, lineHeights, textStyles };
