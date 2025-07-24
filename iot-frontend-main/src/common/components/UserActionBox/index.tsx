import React from "react";
import { FaChevronDown, FaUser } from "react-icons/fa";

import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

import { Avatar, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";

const UserActionBox = () => {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <Menu>
      <MenuButton mr={{ base: 0, lg: 8 }}>
        <Flex
          className="user-actionbox-wrapper"
          align="center"
          justify="space-between"
          border="1px solid"
          borderColor="greylight.5"
          borderRadius="md"
          w="185px"
          px={4}
          py={2}
        >
          <Flex align="center">
            <Avatar
              bg={session?.user.roles.includes("admin") ? "#F3B664" : "blue.9"}
              size="sm"
              icon={<FaUser fontSize="1rem" />}
            />
            <Text textAlign={"start"} noOfLines={1} ml={2} fontSize="body.4">
              {session?.user ? `${session?.user.first_name} ${session?.user?.last_name}.` : ""}
            </Text>
          </Flex>
          <FaChevronDown fontSize="1rem" />
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem>Profile</MenuItem>

        <MenuItem onClick={() => signOut({ redirect: false }).then(() => router.replace("/auth/login"))}>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserActionBox;
