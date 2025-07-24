import { useEffect } from "react";

import { Box } from "@chakra-ui/react";

import { useLayoutState } from "@/common/hooks";
import { ContentContainer } from "@/common/layouts";

import DeviceListTable from "./components/DeviceListTable";

const DevicesHome = () => {
  const { setBreadCrumb } = useLayoutState();

  useEffect(() => {
    setBreadCrumb("Perangkat");
  }, []);

  return (
    <ContentContainer position="relative">
      <Box as="section">
        <DeviceListTable />
      </Box>
    </ContentContainer>
  );
};

export default DevicesHome;
