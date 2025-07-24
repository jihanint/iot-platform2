import type { SetStateAction } from "react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import type { TDeviceLogTabs } from "@/constants/headerTabs";
import type { IDeviceDataItem } from "@/services/device/type";

interface IUseFilterValue {
  deviceList?: IDeviceDataItem[];
  refetchTelemetryLog: () => void;
  setDeviceCode: React.Dispatch<React.SetStateAction<string>>;
  deviceCode: string;
  setPageParam: React.Dispatch<SetStateAction<number>>;
}
export interface IFormDataLogList {
  activeTab: TDeviceLogTabs;
  deviceCode: string;
}

export default function useFilterValue({ ...props }: IUseFilterValue) {
  const { control, watch } = useForm<IFormDataLogList>({
    defaultValues: {
      activeTab: "TELEMETRY_LOG",
      deviceCode: "",
    },
  });

  const activeTab = watch("activeTab");
  const deviceCode = watch("deviceCode");

  const transformedDeviceList = useMemo(() => {
    if (props.deviceList?.length) {
      return props.deviceList.map(item => ({
        value: item.device_code,
        label: `${item.device_code} - ${item.village_name}`,
      }));
    }
    return [];
  }, [props.deviceList]);

  useEffect(() => {
    props.setPageParam(1);
  }, [activeTab]);

  useEffect(() => {
    const setData = async () => {
      if (deviceCode && props.setDeviceCode) {
        // queryClient.invalidateQueries(["GET_INFINITE_WATER_TELEMETRY_LOG", props.deviceCode]);
        await props.setDeviceCode(deviceCode);
      }
    };

    setData();
  }, [deviceCode, props.setDeviceCode, props.deviceCode]);

  return {
    transformedDeviceList,
    activeTab,
    control,
  };
}
