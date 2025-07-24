import { useMemo } from "react";
import DataTable from "react-data-table-component";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { FilterDeviceListTable } from "@/common/components";
import { useDeviceFilter } from "@/common/hooks";
import { columns } from "@/lib/react-data-table/device-list-options";
import { getDeviceList } from "@/services/device";

const DeviceListTable = () => {
  const router = useRouter();
  const { data: deviceListData, isFetching } = useQuery({
    queryKey: ["get_device_list"],
    queryFn: () => getDeviceList({}),
    refetchOnWindowFocus: false,
  });

  const { filteredData, villageName, setVillageName, onResetFilter, onFilterApplied, onClearSearch } = useDeviceFilter({
    deviceData: deviceListData?.data,
  });

  /**
   * COMPONENT: Table Sub Header (Filter Area)
   */
  const subHeaderComponentMemo = useMemo(() => {
    if (deviceListData?.length === 0 || !deviceListData) return <></>;

    return (
      <FilterDeviceListTable
        filterVillageName={villageName}
        onChangeVillageName={e => setVillageName(e.target.value)}
        onApplyFilter={data => onFilterApplied(data)}
        onClearSearch={onClearSearch}
        onResetFilter={onResetFilter}
        deviceData={deviceListData.data}
      />
    );
  }, [villageName, deviceListData]);
  /** End of Component */

  if (!filteredData) {
    return <></>;
  } else if (isFetching) {
    return <Spinner />;
  }

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      keyField="id"
      responsive
      striped
      highlightOnHover
      pointerOnHover
      onRowClicked={row => {
        router.push(`/devices/village/${row.village_id}`);
      }}
      fixedHeader
      fixedHeaderScrollHeight="65vh"
      subHeader
      subHeaderComponent={subHeaderComponentMemo}
    />
  );
};

export default dynamic(() => Promise.resolve(DeviceListTable), {
  ssr: false,
});
