import React from "react";
import { FiAlertCircle } from "react-icons/fi";

import { Box, Button, Flex, Heading, IconButton, Text } from "@chakra-ui/react";

const AlertBox = () => {
  return (
    <Flex
      className="alert_box-wrapper"
      bg="#FF3A29"
      px="26px"
      py="22px"
      borderRadius="6px"
      justify="space-between"
      align="center"
    >
      <Flex className="alert-content">
        <IconButton
          variant="ghost"
          color="white"
          aria-label="alert-icon"
          alignItems="flex-start"
          icon={<FiAlertCircle fontSize="20px" />}
        />
        <Box color="white" ml={4}>
          <Heading fontSize="md" mb="10px">
            Peringatan
          </Heading>
          <Text>Air Reservoir terdeteksi terlalu rendah.</Text>
        </Box>
      </Flex>
      <Button variant="outline-secondary" size="sm" minH="22px">
        <Text>Selesaikan</Text>
      </Button>
    </Flex>
  );
};

export default AlertBox;
