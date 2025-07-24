import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import type { IRequestLogin } from "@/services/auth/login/type";

import schema from "./schema";

export interface IUseFormValueProps {
  onSubmit: (formData: IRequestLogin) => void;
  submitLoading?: boolean;
}

export default function useFormValue({ onSubmit }: IUseFormValueProps) {
  const { control, handleSubmit } = useForm<IRequestLogin>({
    resolver: yupResolver(schema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
      type: "email",
    },
  });

  const submitForm = (formData: IRequestLogin) => {
    onSubmit(formData);
  };

  return {
    control,
    submitForm: handleSubmit(submitForm),
  };
}
