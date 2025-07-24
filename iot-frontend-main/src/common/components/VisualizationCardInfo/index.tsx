import React from "react";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";

interface VisualizationCardInfoProps {
  title: string;
  value?: string | number;
  percentage?: string | number;
  timeInfo?: string | number;
}

const VisualizationCardInfo = ({ title, value, percentage, timeInfo }: VisualizationCardInfoProps) => {
  return (
    <Box w="100%" borderRadius="8px" border="1px solid" borderColor="greylight.5" px="16px" py="18px">
      <Heading fontWeight="semibold" fontSize="heading.6" mb="7px" color="greymed.1">
        {title}
      </Heading>
      <Heading fontSize="heading.5" mb="7px">
        {value}
      </Heading>
      <Flex align="flex-end">
        <Text fontSize="body.2" color="green.5" mr="8px">
          {percentage}
        </Text>
        <Text fontSize="body.3">{timeInfo}</Text>
      </Flex>
    </Box>
  );
};

export default VisualizationCardInfo;
