import React, { useCallback, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";

import { Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";

import type { AlertData } from "@/interfaces/alert";
import { dayjs } from "@/lib/dayjs";
import { markAlertAsDone } from "@/services/alert";

interface NotificationBoxProps {
  notificationData: AlertData;
  refetchData: () => void;
  onClick: (id: number) => void;
}

const NotificationBox = ({ notificationData, refetchData, onClick }: NotificationBoxProps) => {
  const { mutate, isLoading, data, error } = useMutation({
    mutationFn: async () => {
      return await markAlertAsDone(notificationData.id);
    },
    onSuccess: (res: any) => {
      // console.log(res);
      refetchData();
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
          {`Desa ${notificationData?.village_name}, ${notificationData?.city_name}`}
        </Text>
        <Flex as="span" align="center" wrap={"wrap"}>
          <Text fontSize="body.4" mr={1}>
            {notificationData?.alert_type}{" "}
            <Text as={"span"} fontSize="body.4" fontWeight="semibold">
              {notificationData?.message}.
            </Text>{" "}
            {notificationData?.action}
          </Text>

          {/* <Text fontSize="body.4" mr={1}></Text> */}
        </Flex>
        <Text mb="20px" fontSize={"14px"} fontWeight="light">
          Tinjauan : {notificationData?.comment === "" ? "Belum Ada Tinjauan" : notificationData?.comment}
        </Text>
        <Flex justify="space-between" w="full">
          <Text fontStyle="italic" color="greymed.1">
            {dayjs().to(dayjs(notificationData?.created_at))}
          </Text>

          <Flex className="action" gap="8px">
            <Button onClick={() => onClick(notificationData.id)} variant="outline-secondary" size="sm" minH="22px">
              <Text>Tinjau</Text>
            </Button>
            <Button size="sm" minH="22px" onClick={onMarkAsDone}>
              <Text>Selesaikan</Text>
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default NotificationBox;
