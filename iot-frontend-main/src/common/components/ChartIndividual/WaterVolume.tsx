import React, { useMemo, useState } from "react";

import dynamic from "next/dynamic";

import { Box, Button, Flex, Heading, Select, Text } from "@chakra-ui/react";
import type { ApexOptions } from "apexcharts";

import { useChartOptions } from "@/common/hooks";
import type { IChartPeriod } from "@/interfaces/layout";
// dummy
import {
  dailyWaterUseResponse,
  monthlyWaterUseResponse,
  weeklyWaterUseResponse,
  yearlyWaterUseResponse,
} from "@/mocks/data/water-charts-village";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const WaterVolumeChart = () => {
  const [chartPeriod, setChartPeriod] = useState<IChartPeriod>("day");

  const chartPeriodData = useMemo(() => {
    switch (chartPeriod) {
      case "day":
        return dailyWaterUseResponse;
      case "week":
        return weeklyWaterUseResponse;
      case "month":
        return monthlyWaterUseResponse;
      case "year":
      default:
        return yearlyWaterUseResponse;
    }
  }, [chartPeriod]);

  const configs: ApexOptions = {
    colors: ["#FF3A29"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
  };
  const { options } = useChartOptions({ chartPeriod, seriesData: chartPeriodData, configs });

  return (
    <Box as="section" className="rgc-water-use-chart" w="full">
      <Flex justify="space-between" align="center" w="full" mb="12px">
        <Heading fontSize="md">Tingkat Air (m)</Heading>
        <Box display="flex" width="30%" gap={2}>
          <Select onChange={e => setChartPeriod(e.target.value as IChartPeriod)} w="55%">
            <option value="day" selected>
              Hari
            </option>
            <option value="week">Minggu</option>
            <option value="month">Bulan</option>
            {/* <option value="year">Tahun</option> */}
          </Select>
          {/* <Button size="sm" minH="38px" w="40%">
            <Text>Jelajahi</Text>
          </Button> */}
        </Box>
      </Flex>
      {chartPeriodData && <Chart options={options} series={chartPeriodData.series} type="area" height={350} />}
    </Box>
  );
};

export default WaterVolumeChart;
