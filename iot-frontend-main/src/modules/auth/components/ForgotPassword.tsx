import { useEffect, useMemo, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

import { isObjEmpty } from "@/utils/helper";

import { CheckEmail, InputEmail, ResetPassword } from "./content";

enum Steps {
  INPUT_EMAIL = "INPUT_EMAIL",
  CHECK_EMAIL = "CHECK_EMAIL",
  RESET_PASSWORD = "RESET_PASSWORD",
  RESET_PASSWORD_SUCCESS = "RESET_PASSWORD_SUCCESS",
}
const ForgotPassword = () => {
  const { query, replace } = useRouter();
  const steps = Object.values(Steps);
  const [activeStep, setActiveStep] = useState<Steps>(Steps.INPUT_EMAIL);

  useEffect(() => {
    if (!isObjEmpty(query)) {
      const { status } = query as any;
      if (status && steps.includes(status.toUpperCase())) {
        setActiveStep(status.toUpperCase());
      }
    }
  }, [query]);

  const renderTextContent = useMemo(() => {
    switch (activeStep) {
      case "INPUT_EMAIL":
        return {
          heading: "Lupa Kata Sandi?",
          description:
            "Masukkan alamat email yang terkait dengan akun Anda dan kami akan mengirimkan tautan untuk mereset kata sandi Anda.",
        };
      case "CHECK_EMAIL":
        return {
          heading: "Periksa Email Anda",
          description: "Sebuah email telah dikirimkan ke alamat email Anda dengan petunjuk untuk mereset kata sandi.",
        };
      case "RESET_PASSWORD":
        return {
          heading: "Atur Kata Sandi Baru",
          description: "Kata sandi baru Anda harus berbeda dari kata sandi yang sebelumnya pernah digunakan.",
        };
      case "RESET_PASSWORD_SUCCESS":
        return {
          heading: "Atur Kata Sandi",
          description: "Kata sandi Anda berhasil diatur ulang. Klik di bawah ini untuk masuk.",
        };
      default:
        return {
          heading: "",
          description: "",
        };
    }
  }, [activeStep]);

  return (
    <Flex as="section" className="forgotpassword-page" bg="#FFFFFF" w="full" h="100vh" justify="center" align="center">
      <Box position="absolute" top="10%">
        <Box position="relative" width="150px" height="55px">
          <Image src="/svg/app-logo.svg" alt="app-logo" fill />
        </Box>
      </Box>
      <Flex
        className="forgot-password-box"
        as="div"
        position="relative"
        width="586px"
        minH="500px"
        bg="#FFFFFF"
        flexDir="column"
        p={10}
        px={{ base: 5, md: 20 }}
        pt={12}
        shadow={{ base: "none", md: "lg" }}
        borderRadius="14px"
      >
        {activeStep === "RESET_PASSWORD_SUCCESS" && (
          <Box position="relative" width="200px" height="80px" mb="35px" marginX="auto">
            <Image src="/svg/tick.svg" alt="tick-icon" fill />
          </Box>
        )}
        <Heading mb="35px">{renderTextContent?.heading}</Heading>
        <Text mb="35px">{renderTextContent?.description}</Text>

        {activeStep === "INPUT_EMAIL" && <InputEmail setNextStep={step => setActiveStep(step as Steps)} />}
        {activeStep === "CHECK_EMAIL" && <CheckEmail setNextStep={step => setActiveStep(step as Steps)} />}
        {activeStep === "RESET_PASSWORD" && <ResetPassword setNextStep={step => setActiveStep(step as Steps)} />}
        {activeStep === "RESET_PASSWORD_SUCCESS" && (
          <Button onClick={() => replace("/auth/login")} w="full">
            Lanjut
          </Button>
        )}

        <Box position="absolute" className="absolute-xcenter" bottom="5%" display="flex">
          <IoMdArrowRoundBack fontSize={22} color="#0062FF" />
          <Text variant="link-primary" align="center" ml={2}>
            <Link href="/auth/login">Kembali ke Masuk</Link>
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default ForgotPassword;
