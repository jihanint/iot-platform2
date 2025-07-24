import Image from "next/image";
import Link from "next/link";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import type { IRegisterFormContentProps } from "./Form";
import RegisterFormContent from "./Form";

export interface IModuleAuthRegisterProps extends IRegisterFormContentProps {}

const ModuleAuthRegister = ({ ...props }: IModuleAuthRegisterProps) => {
  return (
    <Flex as="section" className="register-page" bg="#FFFFFF" w="full" h="100vh">
      <Flex
        className="signup-content"
        position="relative"
        flexDir="column"
        w={{ base: "100%", md: "30%" }}
        justify="center"
        px={{ base: 8, md: 12 }}
        py={{ base: 10, md: 25 }}
      >
        <Box position="relative" width="140px" height="55px" mb="8vh">
          <Image src="/svg/app-logo.svg" alt="app-logo" fill />
        </Box>
        <Heading mb="40px">Daftar Sekarang</Heading>

        <RegisterFormContent onSubmit={props.onSubmit} submitLoading={props.submitLoading} />

        {/* TODO: Implement social login */}
        {/* <Flex className="divider" align="center" columnGap={3} marginY="24px">
          <Divider />
          <Text size="lg" color="greymed.2">
            atau
          </Text>
          <Divider />
        </Flex>

        <Flex className="social-auth" justify="center" columnGap={4} mb={12}>
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

        <Box display="flex" position="relative" justifyContent="center" mt={12}>
          <Text mr={2} color="#969AB8">
            Sudah menjadi anggota?{" "}
          </Text>{" "}
          <Link href="/auth/login">
            <Text variant="link-primary">Masuk</Text>
          </Link>
        </Box>
      </Flex>
      <Box position="relative" w={{ base: "0", md: "70%" }} h="100%">
        <Image src="/images/painting.jpeg" alt="signup" fill />
      </Box>
    </Flex>
  );
};

export default ModuleAuthRegister;
