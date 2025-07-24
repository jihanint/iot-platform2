import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { debounce } from "lodash";

import type { TManagerListTabs } from "@/constants/headerTabs";

export interface IFormDataManagerList {
  activeTab: TManagerListTabs;
}

interface IPropsUseFilterValue {
  onChangeFilter: (data: IFormDataManagerList) => void;
}

export default function useFilterValue({ ...props }: IPropsUseFilterValue) {
  const { control, watch } = useForm<IFormDataManagerList>({
    defaultValues: {
      activeTab: "ASSIGNED_MANAGER",
    },
  });

  const activeTab = watch("activeTab");

  const handleFilterChange = debounce(() => {
    props.onChangeFilter({
      activeTab,
    });
  }, 500);

  useEffect(() => {
    handleFilterChange();
    return handleFilterChange.cancel;
  }, [activeTab]);

  return {
    activeTab,
    control,
  };
}
