import type { ReactNode } from "react";
import { BiSolidLockAlt } from "react-icons/bi";

import { useSession } from "next-auth/react";

import type { FlexProps } from "@chakra-ui/react";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Icon } from "@chakra-ui/react";

import type { ISidebarMenuItem } from "@/interfaces/layout";

import SidebarItem from "./SidebarItem";

interface SidebarItemProps extends FlexProps {
  href?: string;
  icon?: any;
  menus: ISidebarMenuItem[];
  children: ReactNode;
}
const SidebarItemWithSubMenu = ({ href = "#", icon, children, menus }: SidebarItemProps) => {
  const { data: session } = useSession();

  return (
    <Accordion allowToggle>
      <AccordionItem mx={4} my={1} border="none">
        <AccordionButton
          _hover={{
            bg: "primary.7",
            color: "greylight.1",
          }}
          p={4}
          borderRadius="lg"
          textAlign="left"
          border="none"
        >
          {icon && <Icon mr={4} fontSize={20} as={icon} />}
          {children}
          {session?.user?.status === "inactive" && !href.includes("helps") && (
            <Icon
              ml="auto"
              fontSize={20}
              _groupHover={{
                color: "greylight.1",
              }}
              as={BiSolidLockAlt}
            />
          )}

          <AccordionIcon marginLeft="auto" />
        </AccordionButton>
        <AccordionPanel pb={4} pl={0} w="full">
          {menus.map(subMenu => (
            <SidebarItem key={subMenu.path} href={subMenu.path} icon={subMenu.icon}>
              {subMenu.label}
            </SidebarItem>
          ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default SidebarItemWithSubMenu;
