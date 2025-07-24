import { useForm } from "react-hook-form";

import type { TSupervisorListTabs } from "@/constants/headerTabs";

export interface IFormDataSupervisorList {
  activeTab: TSupervisorListTabs;
}

export default function useFilterValue() {
  const { control, watch } = useForm<IFormDataSupervisorList>({
    defaultValues: {
      activeTab: "ASSIGNED_SUPERVISOR",
    },
  });

  const activeTab = watch("activeTab");

  return {
    activeTab,
    control,
  };
}
