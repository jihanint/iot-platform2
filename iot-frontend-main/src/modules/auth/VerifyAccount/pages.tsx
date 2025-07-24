import React from "react";

import Image from "next/image";

import { Box, Flex } from "@chakra-ui/react";

import VerifyNotes from "./content/VerifyNotes";
import VerifyStatus from "./content/VerifyStatus";

interface IModuleVerifyAccountProps {
  isSuccessVerifyAccountData: boolean;
  isVerifyingAccountData?: boolean;
  errorVerifyAccountMessage?: string;
  onSubmitVerify: () => void;
  emailAddress?: string;
  tokenData?: string;
}
export default function ModuleVerifyAccount({ ...props }: IModuleVerifyAccountProps) {
  return (
    <Flex as="section" className="login-page" bg="#FFFFFF" w="full" h="100vh" justify="center" align="center">
      <Box position="absolute" top="10%">
        <Box position="relative" width="150px" height="55px">
          <Image src="/svg/app-logo.svg" alt="app-logo" fill />
        </Box>
      </Box>

      {props.tokenData ? (
        <VerifyStatus
          isVerifing={props.isVerifyingAccountData}
          isVerified={props.isSuccessVerifyAccountData}
          errorMsg={props.errorVerifyAccountMessage}
        />
      ) : (
        <VerifyNotes email={props?.emailAddress || ""} />
      )}
    </Flex>
  );
}
