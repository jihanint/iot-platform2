import { useEffect } from "react";

import { useRouter } from "next/router";

import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { useRecoilValue } from "recoil";

import { RegionSelectorAtom } from "@/atoms/RegionAtom";

import {
  RegionListSelector,
  VillageWaterProductionChart,
  VillageWaterUseChart,
  VillageWaterVolumeChart,
  VisualizationCardInfo,
} from "@/common/components";
import { useLayoutState } from "@/common/hooks";
import { useToast } from "@/common/hooks/use-toast";
import { ContentContainer } from "@/common/layouts";
import { getDeviceFunctionalityStats } from "@/services/device";
import { isObjEmpty } from "@/utils/helper";

import ActivityHistoryCardInfo from "./components/ActivityHistoryCardInfo";
import WarningCardInfo from "./components/WarningCardInfo";

const DashboardHome = () => {
  const router = useRouter();
  const toast = useToast();
  const { setBreadCrumb } = useLayoutState();
  const activeRegion = useRecoilValue(RegionSelectorAtom);

  const { data: fnStatsData, refetch: refetchFnStatsData } = useQuery({
    queryKey: ["get_functionality_stats"],
    queryFn: () => {
      if (activeRegion) {
        return getDeviceFunctionalityStats({ area: activeRegion as string });
      } else {
        return getDeviceFunctionalityStats({});
      }
    },
  });

  useEffect(() => {
    setBreadCrumb("Ringkasan");
    if (!isObjEmpty(router.query)) {
      const { title, description, status } = router.query as any;
      toast({
        title,
        description,
        status,
      });
    }
  }, [router.query]);

  useEffect(() => {
    refetchFnStatsData();
  }, [activeRegion]);

  return (
    <ContentContainer>
      <Box as="section">
        <Box mb="30px">
          <RegionListSelector />
        </Box>
        {fnStatsData && (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={5} mb="30px">
            <VisualizationCardInfo title="Perangkat Fungsional" value={fnStatsData?.data.functioning.total} />
            <VisualizationCardInfo title="Perangkat Non Fungsional" value={fnStatsData?.data.non_functioning.total} />
            <VisualizationCardInfo
              title="Non Fungsional Permanen"
              value={fnStatsData?.data.permanent_non_functioning.total}
            />
          </SimpleGrid>
        )}
        <Flex w="full" direction={{ base: "column", lg: "row" }} gap="20px">
          {/* Chart */}
          <Box className="left-content" w={{ base: "100%", lg: "68%" }}>
            {false && (
              <VillageWaterUseChart
                title="Total Penggunaan Air (m3)"
                is_must_village={false}
                village_id={activeRegion}
              />
            )}

            <VillageWaterProductionChart title="Total Produksi Air" is_must_village={false} village_id={activeRegion} />
            <VillageWaterVolumeChart title="Rata-Rata Tingkat Air" is_must_village={false} village_id={activeRegion} />
          </Box>
          {/* Right Content */}
          <Box className="right-content" w={{ base: "100%", lg: "32%" }}>
            <Box mb="30px">
              <WarningCardInfo />
            </Box>
            <Box mb="30px">
              <ActivityHistoryCardInfo />
            </Box>
          </Box>
        </Flex>
        {/* <Box mb="30px" mt="80px">
          <MapViewBox />
        </Box> */}
      </Box>
    </ContentContainer>
  );
};

export default DashboardHome;
