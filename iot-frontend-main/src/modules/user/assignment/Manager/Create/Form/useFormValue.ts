import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import _some from "lodash/some";

import type { IRegionDataItem } from "@/interfaces/region";
import type { IRequestUserManagerAssignment } from "@/services/user/assignment/type";

import schema from "./schema";

interface IUseFormValueProps {
  onSubmit: (formData: IRequestUserManagerAssignment) => void;
  submitLoading?: boolean;
}

export interface IFormDataAssignment {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone_number: string;
  villages: IRegionDataItem[];
  village_ids?: number[];
}

export default function useFormValue({ ...props }: IUseFormValueProps) {
  const { control, watch, setValue, handleSubmit } = useForm<IFormDataAssignment>({
    resolver: yupResolver(schema),

    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      phone_number: "",
      confirmPassword: "",
      villages: [],
    },
  });

  const villages = watch("villages");

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
    const { villages: villageData, ...rest } = formData;
    const villageIds = villageData.map(village => village.id);
    props.onSubmit({
      ...rest,
      village_ids: villageIds,
    });
  };

  const isVillageEmpty = useMemo(() => {
    return !villages.length;
  }, [villages]);

  return {
    control,
    villages,
    isVillageEmpty,
    submitForm: handleSubmit(submitForm),
    handleAddSelectedVillage,
    handleDeleteSelectedVillage,
  };
}
