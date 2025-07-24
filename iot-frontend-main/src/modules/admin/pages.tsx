import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import { DeviceStatusLogTable, TelemetryListTable } from "./components";

const AdminHome = () => {
  return (
    // <ContentContainer>
    <Box as="section">
      <Tabs pt="10vh" px="2rem" defaultIndex={0}>
        <TabList>
          <Tab w="50%" justifyContent="flex-start">
            Telemetry Log
          </Tab>
          <Tab w="50%" justifyContent="flex-start">
            Device Status Log
          </Tab>
        </TabList>

        <TabPanels>
          {/* Telemetry Log Tab */}
          <TabPanel>
            <Box className="telemetry-log-wrapper" my={12} overflowX="auto">
              <TelemetryListTable />
            </Box>
          </TabPanel>
          {/* Water Log Tab */}
          <TabPanel>
            <Box className="device-status-log-wrapper" my={12} overflowX="auto">
              <DeviceStatusLogTable />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
    // </ContentContainer>
  );
};

export default AdminHome;
