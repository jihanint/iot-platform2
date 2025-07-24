import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import _some from "lodash/some";

import type { IRegionDataItem } from "@/interfaces/region";
import type { IRequestUserAssignment } from "@/services/user/assignment/type";
import type { TUserRole } from "@/services/user/type";

import schema from "./schema";

interface IUseFormValueProps {
  onSubmit: (formData: IRequestUserAssignment) => void;
  submitLoading?: boolean;
}

export interface IFormDataAssignment {
  user_id: number;
  user_name: string;
  phone_number: string;
  role: TUserRole;
  villages: IRegionDataItem[];
  village_ids?: number[];
}

export default function useFormValue({ ...props }: IUseFormValueProps) {
  const { control, watch, setValue, handleSubmit } = useForm<IFormDataAssignment>({
    resolver: yupResolver(schema),
    defaultValues: {
      user_id: 0, // fixed to 0 (for create new user)
      user_name: "",
      phone_number: "",
      role: "SUPERVISOR", // fixed to supervisor
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
