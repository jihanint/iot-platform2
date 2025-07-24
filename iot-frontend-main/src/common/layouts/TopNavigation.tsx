import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrCircleInformation } from "react-icons/gr";

import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";

// Recoil
import { UserActionBox } from "@/common/components";
import { useLayoutState } from "@/common/hooks";

import NotificationDrawer from "../components/NotificationDrawer";

interface TopNavigationProps {
  onOpenDrawer: () => void;
}
const TopNavigation = ({ onOpenDrawer }: TopNavigationProps) => {
  const { breadCrumb, topNavShadow } = useLayoutState();

  return (
    <Flex
      as="nav"
      bg="#FFFFFF"
      shadow={topNavShadow}
      flexDir="column"
      p={5}
      w="fill-available"
      position="fixed"
      zIndex={4}
    >
      <Flex className="nav" justifyContent="flex-end" align="center" gap={4} mb={{ base: 8, md: 4 }}>
        <Box p="5px" onClick={onOpenDrawer} mr="auto" display={{ base: "block", lg: "none" }}>
          <GiHamburgerMenu fontSize="25px" />
        </Box>
        <NotificationDrawer
          button={
            <IconButton
              size="sm"
              justifyContent="center"
              alignItems="center"
              variant="ghost"
              color="white"
              aria-label="alert-icon"
              icon={<GrCircleInformation fontSize="25px" color="black" />}
            />
          }
        />

        <UserActionBox />
      </Flex>
      <Box className="breadcrumb">
        <Heading fontSize="heading.4" fontWeight="semibold">
          {breadCrumb}
        </Heading>
      </Box>
    </Flex>
  );
};

export default TopNavigation;
