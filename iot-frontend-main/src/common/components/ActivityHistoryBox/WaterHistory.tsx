import React from "react";

import Image from "next/image";

import { Box, Flex, Text } from "@chakra-ui/react";

import type { ActivityHistoryData } from "@/interfaces/activity";
import { dayjs } from "@/lib/dayjs";

interface WaterHistoryProps {
  isLast?: boolean;
  histData: ActivityHistoryData;
}

const WaterHistory = ({ isLast, histData }: WaterHistoryProps) => {
  return (
    <Flex className="activity_history-box" w="full" py={5}>
      <Box h={isLast ? 0 : "70px"}>
        <Box w="30px" h="30px" position="relative" bg="white">
          <Image src="/svg/checklist-circle.svg" alt="app-logo" fill />
        </Box>
        <Box w="2px" h="85%" mt={2} borderRadius="18px" bg="greylight.4" />
      </Box>
      <Flex direction="column" w="fill-available" ml={4} mt={1} justifyContent="space-between">
        <Text fontSize="body.3" mb="5px">
          {histData?.message}
        </Text>
        <Text fontStyle="italic" color="greymed.1">
          {dayjs().to(dayjs(histData?.created_at))}
        </Text>
      </Flex>
    </Flex>
  );
};

export default WaterHistory;
