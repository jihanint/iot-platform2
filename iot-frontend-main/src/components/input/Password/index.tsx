import React, { useCallback, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LuKey } from "react-icons/lu";

import type { FlexProps, InputProps } from "@chakra-ui/react";
import { Button, Input, InputGroup, InputLeftElement, InputRightElement } from "@chakra-ui/react";

import FormWarning from "@/components/shared/FormWarning";
export interface IInputPasswordProps extends InputProps {
  withShowHidePassword?: boolean;
  inputGroupStyle?: FlexProps;
  error?: string;
}

const InputPassword = ({ withShowHidePassword, ...props }: IInputPasswordProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleShowHidePassword = useCallback(() => {
    setShowPassword(!showPassword);
  }, [setShowPassword, showPassword]);

  return (
    <>
      <InputGroup mb={props.error ? 0 : "16px"} {...props.inputGroupStyle}>
        <InputLeftElement pointerEvents="none">
          <LuKey color="gray.100" fontSize={20} />
        </InputLeftElement>
        <Input
          disabled={props.isDisabled}
          isRequired={props.isRequired}
          isReadOnly={props.isReadOnly}
          placeholder={props.placeholder}
          onChange={props.onChange}
          type={showPassword ? "text" : "password"}
          {...props}
        />
        {withShowHidePassword && (
          <InputRightElement width="3rem">
            <Button h="1.75rem" size="sm" onClick={handleShowHidePassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
      {props.error ? <FormWarning type="error" message={props.error} /> : <></>}
    </>
  );
};

export default InputPassword;
