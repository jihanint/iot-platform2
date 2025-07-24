import React, { useCallback } from "react";
import { FiAlertCircle } from "react-icons/fi";

import { Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { AlertData } from "@/interfaces/alert";
import { dayjs } from "@/lib/dayjs";
import { markAlertAsDone } from "@/services/alert";

interface WarningBoxProps {
  alertData: AlertData;
  refetchData: () => void;
}

const WarningBox = ({ alertData, refetchData }: WarningBoxProps) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async () => {
      return await markAlertAsDone(alertData.id);
    },
    onSuccess: (res: any) => {
      refetchData();
      queryClient.invalidateQueries(["get_activity_history"]);
    },
    onError: (errorResponse: any) => {
      console.log(errorResponse);
    },
  });

  const onMarkAsDone = useCallback(() => {
    mutate();
  }, []);

  return (
    <Flex className="warning-box" w="full" py={5}>
      <IconButton variant="ghost" color="red" aria-label="alert-icon" icon={<FiAlertCircle fontSize="20px" />} />
      <Flex direction="column" className="warning-content" w="full" ml={2}>
        <Text fontSize="body.3" mb="2px">
          {`Desa ${alertData?.village_name}, ${alertData?.city_name}`}
        </Text>
        <Flex as="span" align="center" mb={{ base: "2px", md: "20px" }}>
          <Text fontSize="body.4" mr={1}>
            {alertData?.alert_type}
          </Text>
          <Text fontSize="body.4" fontWeight="semibold">
            {alertData?.message}
          </Text>
        </Flex>
        <Flex justify="space-between" w="full" direction={{ base: "column", md: "row" }}>
          <Text fontStyle="italic" color="greymed.1">
            {dayjs().to(dayjs(alertData?.created_at))}
          </Text>

          <Flex className="action" gap="8px" mt={{ base: "12px", md: "initial" }}>
            {/* <Button variant="outline-secondary" size="sm" minH="22px">
              <Text>Tinjau</Text>
            </Button> */}
            <Button size="sm" minH="22px" onClick={onMarkAsDone}>
              <Text>Selesaikan</Text>
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default WarningBox;
