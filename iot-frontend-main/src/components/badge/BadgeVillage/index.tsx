import type { ReactNode } from "react";
import { IoClose } from "react-icons/io5";

import type { BadgeProps } from "@chakra-ui/react";
import { Badge, IconButton } from "@chakra-ui/react";

const BadgeVillage = ({ children, onClose, ...props }: { children: ReactNode; onClose: () => void } & BadgeProps) => {
  return (
    <Badge border={"1px solid #0047FF"} pl="16px" pr="8px" py="6px" borderRadius={"8px"} {...props}>
      {children}
      <IconButton
        onClick={onClose}
        variant={"transpararent"}
        minW={"20px"}
        minH="20px"
        maxH="20px"
        icon={<IoClose size="20px" color="#0047FF" />}
        aria-label="btn-delete-village"
      ></IconButton>
    </Badge>
  );
};

export default BadgeVillage;
