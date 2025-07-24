import { useCallback, useEffect, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { GiPlainCircle } from "react-icons/gi";

import dynamic from "next/dynamic";

import { Box, Flex, Heading, HStack, Icon, Spinner, Text } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { DEFAULT_PERIOD } from "@/constants/layout";
import { exportToCSV, exportToXLSX } from "@/hooks/useExportFile";
import type { IChartFrequent, IChartPeriod } from "@/interfaces/layout";
import { getWaterVolumeData } from "@/services/water";
import { initWaterChartOptions } from "@/utils/chart-options";
import { localizeCharPeriod } from "@/utils/helper";

import ExportButton from "./components/ExportButton";
import FilterButton from "./components/FilterButton";
import SumButton from "./components/SumButton";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
type TempValues = {
  [key: string]: {
    prevValue: number;
    newValue: number;
  };
};

const WaterVolumeChart = ({
  is_must_village = false,
  village_id,
  title = "Tingkat Air (m)",
}: {
  is_must_village?: boolean;
  village_id: number | "all";
  title?: string;
}) => {
  const [chartPeriod, setChartPeriod] = useState<IChartPeriod>(DEFAULT_PERIOD);
  const [chartFrequent, setChartFrequent] = useState<IChartFrequent | undefined>(undefined);
  const [dateRange, setDateRange] = useState<{ from: string | undefined; to: string | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [previousNum, setPreviousNum] = useState(0);
  const [exportType, setExportType] = useState("xlsx");

  const {
    data: waterVolumeData,
    refetch: refetchVolumeData,
    isFetching,
  } = useQuery({
    queryKey: ["get_water_volume"],
    queryFn: () => {
      if (dateRange.from === undefined || dateRange.to === undefined) {
        return getWaterVolumeData({
          area: village_id,
          interval: chartPeriod,
          previous: previousNum,
        });
      } else {
        return getWaterVolumeData({
          area: village_id,
          frequency: chartFrequent,
          start_time: dateRange.from,
          end_time: dateRange.to,
        });
      }
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(village_id),
  });

  useEffect(() => {
    if (village_id) {
      refetchVolumeData();
    }
  }, [chartPeriod, is_must_village, previousNum, village_id, JSON.stringify(dateRange), chartFrequent]);

  // const maxY = useMemo(() => {
  //   if (chartFrequent === "hour" || chartPeriod === "day") return 2.5;
  //   if (chartFrequent === "day" || chartPeriod === "week") return 2.5;
  //   return 2.5;
  // }, [chartFrequent, chartPeriod]);

  const options = initWaterChartOptions({
    chartPeriod: chartFrequent ? ((chartFrequent + "-frequent") as IChartPeriod) : chartPeriod,
    seriesData: waterVolumeData?.data,
    // max: maxY,
  });
  const highestValue = useMemo(() => {
    if (waterVolumeData?.data && waterVolumeData.data.series) {
      const individualMaxValues = waterVolumeData.data.series.map(obj => Math.max(...obj.data));
      return Math.max(...individualMaxValues);
    } else {
      return 0;
    }
  }, [waterVolumeData]);

  const highestEachData = useMemo(() => {
    if (waterVolumeData?.data && waterVolumeData.data.series) {
      return waterVolumeData.data.series.map(obj => ({
        name: obj.name,
        total: Math.max(...obj.data),
      }));
    } else {
      return [];
    }
  }, [waterVolumeData]);

  const [tempValues, setTempValues] = useState<TempValues>({
    "day-week": { prevValue: 0, newValue: 0 },
    "week-day": { prevValue: 0, newValue: 0 },
    "day-month": { prevValue: 0, newValue: 0 },
    "month-day": { prevValue: 0, newValue: 0 },
    "week-month": { prevValue: 0, newValue: 0 },
    "month-week": { prevValue: 0, newValue: 0 },
  });

  const handlePeriodChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const targetPeriod = e.target.value as IChartPeriod;

      setPreviousNum(prev => {
        const key = `${chartPeriod}-${targetPeriod}`;
        const reverseKey = `${targetPeriod}-${chartPeriod}`;

        let newValue = 0;
        if (chartPeriod === "day" && targetPeriod === "week") {
          newValue = Math.ceil(prev / 7);
        } else if (chartPeriod === "day" && targetPeriod === "month") {
          newValue = Math.ceil(prev / 30);
        } else if (chartPeriod === "week" && targetPeriod === "day") {
          newValue = prev * 7;
        } else if (chartPeriod === "week" && targetPeriod === "month") {
          newValue = Math.ceil(prev / 4);
        } else if (chartPeriod === "month" && targetPeriod === "day") {
          newValue = prev * 30;
        } else if (chartPeriod === "month" && targetPeriod === "week") {
          newValue = prev * 4;
        }

        // Check if we already have a value stored for this conversion
        if (tempValues[key]?.prevValue === prev) {
          return tempValues[reverseKey].prevValue;
        }

        // Otherwise, store the new and previous values in tempValues
        setTempValues(prevTemp => ({
          ...prevTemp,
          [key]: {
            prevValue: prev,
            newValue: newValue,
          },
          [reverseKey]: {
            prevValue: newValue,
            newValue: prev,
          },
        }));

        return newValue;
      });

      // Update the chart period
      setChartFrequent(undefined);
      setDateRange({ from: undefined, to: undefined } as { from: string | undefined; to: string | undefined });
      setChartPeriod(targetPeriod);
    },
    [chartPeriod, tempValues]
  );

  const handleFrequentChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPreviousNum(0);
      setChartFrequent(e.target.value as IChartFrequent);
    },
    [chartPeriod, tempValues]
  );

  const handleResetValue = useCallback(() => {
    setTempValues({
      "day-week": { prevValue: 0, newValue: 0 },
      "week-day": { prevValue: 0, newValue: 0 },
      "day-month": { prevValue: 0, newValue: 0 },
      "month-day": { prevValue: 0, newValue: 0 },
      "week-month": { prevValue: 0, newValue: 0 },
      "month-week": { prevValue: 0, newValue: 0 },
    });
    setPreviousNum(0);
  }, []);

  const resetDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
    setChartFrequent(undefined);
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (!range) return;

    const formatDateTime = (date: Date, endOfDay: boolean = false) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = endOfDay ? "23" : "00";
      const minutes = endOfDay ? "59" : "00";
      const seconds = endOfDay ? "59" : "00";

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const formattedRange = {
      from: range.from ? formatDateTime(new Date(range.from)) : null,
      to: range.to ? formatDateTime(new Date(range.to), true) : null,
    };
    setPreviousNum(0);
    if (!chartFrequent) {
      setChartFrequent("hour");
    }
    setDateRange(formattedRange as { from: string | undefined; to: string | undefined });
  };

  const handleExportFile = useCallback(() => {
    if (waterVolumeData?.data) {
      if (exportType === "csv") {
        exportToCSV(waterVolumeData?.data, "Tingkat Air (m)");
      } else {
        exportToXLSX(waterVolumeData?.data, "Tingkat Air (m)");
      }
    }
  }, [waterVolumeData?.data, exportType]);

  return (
    <Box as="section" className="rgc-water-use-chart" w="full">
      <Flex justify="space-between" align="center" w="full" mb="12px">
        <HStack justifyContent={"flex-start"} alignItems={"center"}>
          <Heading fontSize="md">{title}</Heading>
          <SumButton firstLabel="Tinggi Maksimal = " label="m" sumData={highestValue} sumEachData={highestEachData} />
        </HStack>
        <Box display="flex" gap={2} alignItems={"center"}>
          <ExportButton
            isDisabledCSV={village_id === "all"}
            handleExportFile={handleExportFile}
            setExportType={setExportType}
          />
          <FilterButton
            handleDateRangeSelect={handleDateRangeSelect}
            handleFrequentChange={handleFrequentChange}
            handlePeriodChange={handlePeriodChange}
            chartFrequent={chartFrequent}
            dateRange={dateRange}
            previousNum={previousNum}
            setPreviousNum={setPreviousNum}
            resetDateRange={resetDateRange}
          />

          {/* <Button size="sm" minH="38px" w="40%">
            <Text>Jelajahi</Text>
          </Button> */}
        </Box>
      </Flex>
      {waterVolumeData?.data.series && !isFetching ? (
        <>
          {previousNum !== 0 && (
            <HStack w={"full"} justifyContent={"space-between"}>
              <Text>
                <Text as="span">
                  <Icon color="red" width={"12px"} h="12px" as={GiPlainCircle} />
                </Text>{" "}
                {previousNum} {localizeCharPeriod[chartPeriod as keyof typeof localizeCharPeriod]} yang lalu
              </Text>
              <Button
                color={"greymed.5"}
                onClick={handleResetValue}
                variant={"transparent"}
                textDecoration={"underline"}
                size={"sm"}
              >
                Reset
              </Button>
            </HStack>
          )}
          <Chart
            options={options}
            series={waterVolumeData?.data.series.sort((a, b) => (a.name > b.name ? 1 : -1))}
            type="area"
            height={350}
          />{" "}
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

export default WaterVolumeChart;
