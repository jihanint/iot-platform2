import { useRef } from "react";
import { AiOutlineMail } from "react-icons/ai";

import { Button, FormControl, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

interface InputEmailProps {
  setNextStep?: (step: string) => void;
}

const InputEmail = ({ setNextStep }: InputEmailProps) => {
  const email = useRef("");

  const onReset = () => {
    setNextStep?.("CHECK_EMAIL");
  };

  return (
    <FormControl mb="60px">
      <InputGroup mb="16px">
        <InputLeftElement pointerEvents="none" top="10%">
          <AiOutlineMail color="gray.100" fontSize={20} />
        </InputLeftElement>
        <Input
          type="text"
          variant="commonTextInput"
          placeholder="Email Anda"
          onChange={e => (email.current = e.target.value)}
        />
      </InputGroup>
      <Button onClick={onReset} w="full">
        Reset Kata Sandi
      </Button>
    </FormControl>
  );
};

export default InputEmail;
