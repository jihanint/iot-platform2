import { IoMdArrowRoundBack } from "react-icons/io";

import Image from "next/image";
import { useRouter } from "next/router";

import { Box, Button, Flex, Heading, Link, Text } from "@chakra-ui/react";

interface VerifyNotesProps {
  email: string;
}

const VerifyNotes = ({ email }: VerifyNotesProps) => {
  const { push } = useRouter();

  return (
    <Flex
      className="verify-box"
      position="relative"
      as="div"
      width="586px"
      minH="600px"
      bg="#FFFFFF"
      flexDir="column"
      p={10}
      px={{ base: 5, md: 20 }}
      pt={12}
      mt={24}
      shadow={{ base: "none", md: "lg" }}
      borderRadius="14px"
      textAlign="center"
    >
      <Box position="relative" width="200px" height="80px" mb="35px" marginX="auto">
        <Image src="/svg/tick.svg" alt="tick-icon" fill />
      </Box>

      <Heading mb="40px">Verifikasi Akun Anda</Heading>

      <Text mb="40px">
        Tindakkan ini memerlukan verifikasi email. Silahkan cek kotak masuk anda dan ikuti petunjuknya.
      </Text>

      {email && (
        <Box className="sent-info" mb="40px">
          <Text>Email telah dikirim ke</Text>
          <Text fontWeight="bold">{email}</Text>
        </Box>
      )}

      <Button onClick={() => push("/auth/login")}>Lanjut</Button>

      <Box position="absolute" className="absolute-xcenter" bottom="5%" display="flex">
        <IoMdArrowRoundBack fontSize={22} color="#0062FF" />
        <Text variant="link-primary" align="center" ml={2}>
          <Link onClick={() => push("/auth/register")}>Kembali ke Daftar</Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default VerifyNotes;
