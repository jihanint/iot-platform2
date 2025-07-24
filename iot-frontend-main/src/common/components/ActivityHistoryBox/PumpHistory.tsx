import React from "react";

import Image from "next/image";

import { Box, Flex, Text } from "@chakra-ui/react";

import type { ActivityHistoryData } from "@/interfaces/activity";
import { dayjs } from "@/lib/dayjs";

interface PumpHistoryProps {
  isLast?: boolean;
  histData: ActivityHistoryData;
}

const PumpHistory = ({ isLast, histData }: PumpHistoryProps) => {
  return (
    <Flex className="activity_history-box" w="full" py={5}>
      <Box w="10%" h={isLast ? 0 : "70px"}>
        <Box w="30px" h="30px" position="relative" bg="white">
          <Image src="/svg/checklist-circle.svg" alt="app-logo" fill />
        </Box>
        <Box w="2px" h="85%" mt={2} borderRadius="18px" bg="greylight.4" />
      </Box>
      <Box w="fill-available">
        <Text fontSize="body.3" mb="5px">
          {histData.message}
        </Text>
        <Text fontStyle="italic" color="greymed.1">
          {dayjs().to(dayjs(histData?.created_at))}
        </Text>
      </Box>
    </Flex>
  );
};

export default PumpHistory;
