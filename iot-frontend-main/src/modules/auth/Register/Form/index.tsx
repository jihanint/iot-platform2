import { Controller } from "react-hook-form";
import { FaRegUser } from "react-icons/fa";

import { Button, FormControl } from "@chakra-ui/react";

import InputEmailOrPhone from "@/components/input/EmailOrPhone";
import InputPassword from "@/components/input/Password";
import InputText from "@/components/input/Text";

import type { IUseFormValueProps } from "./useFormValue";
import useFormValue from "./useFormValue";

export interface IRegisterFormContentProps extends IUseFormValueProps {}

const RegisterFormContent = ({ ...props }: IRegisterFormContentProps) => {
  const { control, submitForm } = useFormValue({ onSubmit: props.onSubmit });

  return (
    <FormControl onSubmit={submitForm}>
      <Controller
        control={control}
        name="fullname"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <InputText
            value={value}
            name="fullname"
            placeholder="Nama Lengkap"
            onChange={onChange}
            error={error?.message}
            leftElement={<FaRegUser color="gray.100" fontSize={20} />}
          />
        )}
      />
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

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <InputPassword
            withShowHidePassword
            value={value}
            name="confirmPassword"
            placeholder="Kata Sandi"
            onChange={onChange}
            error={error?.message}
          />
        )}
      />

      <Button w="full" onClick={submitForm} isLoading={props.submitLoading}>
        Daftar
      </Button>
    </FormControl>
  );
};

export default RegisterFormContent;
