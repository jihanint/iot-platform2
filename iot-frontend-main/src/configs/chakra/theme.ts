import type { ThemeConfig, ThemeOverride } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

import { poppins } from "@/configs/fonts";

import * as components from "./components";
import * as foundations from "./foundations";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme(<ThemeOverride>{
  breakpoints: {
    // xs: "420px",
    sm: "420ox",
    md: "500px",
    lg: "992px",
    xl: "1600px",
    // "2xl": "1980px",
  },
  ...foundations,
  components: {
    ...components,
  },
  styles: {
    global: {
      body: {
        fontSize: "body.4",
        color: "greydark.2",
        fontFamily: poppins.style.fontFamily,
      },
      ".absolute-xcenter": {
        left: "50%",
        transform: "translate(-50%, -50%)",
      },
    },
  },
  config,
});

type Theme = typeof theme;

export type { Theme };
export { theme };

// import { extendTheme, ThemeConfig, ThemeOverride, withDefaultColorScheme } from '@chakra-ui/react';
// import { mode } from '@chakra-ui/theme-tools';
// import { Container, Button, Heading, Text, TextStyle, Menu, Select, Input } from './theme';
// import { colors } from './theme/color';
// import { altMonoRegular, altMonoBold } from './theme/font';

// export const config: ThemeConfig = {
//   useSystemColorMode: false,
//   cssVarPrefix: 'kometh',
//   initialColorMode: 'dark',
// };

// type CustomColors = typeof colors;

// const theme = extendTheme(
//   <ThemeOverride>{
//     breakpoints: {
//       xs: '576px',
//       sm: '768px',
//       md: '992px',
//       lg: '1200px',
//       xl: '1441px',
//       '2xl': '1980px',
//     },
//     colors: { ...colors },
//     components: {
//       Container,
//       Heading,
//       Button,
//       Text,
//       Menu,
//       Select,
//       Input,
//       Drawer: {
//         variants: {
//           mobileDrawer: {
//             parts: ['dialogContainer'],
//             dialogContainer: {
//               display: { base: 'initial', md: 'none' },
//             },
//           },
//         },
//       },
//       Divider: {
//         baseStyle: {
//           background: colors.border.subdued,
//         },
//       },
//     },
//     fontSizes: {
//       xs: '16px',
//       md: '22px',
//       xl: '32px',
//       xxl: '48px',
//       '3.5xl': '2rem',
//       '6.5xl': '4rem',
//     },
//     fonts: {
//       heading: altMonoBold,
//       body: altMonoRegular,
//     },
//     styles: {
//       global: {
//         'html, body': {
//           bg: mode('#1A1819', '#FFFFFF'),
//           scrollBehavior: 'smooth',
//           MozOsxFontSmoothing: 'grayscale',
//           WebkitFontSmoothing: 'antialiased',
//           textRendering: 'optimizeLegibility',
//         },
//         '*, *::before, *::after': {
//           borderStyle: 'solid',
//         },
//         body: {
//           minWidth: { base: '100%', md: '100%' },
//           fontFamily: altMonoRegular,
//           overflowY: 'auto',
//           overflowX: 'hidden',
//         },
//         '.mx-auto': {
//           margin: '0 auto',
//         },
//         '.pos-absolute-xcenter': {
//           position: 'absolute',
//           left: '50%',
//           transform: 'translateX(-50%)',
//         },
//         '.pos-absolute-ycenter': {
//           position: 'absolute',
//           top: '50%',
//           transform: 'translateY(-50%)',
//         },
//         '.flex-full-center': {
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//         },
//         '.btn.btn-link': {
//           textDecoration: 'none !important',
//         },
//         '.icon.svg-stroke-white': {
//           path: {
//             stroke: 'white',
//           },
//         },
//         '.chakra-modal__content-container': {
//           width: '100% !important',
//           display: { base: 'flex', md: 'none' },
//         },

//         '.chakra-modal__overlay': {
//           background: 'rgba(27, 24, 25, 0.8) !important',
//         },
//         '.chakra-modal__content': {
//           background: '#1B1819 !important',
//           minWidth: { base: '100% !important', md: 'auto !important' },
//           // overflowX: { base: 'hidden !important', md: 'auto !important' },
//         },
//         '.swiper-landing': {
//           minWidth: '100%',
//           overflowY: 'visible !important',
//           padding: { base: '0px', lg: '85px !important' },
//         },
//         '.swiper-genre': {
//           overflowY: 'auto !important',
//           padding: 0,
//         },
//         '.swiper-genre > .swiper-wrapper > .swiper-slide': {
//           visibility: 'visible',
//           opacity: 1,
//         },
//         '.swiper-slide': {
//           visibility: 'hidden',
//           opacity: 0,
//           transition: 'visibility 0.3s linear,opacity 0.3s linear',
//         },
//         '.swiper-slide-visible, .swiper-slide-active': {
//           visibility: 'visible',
//           opacity: 1,
//         },
//         '.infinite-scroll-component': {
//           overflow: 'visible !important',
//         },

//         '.comic-image, .comic-image::before, .comic-image::after': {
//           pointerEvents: 'none',
//           userSelect: 'none',
//         },
//         '.modal-content-box-overflow::-webkit-scrollbar': {
//           display: 'none !important',
//         },
//       },
//     },
//     sizes: {
//       container: {
//         lg: '1080px',
//         '2xl': '1440px',
//         '3xl': '1920px',
//       },
//     },
//     textStyles: {
//       ...TextStyle,
//     },
//     config,
//   },

//   withDefaultColorScheme({
//     colorScheme: 'blackAlpha',
//   }),
// );
// type CustomTheme = typeof theme & CustomColors;
// export type { CustomTheme };
// export { theme };
