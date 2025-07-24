import React from "react";
import { Controller } from "react-hook-form";

import { Button, FormControl } from "@chakra-ui/react";

import InputEmailOrPhone from "@/components/input/EmailOrPhone";
import InputPassword from "@/components/input/Password";

import type { IUseFormValueProps } from "./useFormValue";
import useFormValue from "./useFormValue";

export interface ILoginFormContentProps extends IUseFormValueProps {}

const LoginFormContent = ({ ...props }: ILoginFormContentProps) => {
  const { control, submitForm } = useFormValue({ onSubmit: props.onSubmit });

  return (
    <FormControl onSubmit={submitForm}>
      <Controller
        control={control}
        name="emailOrPhone"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <InputEmailOrPhone
            value={value}
            name="emailOrPhone"
            placeholder="Alamat email" // TODO: Alamat email or phone number
            onChange={onChange}
            error={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <InputPassword
            withShowHidePassword
            value={value}
            name="password"
            placeholder="Kata Sandi"
            onChange={onChange}
            error={error?.message}
          />
        )}
      />
      <Button w="full" isLoading={props.submitLoading} onClick={submitForm}>
        Masuk
      </Button>
    </FormControl>
  );
};

export default LoginFormContent;
