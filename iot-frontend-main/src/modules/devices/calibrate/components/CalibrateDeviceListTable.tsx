import { useMemo } from "react";
import DataTable from "react-data-table-component";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import FilterCalibrateDeviceListTable from "@/common/components/FilterCalibrateDeviceListTable";
import useCalibrateDeviceFilter from "@/common/hooks/use-calibrate-device-filter";
import { columns } from "@/lib/react-data-table/calibrate-device-list-options";
import { getCalibrateDeviceList } from "@/services/device";

const CalibrateDeviceListTable = () => {
  const router = useRouter();
  const { data: calibrateDeviceList, isFetching } = useQuery({
    queryKey: ["get_calibrate_device_list"],
    queryFn: () => getCalibrateDeviceList({}),
    refetchOnWindowFocus: false,
  });

  const { filteredData, villageName, setVillageName, onResetFilter, onFilterApplied, onClearSearch } =
    useCalibrateDeviceFilter({
      deviceData: calibrateDeviceList?.data,
    });
  // return <></>;

  /**
   * COMPONENT: Table Sub Header (Filter Area)
   */
  const subHeaderComponentMemo = useMemo(() => {
    if (calibrateDeviceList?.length === 0 || !calibrateDeviceList) return <></>;

    return (
      <FilterCalibrateDeviceListTable
        filterVillageName={villageName}
        onChangeVillageName={e => setVillageName(e.target.value)}
        onApplyFilter={data => onFilterApplied(data)}
        onClearSearch={onClearSearch}
        onResetFilter={onResetFilter}
        deviceData={calibrateDeviceList.data}
      />
    );
  }, [villageName, calibrateDeviceList]);
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
        router.push(`/devices/calibrate/${row.device_id}`);
      }}
      fixedHeader
      fixedHeaderScrollHeight="65vh"
      subHeader
      subHeaderComponent={subHeaderComponentMemo}
    />
  );
};

export default dynamic(() => Promise.resolve(CalibrateDeviceListTable), {
  ssr: false,
});
