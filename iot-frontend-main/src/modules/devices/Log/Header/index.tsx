import type { SetStateAction } from "react";
import { Controller, type Control } from "react-hook-form";

import { Box, Button, Flex, HStack, Select, Text } from "@chakra-ui/react";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";

import HeaderTabs from "@/components/header/Tabs";
import type { TDeviceLogTabs } from "@/constants/headerTabs";
import { DEVICE_LOG_HEADER_TABS } from "@/constants/headerTabs";
import type { IResponseListApi } from "@/interfaces/common/list";
import type { GetStatusLogResponse } from "@/interfaces/device";
import type { IDataDropdown } from "@/interfaces/dropdown";
import type { IRequestGetDeviceTelemetryLogList, IWaterTelemetryLogItem } from "@/services/log/type";
import { PAGE_SIZE_LIMIT } from "@/services/log/useLogQuery";

import type { IFormDataLogList } from "../useFilterValue";

export interface IDeviceLogHeaderProps {
  control: Control<IFormDataLogList>;
  activeTab: TDeviceLogTabs;
  deviceList: IDataDropdown[];
  pageParam: number;
  setPageParam: React.Dispatch<SetStateAction<number>>;
  mutateTelemetryLog: UseMutateAsyncFunction<
    IResponseListApi<IWaterTelemetryLogItem>,
    unknown,
    IRequestGetDeviceTelemetryLogList,
    unknown
  >;
  mutateStatusLog: UseMutateAsyncFunction<
    GetStatusLogResponse,
    unknown,
    {
      code?: string | undefined;
      page_number?: string | number | undefined;
      page_size: string | number;
    },
    unknown
  >;
  deviceCode: string;
}

const DeviceLogHeader = ({ ...props }: IDeviceLogHeaderProps) => {
  return (
    <Flex direction="column" mb={3}>
      <Flex gap={2} mb={5}>
        <Controller
          name="activeTab"
          control={props.control}
          render={({ field: { onChange } }) => <HeaderTabs data={DEVICE_LOG_HEADER_TABS} onChange={onChange} />}
        />
      </Flex>
      <Flex align={{ base: "start", md: "center" }} justify="space-between" flexDir={{ base: "column", md: "row" }}>
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            {props.activeTab === "TELEMETRY_LOG" && "Telemetry Device Log"}
            {props.activeTab === "STATUS_LOG" && "Status Device Log"}
          </Text>
          <Text>
            Berikut adalah log dari{" "}
            <span style={{ fontWeight: "bold" }}>
              {" "}
              {props.activeTab === "TELEMETRY_LOG" ? "telemetri perangkat" : "status perangkat"}{" "}
            </span>
            {"."}
          </Text>
        </Box>
        {/* TODO: Make this component atomic */}
        <HStack>
          <Controller
            name="deviceCode"
            control={props.control}
            render={({ field: { onChange } }) => (
              <Select
                w={{ base: "170px", md: "200px" }}
                placeholder="Select option"
                onChange={e => onChange(e.target.value)}
              >
                {props.deviceList?.map((item, index) => (
                  <option key={index} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            )}
          />
          <HStack>
            <Button
              size="sm"
              variant="outline"
              isDisabled={props.pageParam <= 1}
              onClick={() => {
                if (props.pageParam > 1) {
                  props.mutateTelemetryLog({
                    page_number: (props.pageParam - 1).toString(),
                    page_size: String(PAGE_SIZE_LIMIT),
                    code: props.deviceCode,
                  });
                  props.mutateStatusLog({
                    page_number: (props.pageParam - 1).toString(),
                    page_size: String(PAGE_SIZE_LIMIT),
                    code: props.deviceCode,
                  });
                  props.setPageParam(prev => prev - 1);
                }
              }}
            >
              Prev
            </Button>
            <Text>{props.pageParam}</Text>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                props.mutateTelemetryLog({
                  page_number: (props.pageParam + 1).toString(),
                  page_size: String(PAGE_SIZE_LIMIT),
                  code: props.deviceCode,
                });
                props.mutateStatusLog({
                  page_number: (props.pageParam + 1).toString(),
                  page_size: String(PAGE_SIZE_LIMIT),
                  code: props.deviceCode,
                });
                props.setPageParam(prev => prev + 1);
              }}
            >
              Next
            </Button>
          </HStack>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default DeviceLogHeader;
