import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";

import { Box, Flex, Heading, Select, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { useRecoilValue } from "recoil";

import { RegionSelectorAtom } from "@/atoms/RegionAtom";

import { useUserState } from "@/common/hooks";
import { DEFAULT_PERIOD } from "@/constants/layout";
import type { IChartPeriod } from "@/interfaces/layout";
import { getWaterUsageData } from "@/services/water";
import { initWaterChartOptions } from "@/utils/chart-options";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const WaterUseChart = () => {
  const [chartPeriod, setChartPeriod] = useState<IChartPeriod>(DEFAULT_PERIOD);
  const activeRegion = useRecoilValue(RegionSelectorAtom);
  const { isAdmin } = useUserState();

  const {
    data: waterUsageData,
    refetch: refetchWaterUsageData,
    isFetching,
  } = useQuery({
    queryKey: ["get_water_usage"],
    queryFn: () => getWaterUsageData({ area: activeRegion, interval: chartPeriod }),
    refetchOnWindowFocus: false,
    enabled: Boolean(activeRegion),
    refetchInterval: 60000,
  });

  useEffect(() => {
    refetchWaterUsageData();
  }, [activeRegion, chartPeriod]);

  // const { options } = useChartOptions({ chartPeriod, seriesData: waterUsageData?.data });
  const options = initWaterChartOptions({ chartPeriod, seriesData: waterUsageData?.data });

  return (
    <Box as="section" className="rgc-water-use-chart" w="full">
      <Flex justify="space-between" align="center" w="full" mb="12px">
        <Heading size="sm">Penggunaan Air per {isAdmin ? "Kota/Kabupaten" : "Desa"} (m3)</Heading>
        <Box minW={{ base: "5rem", md: "15rem", lg: "25rem" }}>
          <Select
            width="100%"
            defaultValue={DEFAULT_PERIOD}
            onChange={e => setChartPeriod(e.target.value as IChartPeriod)}
          >
            <option value="day">Hari</option>
            <option value="week">Minggu</option>
            <option value="month">Bulan</option>
          </Select>
        </Box>
      </Flex>

      {waterUsageData?.data.series && !isFetching ? (
        <Chart options={options} series={waterUsageData?.data.series} type="area" height={350} />
      ) : !isFetching ? (
        <Flex px={4} py={6} bg="greylight.3" mb={22} borderRadius={2}>
          Tidak Ada Data Penggunaan Air
        </Flex>
      ) : (
        <></>
        // <Flex align="center" justify="center" px={4} py={6}>
        //   <Spinner size="md" />
        // </Flex>
      )}
    </Box>
  );
};

export default WaterUseChart;
