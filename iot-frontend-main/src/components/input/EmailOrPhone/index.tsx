import React from "react";
import { AiOutlineMail } from "react-icons/ai";

import type { FlexProps, InputProps, StyleProps } from "@chakra-ui/react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

import FormWarning from "@/components/shared/FormWarning";

export interface IInputPasswordProps extends InputProps {
  inputGroupStyle?: FlexProps;
  leftElement?: React.ReactElement;
  leftElementStyle?: StyleProps;
  error?: string;
}

const InputEmailOrPhone = ({ ...props }: IInputPasswordProps) => {
  // TODO: Handling function for checking onchange for validate email/phone input value
  return (
    <>
      <InputGroup mb={props.error ? 0 : "16px"} {...props.inputGroupStyle}>
        <InputLeftElement pointerEvents="none" top="10%" {...props.leftElementStyle}>
          <AiOutlineMail color="gray.100" fontSize={20} />
        </InputLeftElement>
        <Input
          disabled={props.isDisabled}
          isRequired={props.isRequired}
          isReadOnly={props.isReadOnly}
          placeholder={props.placeholder}
          onChange={props.onChange}
          type="text"
          bg={props.isDisabled ? "gray.300" : "initial"}
          color="black"
          {...props}
        />
      </InputGroup>
      {props.error ? <FormWarning type="error" message={props.error} /> : <></>}
    </>
  );
};

export default InputEmailOrPhone;
