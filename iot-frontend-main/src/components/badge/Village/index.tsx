import React from "react";
import { IoClose } from "react-icons/io5";

import { Badge, IconButton, Text } from "@chakra-ui/react";

export interface IBadgeVillageProps {
  onClickDelete?: (selectedVillageId: number) => void;
  label: string;
  id: number;
}

const BadgeVillage = ({ ...props }: IBadgeVillageProps) => {
  return (
    <Badge
      display="flex"
      alignItems="center"
      borderRadius="8px"
      px={3}
      py={3}
      background="primary.1"
      color="primary.7"
      border="2px solid"
      borderColor="primary.7"
    >
      <Text fontWeight="semibold" mr="2">
        {props.label}
      </Text>
      <IconButton
        onClick={() => props.onClickDelete?.(props.id)}
        variant={"transpararent"}
        minW={"20px"}
        minH="20px"
        maxH="20px"
        icon={<IoClose size="20px" color="primary.7" />}
        aria-label="btn-delete-village"
      />
    </Badge>
  );
};

export default BadgeVillage;
