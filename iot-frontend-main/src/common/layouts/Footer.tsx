import React from "react";

import Link from "next/link";

import { Flex, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex
      pos="absolute"
      direction={{ base: "column", md: "row" }}
      justify="space-between"
      align="center"
      bottom="0"
      px={12}
      py={{ base: 26, md: 8 }}
      w="full"
      textAlign="center"
      mt={{ base: 100, md: "initial" }}
    >
      <Text mb={{ base: 2, md: "initial" }}>
        Hak Cipta &copy; 2023 Yayasan IoT Platform Indonesia. Seluruh hak cipta dilindungi.
      </Text>
      <Flex gap={5}>
        <Text variant="link-primary" align="center">
          <Link href="#">Lisensi</Link>
        </Text>
        <Text variant="link-primary" align="center">
          <Link href="#">Syarat & Ketentuan Layanan</Link>
        </Text>
        <Text variant="link-primary" align="center">
          <Link href="#">Kebijakan Privasi</Link>
        </Text>
      </Flex>
    </Flex>
  );
};

export default Footer;
