import React, { useRef } from "react";
import { Button, FormControl, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { LuKey } from "react-icons/lu";

interface ResetPasswordProps {
  setNextStep?: (step: string) => void;
}

const ResetPassword = ({ setNextStep }: ResetPasswordProps) => {
  const password = useRef("");

  const onReset = () => {
    setNextStep?.("RESET_PASSWORD_SUCCESS");
  };
  return (
    <FormControl mb="60px">
      <InputGroup mb="16px">
        <InputLeftElement pointerEvents="none" top="10%">
          <LuKey color="gray.100" fontSize={20} />
        </InputLeftElement>
        <Input
          type="password"
          variant="commonTextInput"
          placeholder="Kata sandi baru"
          onChange={e => (password.current = e.target.value)}
        />
      </InputGroup>
      <InputGroup mb="16px">
        <InputLeftElement pointerEvents="none" top="10%">
          <LuKey color="gray.100" fontSize={20} />
        </InputLeftElement>
        <Input
          type="password"
          variant="commonTextInput"
          placeholder="Konfirmasi kata sandi"
          onChange={e => (password.current = e.target.value)}
        />
      </InputGroup>
      <Button onClick={onReset} w="full">
        Reset Kata Sandi
      </Button>
    </FormControl>
  );
};

export default ResetPassword;
