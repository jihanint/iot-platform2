import React from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import Link from "next/link";

interface CheckEmailProps {
  setNextStep?: (step: string) => void;
}

const CheckEmail = ({ setNextStep }: CheckEmailProps) => {
  const onClickEmailApp = () => {
    setNextStep?.("RESET_PASSWORD");
  };
  return (
    <>
      <Button w="full" mb="40px" onClick={onClickEmailApp}>
        Buka aplikasi email
      </Button>
      <Box display="flex" position="relative" justifyContent="center">
        <Text mr={2} color="#969AB8">
          Tidak menerima email?
        </Text>{" "}
        <Link href="#">
          <Text variant="link-primary">Klik untuk mengirim ulang</Text>
        </Link>
      </Box>
    </>
  );
};

export default CheckEmail;
