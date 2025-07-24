import { useEffect } from "react";

// import { FiAlertCircle } from "react-icons/fi";
import { useRouter } from "next/router";

import { Box, Flex, Heading, SimpleGrid, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { VillageWaterProductionChart, VillageWaterUseChart, VillageWaterVolumeChart } from "@/common/components";
import { useLayoutState, useUserState } from "@/common/hooks";
import { ContentContainer } from "@/common/layouts";
import { DeviceVillageProfile, WaterHistoryCardInfo, WaterHistoryListTable } from "@/modules/devices";
import { getVillageDetail } from "@/services/region/village";

const DeviceDetail = () => {
  const { setBreadCrumb, setTopNavShadow } = useLayoutState();
  const { villageId } = useRouter().query;
  const { isAdmin } = useUserState();

  const { data: deviceData } = useQuery({
    queryKey: ["get_detail_village"],
    queryFn: () => getVillageDetail({ village_id: villageId as string }),
    refetchOnWindowFocus: false,
    enabled: Boolean(villageId),
  });

  useEffect(() => {
    setTopNavShadow("none");
    if (deviceData) {
      setBreadCrumb(`Desa ${deviceData.data.village_name}`);
    }
  }, [villageId, deviceData]);

  return (
    <Box as="section" className="village-device">
      <Tabs pt="2vh" px="2rem" defaultIndex={0}>
        <TabList>
          <Tab w="25%" justifyContent="flex-start">
            Ringkasan
          </Tab>
          <Tab w="25%" justifyContent="flex-start">
            <Flex align="center">
              <Text mr={2}>Produksi Air</Text>
              {/* <FiAlertCircle color="red" /> */}
            </Flex>
          </Tab>
          {false && (
            <Tab w="25%" justifyContent="flex-start">
              Penggunaan Air
            </Tab>
          )}

          <Tab w="25%" justifyContent="flex-start">
            Tingkat Air
          </Tab>
        </TabList>

        <TabPanels>
          {/* Summary Tab */}
          <TabPanel>
            <Box className="village-profile-wrapper" my={12}>
              <Heading fontSize="md">Profil Desa</Heading>
              {deviceData && (
                <DeviceVillageProfile type="village_profile" villageProfile={deviceData?.data.village_profile} />
              )}
            </Box>
            <Box className="device-profile-wrapper" my={12}>
              <Heading fontSize="md">Profil Device</Heading>
              {deviceData && (
                <DeviceVillageProfile type="device_profile" deviceProfile={deviceData?.data.device_profile} />
              )}
            </Box>
            <Box className="village-analytic-wrapper" my={12}>
              <Heading fontSize="md">Analisis Desa</Heading>
              <ContentContainer py={3}>
                <SimpleGrid columns={{ base: 1, lg: 2 }} rowGap={24} columnGap={20}>
                  {false && (
                    <VillageWaterUseChart is_must_village={isAdmin} village_id={parseInt(villageId as string)} />
                  )}

                  <VillageWaterProductionChart is_must_village={isAdmin} village_id={parseInt(villageId as string)} />
                  <VillageWaterVolumeChart is_must_village={isAdmin} village_id={parseInt(villageId as string)} />
                </SimpleGrid>
              </ContentContainer>
            </Box>
            <Box className="village-water_history-wrapper">
              <WaterHistoryCardInfo />
            </Box>
          </TabPanel>
          {/* Water Production Tab */}
          <TabPanel>
            <Box>
              {/* <AlertBox /> */}
              {/* <IndividualWaterProductionChart /> */}
              <VillageWaterProductionChart is_must_village={isAdmin} village_id={parseInt(villageId as string)} />
              <WaterHistoryListTable type="production" />
            </Box>
          </TabPanel>
          {/* Water Use Tab */}
          {false && (
            <TabPanel>
              <Box>
                {/* <IndividualWaterUseChart /> */}
                <VillageWaterUseChart is_must_village={isAdmin} village_id={parseInt(villageId as string)} />
                <WaterHistoryListTable type="usage" />
              </Box>
            </TabPanel>
          )}

          {/* Water Volume Tab */}
          <TabPanel>
            <Box>
              {/* <IndividualWaterVolumeChart /> */}
              <VillageWaterVolumeChart is_must_village={isAdmin} village_id={parseInt(villageId as string)} />
              <WaterHistoryListTable type="level" />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default DeviceDetail;
