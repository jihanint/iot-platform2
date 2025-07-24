import React from "react";
import type { DateRange } from "react-day-picker";
import { DayPicker } from "react-day-picker";
import { BiChevronDown, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { IoClose, IoFilter } from "react-icons/io5";

import { AbsoluteCenter, Box, FormControl, FormLabel, HStack, Icon, IconButton, Select } from "@chakra-ui/react";
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";

import { DEFAULT_PERIOD } from "@/constants/layout";
import type { IChartFrequent } from "@/interfaces/layout";

export interface FilterButtonProps {
  dateRange: {
    from: string | undefined;
    to: string | undefined;
  };
  chartFrequent: IChartFrequent | undefined;
  previousNum: number;
  setPreviousNum: React.Dispatch<React.SetStateAction<number>>;
  handlePeriodChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleFrequentChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  resetDateRange: () => void;
  handleDateRangeSelect: (range: DateRange | undefined) => void;
}

const FilterButton = ({
  dateRange,
  previousNum,
  setPreviousNum,
  handlePeriodChange,
  handleFrequentChange,
  resetDateRange,
  handleDateRangeSelect,
  chartFrequent,
}: FilterButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          border={"1px solid"}
          borderColor={"greylight.4"}
          h="fit-content"
          minH={"fit-content"}
          px={1}
          py={2}
          m={0}
          w={"fit-content"}
          variant={"transparent"}
          fontSize="md"
          size={"sm"}
          leftIcon={<IoFilter size={"18px"} />}
        >
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Filter data</PopoverHeader>
        <PopoverBody>
          <VStack w={"full"}>
            <HStack w={"full"}>
              <IconButton
                icon={<Icon width={"28px"} h="28px" as={BiChevronLeft} />}
                aria-label="prev-chart-water"
                h="fit-content"
                minH={"fit-content"}
                w="fit-content"
                minW="fit-content"
                size={"sm"}
                onClick={() => setPreviousNum(previousNum + 1)}
              />
              <Select size={"sm"} defaultValue={DEFAULT_PERIOD} onChange={handlePeriodChange} w="full">
                <option value="day" selected>
                  Hari
                </option>
                <option value="week">Minggu</option>
                <option value="month">Bulan</option>
                {/* <option value="year">Tahun</option> */}
              </Select>
              <IconButton
                size={"sm"}
                icon={<Icon width={"28px"} h="28px" as={BiChevronRight} />}
                aria-label="prev-chart-water"
                h="fit-content"
                minH={"fit-content"}
                w="fit-content"
                minW="fit-content"
                onClick={() => setPreviousNum(previousNum - 1)}
                isDisabled={previousNum === 0}
              />
            </HStack>
            <Box w={"full"} position="relative" py={4}>
              <Box w={"full"} h={"1px"} border={"1px solid"} borderColor={"#ECECEE"} />
              <AbsoluteCenter bg="white" px="4">
                Or
              </AbsoluteCenter>
            </Box>
            <FormControl>
              <FormLabel size={"sm"}>Frekuensi</FormLabel>
              <Select size={"md"} value={chartFrequent} onChange={handleFrequentChange} w="full">
                <option value="hour" selected>
                  Jam
                </option>
                <option value="day">Hari</option>
                {/* <option value="year">Tahun</option> */}
              </Select>
            </FormControl>

            <Popover placement="bottom">
              <PopoverTrigger>
                <Button
                  color="greydark.5"
                  fontSize="14px"
                  minH={"40px"}
                  maxH={"40px"}
                  h={"40px"}
                  minW={"full"}
                  position="relative"
                  pr={dateRange.from ? "32px" : "24px"}
                  variant="outline"
                  borderColor={"#e2e8f0"}
                >
                  {dateRange.from
                    ? `${dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : ""} - ${
                        dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : ""
                      }`
                    : "Pilih Tanggal"}
                  <Icon
                    as={dateRange.from ? IoClose : BiChevronDown}
                    boxSize={5}
                    color="greydark_3"
                    position="absolute"
                    right={2}
                    onClick={dateRange.from ? resetDateRange : undefined}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  <DayPicker
                    endMonth={new Date()}
                    mode="range"
                    selected={dateRange as DateRange}
                    onSelect={handleDateRangeSelect}
                    // selected={dateRange as DateRange}
                    // onSelect={handleDateRangeSelect}
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default FilterButton;
