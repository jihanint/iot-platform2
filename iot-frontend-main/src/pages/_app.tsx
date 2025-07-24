/** Libs */
import type { ReactElement } from "react";
import { useEffect } from "react";

/** Types */
import type { AppProps } from "next/app";
import router from "next/router";
import { SessionProvider } from "next-auth/react";
import { NextSeo } from "next-seo";

// Components
import { Box, ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { RecoilRoot } from "recoil";

import { HydrationWrapper } from "@/common/layouts";
import { theme } from "@/configs/chakra/theme";
/** Configs */
import { NProgress, NProgressStyle } from "@/configs/nprogress";
const progress = NProgress.configure({ showSpinner: false });
const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps): ReactElement => {
  const handleRouteChangeComplete = () => progress.done();
  useEffect(() => {
    router.events.on("routeChangeStart", () => progress.start());
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", () => progress.done());
    return () => {
      router.events.off("routeChangeStart", () => progress.start());
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", () => progress.done());
    };
  }, []);

  // const [shouldRender, setShouldRender] = useState(!process.env.MOCK_ENABLED);
  // useEffect(() => {
  //   async function initMocks() {
  //     const { setupMocks } = await import("../mocks");
  //     await setupMocks();
  //     setShouldRender(true);
  //   }

  //   if (process.env.MOCK_ENABLED) {
  //     initMocks();
  //   }
  // }, []);

  // if (!shouldRender) {
  //   return null as any;
  // }

  return (
    <HydrationWrapper>
      <ChakraProvider theme={theme}>
        <NProgressStyle />
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <RecoilRoot>
              <NextSeo
                title="IoT Hub - Remote Monitoring System "
                description="IoT Hub - Remote Monitoring System: Efficiently track and manage your water resources with our cutting-edge remote monitoring technology. Ensure optimal water usage, detect issues early, and enhance sustainability with real-time data and insights."
                openGraph={{
                  images: [{ url: "/images/logo.png" }],
                }}
              />
              <Box className="app-container">
                <Component {...pageProps} />
              </Box>
            </RecoilRoot>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </SessionProvider>
      </ChakraProvider>
    </HydrationWrapper>
  );
};

export default App;
