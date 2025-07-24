import { useEffect } from "react";
import { useForm } from "react-hook-form";

import _some from "lodash/some";

import type { IRegionDataItem } from "@/interfaces/region";
import type { IRequestUserAssignment } from "@/services/user/assignment/type";
import type { IUserDetailItem, TUserRole } from "@/services/user/type";

export interface IFormDataAssignment {
  user_id: number;
  user_name: string;
  email?: string;
  phone_number: string;
  role: TUserRole;
  villages: IRegionDataItem[];
  village_ids: number[];
}

export interface IUseFormValueProps {
  prefilledData?: IUserDetailItem;
  onSubmit: (formData: IRequestUserAssignment) => void;
  submitLoading?: boolean;
}

export default function useFormValue({ ...props }: IUseFormValueProps) {
  const { control, watch, setValue, handleSubmit } = useForm<IFormDataAssignment>({
    defaultValues: {
      user_id: undefined,
      user_name: "",
      email: "",
      phone_number: "",
      role: undefined,
      villages: [],
    },
  });

  const userName = watch("user_name");
  const email = watch("email");
  const phoneNumber = watch("phone_number");
  const role = watch("role");
  const villages = watch("villages");

  useEffect(() => {
    if (props.prefilledData) {
      setValue("user_id", props.prefilledData.user_id);
      setValue("user_name", props.prefilledData.user_name);
      setValue("email", props.prefilledData.email);
      setValue("phone_number", props.prefilledData.phone_number || "");
      setValue("role", props.prefilledData.role);
      setValue("villages", props.prefilledData.villages);
    }
  }, [props.prefilledData]);

  const handleDeleteSelectedVillage = (valueToDelete: number) => {
    const newVillageValue = villages.filter(data => data.id !== valueToDelete);
    setValue("villages", newVillageValue);
  };

  const handleAddSelectedVillage = (village: IRegionDataItem) => {
    const currentVillages = Array.isArray(villages) ? villages : [];
    const villageExists = _some(currentVillages, { id: village.id });

    if (!villageExists) {
      const newVillageData = [...currentVillages, village];
      setValue("villages", newVillageData);
    }
  };

  const submitForm = async (formData: IFormDataAssignment) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { villages: villageData, email: emailData, ...rest } = formData;
    const villageIds = villageData.map(village => village.id);
    props.onSubmit({
      ...rest,
      village_ids: villageIds,
    });
  };

  return {
    control,
    userName,
    email,
    phoneNumber,
    role,
    villages,
    handleDeleteSelectedVillage,
    handleAddSelectedVillage,
    submitForm: handleSubmit(submitForm),
  };
}
