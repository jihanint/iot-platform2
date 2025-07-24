import { BiLogOut } from "react-icons/bi";
import { GrClose } from "react-icons/gr";

import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";

import type { BoxProps } from "@chakra-ui/react";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";

import { ADMIN_MENU, MANAGER_MENU } from "@/constants/menus";

// Components
import SidebarItem from "./SidebarItem";
import SidebarItemWithSubMenu from "./SidebarItemWithSubMenu";

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const Sidebar = ({ onClose, ...rest }: SidebarProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Flex
      className="sidebar"
      position="fixed"
      flexDir="column"
      transition="3s ease"
      bg="#FFFFFF"
      shadow="lg"
      w={{ base: "full", lg: 72 }}
      h="100%"
      pb={20}
      pt="12px"
      zIndex={5}
      overflowY="auto"
      {...rest}
    >
      <Flex
        h="34px"
        w="34px"
        justifyContent="center"
        alignItems="center"
        display={{ base: "flex", lg: "none" }}
        position="absolute"
        cursor="pointer"
        right={5}
        top={5}
        bg="greylight.4"
        borderRadius={4}
        onClick={onClose}
      >
        <GrClose />
      </Flex>
      <Box pos="relative" w="150px" minH="50px" mb="20px" mx={4}>
        <Image alt="logo" src="/images/logo.png" fill />
      </Box>
      {(session?.user?.roles?.includes("admin") ? ADMIN_MENU : MANAGER_MENU).map((menu, index) =>
        menu.subMenu ? (
          <SidebarItemWithSubMenu key={index} href={menu.path} icon={menu.icon} menus={menu.subMenu}>
            {menu.label}
          </SidebarItemWithSubMenu>
        ) : (
          <SidebarItem key={index} href={menu.path} icon={menu.icon}>
            {menu.label}
          </SidebarItem>
        )
      )}

      {/* Logout Button */}
      <Flex
        marginTop="auto"
        p={4}
        mx={4}
        cursor="pointer"
        align="center"
        borderRadius="lg"
        _hover={{
          bg: "primary.7",
          color: "greylight.1",
        }}
        onClick={() => signOut({ redirect: false }).then(() => router.replace("/auth/login"))}
      >
        <Icon
          mr={4}
          fontSize={20}
          _groupHover={{
            color: "greylight.1",
          }}
          as={BiLogOut}
        />
        <Text>Log Out</Text>
      </Flex>
    </Flex>
  );
};

export default dynamic(() => Promise.resolve(Sidebar), {
  ssr: false,
});
