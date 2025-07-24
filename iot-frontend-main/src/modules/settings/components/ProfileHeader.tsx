import React from "react";

import Image from "next/image";

import { Avatar, Box, Flex } from "@chakra-ui/react";

const ProfileHeader = () => (
  <Flex direction="column" align="flex-end" w="full" position="relative" h="300px">
    <Box position="relative" h="235px" w="100%">
      <Image src="/images/painting.jpeg" alt="image" fill />
    </Box>
    <Box
      className="profile-box"
      position="absolute"
      bottom={{ base: "-60px", md: "5px" }}
      left={{ base: "50%", md: "35px" }}
      transform={{ base: "translate(-50%, -50%)", md: "initial" }}
      borderRadius="100%"
      border="7px solid"
      borderColor="white"
    >
      <Avatar src="/images/profile-placeholder.png" w="120px" h="120px" />
    </Box>
    {/* TODO: Update Profile */}
    {/* <Flex className="action-box" my="auto" px={12} gap={2}>
      <Button size="sm" variant="outline-secondary">
        Batalkan
      </Button>
      <Button size="sm">Simpan</Button>
    </Flex> */}
  </Flex>
);

export default ProfileHeader;
