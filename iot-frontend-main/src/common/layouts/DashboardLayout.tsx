import type { FC, PropsWithChildren } from "react";

import Head from "next/head";

import { Box, Drawer, DrawerContent, useDisclosure } from "@chakra-ui/react";

import Footer from "./Footer";
import Sidebar from "./Sidebar";
import TopNavigation from "./TopNavigation";

const DashboardContainer: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Head>{/* <meta name="viewport" content="width=1920" /> */}</Head>
      <Box as="main" minH="100vh">
        {/* For Desktop */}
        <Sidebar onClose={() => onClose} display={{ base: "none", lg: "flex" }} />

        {/* For Mobile */}
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent display={{ base: "block", lg: "none" }}>
            <Sidebar onClose={onClose} />
          </DrawerContent>
        </Drawer>
        <Box
          as="section"
          className="dashboard-content-wrapper"
          position="relative"
          ml={{ base: 0, lg: 72 }}
          minH="100vh"
          width={{ base: "100%", md: "100%", lg: `calc(100% - 300px)` }}
          overflow="hidden"
          bg="white"
        >
          <TopNavigation onOpenDrawer={onOpen} />
          <Box className="dashboard-content" pt="125px" pb={124}>
            {children}
            <Footer />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DashboardContainer;
