import { useEffect, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { GiPlainCircle } from "react-icons/gi";

import dynamic from "next/dynamic";

import { Box, Flex, Heading, Icon, IconButton, Select, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { DEFAULT_PERIOD } from "@/constants/layout";
import type { IChartPeriod } from "@/interfaces/layout";
import { getWaterUsageData } from "@/services/water";
import { initWaterChartOptions } from "@/utils/chart-options";
import { localizeCharPeriod } from "@/utils/helper";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const WaterUseChart = ({
  is_must_village = false,
  village_id,
  title = "Penggunaan Air (m3)",
}: {
  is_must_village?: boolean;
  village_id: number | "all";
  title?: string;
}) => {
  const [chartPeriod, setChartPeriod] = useState<IChartPeriod>(DEFAULT_PERIOD);

  const [previousNum, setPreviousNum] = useState(0);

  // const configs: ApexOptions = {
  //   colors: ["#16A34A"],
  //   fill: {
  //     type: "gradient",
  //     gradient: {
  //       shadeIntensity: 1,
  //       opacityFrom: 0.7,
  //       opacityTo: 0.9,
  //       stops: [0, 90, 100],
  //     },
  //   },
  // };

  const {
    data: waterUsageData,
    refetch: refetchWaterUsageData,
    isFetching,
  } = useQuery({
    queryKey: ["get_water_usage"],
    queryFn: () => {
      return getWaterUsageData({
        area: village_id,
        interval: chartPeriod,
        previous: previousNum,
      });
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(village_id),
  });

  const options = initWaterChartOptions({ chartPeriod, seriesData: waterUsageData?.data });

  useEffect(() => {
    if (village_id) {
      refetchWaterUsageData();
    }
  }, [chartPeriod, is_must_village, previousNum, village_id]);

  return (
    <Box as="section" className="rgc-water-use-chart" w="full">
      <Flex justify="space-between" align="center" w="full" mb="12px">
        <Heading fontSize="md">{title}</Heading>
        <Box display="flex" gap={2}>
          <IconButton
            icon={<Icon width={"36px"} h="36px" as={BiChevronLeft} />}
            aria-label="prev-chart-water"
            h="fit-content"
            minH={"fit-content"}
            w="fit-content"
            minW="fit-content"
            onClick={() => setPreviousNum(previousNum + 1)}
          />
          <Select
            minW="150px"
            defaultValue={DEFAULT_PERIOD}
            onChange={e => {
              setPreviousNum(0);
              setChartPeriod(e.target.value as IChartPeriod);
            }}
            w="55%"
          >
            <option value="day" selected>
              Hari
            </option>
            <option value="week">Minggu</option>
            <option value="month">Bulan</option>
            {/* <option value="year">Tahun</option> */}
          </Select>
          <IconButton
            icon={<Icon width={"36px"} h="36px" as={BiChevronRight} />}
            aria-label="prev-chart-water"
            h="fit-content"
            minH={"fit-content"}
            w="fit-content"
            minW="fit-content"
            onClick={() => setPreviousNum(previousNum - 1)}
            isDisabled={previousNum === 0}
          />
          {/* <Button size="sm" minH="38px" w="40%">
            <Text>Jelajahi</Text>
          </Button> */}
        </Box>
      </Flex>
      {waterUsageData?.data.series && !isFetching ? (
        <>
          {previousNum !== 0 && (
            <Text>
              <Text as="span">
                <Icon color="red" width={"12px"} h="12px" as={GiPlainCircle} />
              </Text>{" "}
              {previousNum} {localizeCharPeriod[chartPeriod as keyof typeof localizeCharPeriod]} yang lalu
            </Text>
          )}
          <Chart
            options={options}
            series={waterUsageData?.data.series.sort((a, b) => (a.name > b.name ? 1 : -1))}
            type="area"
            height={350}
          />
        </>
      ) : !isFetching ? (
        <Flex px={4} py={6} bg="greylight.3" mb={22} borderRadius={2}>
          Tidak Ada Data Penggunaan Air{" "}
          {previousNum !== 0 &&
            `${previousNum} ${localizeCharPeriod[chartPeriod as keyof typeof localizeCharPeriod]} Yang Lalu`}
        </Flex>
      ) : (
        <Flex align="center" justify="center" px={4} py={6}>
          <Spinner size="md" />
        </Flex>
      )}
    </Box>
  );
};

export default WaterUseChart;
