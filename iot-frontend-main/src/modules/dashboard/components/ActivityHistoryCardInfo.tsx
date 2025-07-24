import { useEffect, useState } from "react";

import { Box, Flex, Heading, Select, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { ActivityHistoryBox } from "@/common/components";
import type { TimePeriod } from "@/interfaces/layout";
import { getActivityHistList } from "@/services/activity";
import { getTimePeriodID } from "@/utils/helper";

const ActivityHistoryCardInfo = () => {
  const [historyPeriod, setHistoryPeriod] = useState<TimePeriod>("day");

  const {
    data: actHistoryData,
    isFetching,
    refetch: refetchActHistData,
  } = useQuery({
    queryKey: ["get_activity_history"],
    queryFn: () => getActivityHistList({ interval: historyPeriod }),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetchActHistData();
  }, [historyPeriod]);

  return (
    <Flex pt="32px" direction="column" borderRadius="20px" border="1px solid" borderColor="greylight.5">
      <Flex justifyContent="space-between" px={7}>
        <Box>
          <Heading fontWeight="medium" fontSize="heading.4" mb="8px">
            Riwayat Aktivitas
          </Heading>
          <Flex align="flex-end">
            <Text fontSize="body.2" color="green.5" mr="8px">
              {!isFetching && actHistoryData?.data.difference}
            </Text>
            <Text fontSize="body.3">{getTimePeriodID(historyPeriod)} ini</Text>
          </Flex>
        </Box>
        <Box>
          <Select w="100%" defaultValue="day" onChange={e => setHistoryPeriod(e.target.value as TimePeriod)}>
            <option value="day">Hari</option>
            <option value="week">Minggu</option>
            <option value="month">Bulan</option>
          </Select>
        </Box>
      </Flex>

      {isFetching && (
        <Flex w="full" justify="center">
          <Spinner size="md" mx="auto" />
        </Flex>
      )}
      {/* {actHistoryData?.data.} */}
      <Box className="history-wrapper" px={4} mt={6}>
        {!isFetching &&
          actHistoryData?.data.data?.map((hist, index) => (
            <ActivityHistoryBox
              key={hist.id}
              type={hist.type}
              histData={hist}
              isLast={index === actHistoryData.data.data.length - 1}
            />
          ))}
      </Box>
    </Flex>
  );
};

export default ActivityHistoryCardInfo;
