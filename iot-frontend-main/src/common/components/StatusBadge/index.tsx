import { useMemo } from "react";

import type { FlexProps } from "@chakra-ui/react";
import { Box, Flex, Text } from "@chakra-ui/react";

interface StatusBadgeProps extends FlexProps {
  badgeStatus: number;
}

const StatusBadge = ({ badgeStatus, ...rest }: StatusBadgeProps) => {
  const badgeAttribute = useMemo(() => {
    switch (badgeStatus) {
      case 1:
        return {
          title: "Kritis",
          bgColor: "#EB433526",
          textColor: "#EB4335",
        };
      case 2:
        return {
          title: "Peringatan",
          bgColor: "#FFD9304D",
          textColor: "#FFD930",
        };
      case 3:
        return {
          title: "Normal",
          bgColor: "#16A34A1A",
          textColor: "#037847",
        };
      case 4:
        return {
          title: "Tidak Aktif",
          bgColor: "#DDE0E680",
          textColor: "#5D7285",
        };
      case 5:
        return {
          title: "Sudah Kalibrasi",
          bgColor: "#16A34A1A",
          textColor: "#037847",
        };
      case 6:
        return {
          title: "Belum Kalibrasi",
          bgColor: "#EB433526",
          textColor: "#EB4335",
        };
      case 7:
      default:
        return {
          title: "Tidak Aktif",
          bgColor: "#DDE0E680",
          textColor: "#5D7285",
        };
    }
  }, [badgeStatus]);

  return (
    <Flex
      className="status-badge"
      padding={{ base: "5px 8px", md: "5px 12px" }}
      bgColor={badgeAttribute.bgColor}
      align="center"
      gap="8px"
      borderRadius="20px"
      {...rest}
    >
      <Box className="dot" w="10px" h="10px" borderRadius="100%" bgColor={badgeAttribute.textColor} />
      <Text fontSize={{ base: "sm", md: "md" }} color={badgeAttribute.textColor}>
        {badgeAttribute.title}
      </Text>
    </Flex>
  );
};

export default StatusBadge;
