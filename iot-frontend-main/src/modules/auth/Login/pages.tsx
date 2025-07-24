import React from "react";

import Image from "next/image";
import Link from "next/link";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import LoginFormContent from "./Form";
import type { ILoginFormContentProps } from "./Form/";

export interface IModuleAuthLoginProps extends ILoginFormContentProps {}

const ModuleAuthLogin = ({ ...props }: IModuleAuthLoginProps) => {
  return (
    <Flex as="section" className="login-page" bg="#FFFFFF" w="full" h="100vh" justify="center" align="center">
      <Box position="absolute" top="10%">
        <Box position="relative" width="150px" height="55px">
          <Image src="/svg/app-logo.svg" alt="app-logo" fill />
        </Box>
      </Box>
      <Flex
        className="login-box"
        as="div"
        width="586px"
        minH="300px"
        bg="#FFFFFF"
        flexDir="column"
        p={10}
        px={{ base: 8, md: 20 }}
        shadow={{ base: "none", md: "lg" }}
        borderRadius="14px"
      >
        <Heading textAlign="center" mb="40px">
          Masuk
        </Heading>
        {/* Form Content */}
        <LoginFormContent {...props} />
        {/* Forgot password text */}
        <Text variant="link-primary" align="center" mt="28px">
          <Link href="/auth/forgot-password">Lupa kata sandi?</Link>
        </Text>
        {/* TODO: Implement social login */}
        {/* <Flex className="divider" align="center" columnGap={3} marginY="24px">
          <Divider />
          <Text size="lg" color="greymed.2">
            atau
          </Text>
          <Divider />
        </Flex>

        <Flex className="social-auth" justify="center" columnGap={4}>
          <Button variant="outline-secondary" w="150px">
            <Box position="relative" width="50px" height="100%">
              <Image src="/svg/facebook.svg" alt="facebook" fill />
            </Box>
            <Text fontWeight="bold">Facebook</Text>
          </Button>
          <Button variant="outline-secondary" w="150px">
            <Box position="relative" width="50px" height="100%">
              <Image src="/svg/google.svg" alt="google" fill />
            </Box>
            <Text fontWeight="bold">Google</Text>
          </Button>
        </Flex> */}
      </Flex>

      {/* Already have account text */}
      <Box position="absolute" bottom="8%">
        <Box display="flex" position="relative">
          <Text mr={2} color="#969AB8">
            Tidak memiliki akun?
          </Text>
          <Link href="/auth/register">
            <Text variant="link-primary">Daftar sekarang</Text>
          </Link>
        </Box>
      </Box>
    </Flex>
  );
};

export default ModuleAuthLogin;
