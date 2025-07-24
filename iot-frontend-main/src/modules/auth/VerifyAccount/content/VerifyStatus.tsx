import Image from "next/image";
import { useRouter } from "next/router";

import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";

type VerifyStatusProps = {
  isVerifing?: boolean;
  errorMsg?: string;
  isVerified: boolean | null;
};

const VerifyStatus = ({ isVerifing, isVerified, errorMsg }: VerifyStatusProps) => {
  const { push } = useRouter();

  const navigateToLoginPage = () => {
    push("/auth/login");
  };

  return (
    <Flex w="100%" h="100vh" justify="center" align="center" direction="column" pt="100px">
      {isVerifing && (
        <Flex align="center">
          <Spinner size="md" />
          <Heading mb={4}>Memverifikasi Akun</Heading>
        </Flex>
      )}
      {!isVerifing && typeof isVerified === "boolean" && (
        <Flex>
          <Heading mb={4}>{isVerified ? "Email telah terverifikasi" : "Gagal memverifikasi email"}</Heading>
        </Flex>
      )}

      <Box position="relative" width={{ base: "90vw", md: "40vw" }} height="35vh" mb={10}>
        <Image src="/images/indonesia-photo.jpeg" fill alt="photography" />
      </Box>

      <Flex
        align="center"
        direction="column"
        px={4}
        justify="center"
        textAlign="center"
        w={{ base: "100%", md: "40%" }}
        rowGap="20px"
      >
        {!isVerifing && isVerified && (
          <Text>
            Email kamu telah berhasil diverifikasi, silakan menunggu 3x24 jam untuk admin memberikan akses informasi
            desa.
          </Text>
        )}

        {errorMsg && <Text>{errorMsg}</Text>}

        <Button onClick={navigateToLoginPage}>Masuk ke halaman utama</Button>
        <Text>Terima Kasih,</Text>
        <Text fontWeight="bold">Tim iothub</Text>
      </Flex>
    </Flex>
  );
};

export default VerifyStatus;
