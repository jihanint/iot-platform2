import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import type { IRequestRegister } from "@/services/auth/register/type";

import schema from "./schema";

export interface IFormDataRegister {
  emailOrPhone: string;
  fullname: string;
  password: string;
  confirmPassword: string;
  type?: string;
  debug?: boolean | null;
}

export interface IUseFormValueProps {
  onSubmit: (formData: IRequestRegister) => void;
  submitLoading?: boolean;
}

export default function useFormValue({ onSubmit }: IUseFormValueProps) {
  const { control, handleSubmit } = useForm<IFormDataRegister>({
    resolver: yupResolver(schema),
    defaultValues: {
      emailOrPhone: "",
      fullname: "",
      password: "",
      confirmPassword: "",
      type: "email", // TODO: implement auto-select between email or phone based on emailOrPhone value,
      debug: false,
    },
  });

  const submitForm = (formData: IFormDataRegister) => {
    const { confirmPassword, debug, ...newFormData } = formData;
    onSubmit({ ...newFormData });
  };

  return {
    control,
    submitForm: handleSubmit(submitForm),
  };
}
