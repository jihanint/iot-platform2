import { useEffect } from "react";

import { Box } from "@chakra-ui/react";

import { useLayoutState } from "@/common/hooks";
import { ContentContainer } from "@/common/layouts";

import CalibrateDeviceListTable from "./components/CalibrateDeviceListTable";

const CalibrateDevices = () => {
  const { setBreadCrumb } = useLayoutState();

  useEffect(() => {
    setBreadCrumb("Kalibrasi Perangkat");
  }, []);

  return (
    <ContentContainer position="relative">
      <Box as="section">
        <CalibrateDeviceListTable />
      </Box>
    </ContentContainer>
  );
};

export default CalibrateDevices;
