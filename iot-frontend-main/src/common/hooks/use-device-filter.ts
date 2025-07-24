import { useEffect, useMemo, useState } from "react";

import type { DeviceData } from "@/interfaces/device";

interface Params {
  deviceData: DeviceData[];
}

const useDeviceFilter = ({ deviceData }: Params) => {
  const [filteredData, setFilteredData] = useState<DeviceData[]>([]);
  const [villageName, setVillageName] = useState<string>("");

  useEffect(() => {
    if (deviceData) {
      setFilteredData(deviceData);
    }
  }, [deviceData]);

  useMemo(() => {
    const filteredDevice = deviceData?.filter(
      item => item?.village_name && item.village_name.toLowerCase().includes(villageName.toLowerCase())
    );
    setFilteredData(filteredDevice);
  }, [villageName]);

  const onFilterApplied = (filterOption: { selected_status: string; village_name: string }) => {
    if (filterOption.village_name === "all" && filterOption.selected_status === "all") {
      setFilteredData(deviceData);
    } else if (filterOption.village_name && filterOption.selected_status === "all") {
      const filteredDevice = deviceData?.filter(item =>
        item.village_name.toLocaleLowerCase().includes(filterOption.village_name.toLocaleLowerCase())
      );
      setFilteredData(filteredDevice);
    } else if (filterOption.selected_status !== "all" && filterOption.village_name === "all") {
      const filteredDevice = deviceData?.filter(item => item.status === parseInt(filterOption.selected_status));
      setFilteredData(filteredDevice);
    } else if (filterOption.selected_status !== "all" && filterOption.village_name !== "all") {
      const filteredDevice = deviceData?.filter(
        item =>
          item.status === parseInt(filterOption.selected_status) &&
          item.village_name.toLocaleLowerCase().includes(filterOption.village_name.toLocaleLowerCase())
      );
      setFilteredData(filteredDevice);
    }
  };

  const onResetFilter = () => setFilteredData(deviceData);
  const onClearSearch = () => (villageName ? setVillageName("") : null);

  return {
    filteredData,
    villageName,
    setVillageName,
    onFilterApplied,
    onResetFilter,
    onClearSearch,
  };
};

export default useDeviceFilter;
