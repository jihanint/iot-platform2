import React from "react";

import type { FlexProps, InputProps } from "@chakra-ui/react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

import FormWarning from "@/components/shared/FormWarning";

export interface IInputPasswordProps extends InputProps {
  inputGroupStyle?: FlexProps;
  leftElement?: React.ReactElement;
  error?: string;
}

const InputText = ({ ...props }: IInputPasswordProps) => {
  return (
    <>
      <InputGroup mb={props.error ? 0 : "16px"} {...props.inputGroupStyle}>
        {props.leftElement && <InputLeftElement pointerEvents="none">{props.leftElement}</InputLeftElement>}
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

export default InputText;
