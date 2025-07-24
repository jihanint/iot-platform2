import { useEffect, useState } from "react";
import { GrClose } from "react-icons/gr";

import type { UseToastOptions } from "@chakra-ui/react";
import { Flex, Stack, Text, useToast as useToastChakra } from "@chakra-ui/react";

export function useToast() {
  const [toast, setToast] = useState<UseToastOptions>();
  const toastChakra = useToastChakra();

  const bgColor = {
    info: "#2B4FB9",
    error: "#D40023",
    warning: "#FFB700",
    success: "#006400",
    loading: "#C2C2C2",
  };

  useEffect(() => {
    if (toast) {
      toastChakra({
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
        render: ({ onClose, title, description, status = "info" }) => (
          <Flex
            color="white"
            p={4}
            bg={bgColor[status]}
            borderRadius={8}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack>
              <Text>{title}</Text>
              {description && <Text fontSize="body.5">{description}</Text>}
            </Stack>
            <GrClose cursor="pointer" color="white" onClick={onClose} />
          </Flex>
        ),
        ...toast,
      });
    }
  }, [toast, toastChakra]);

  return setToast;
}

export default useToast;
