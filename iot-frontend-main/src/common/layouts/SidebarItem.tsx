import type { ReactNode } from "react";
import { BiSolidLockAlt } from "react-icons/bi";

import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import type { FlexProps } from "@chakra-ui/react";
import { Flex, Icon } from "@chakra-ui/react";

interface SidebarItemProps extends FlexProps {
  href?: string;
  icon?: any;
  children: ReactNode;
}

const SidebarItem = ({ href = "#", icon, children, ...props }: SidebarItemProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <Link href={href}>
      <Flex
        as="div"
        align="center"
        p={4}
        mx={4}
        my={1}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={href === router.asPath ? "primary.7" : "greylight.1"}
        color={href === router.asPath ? "greylight.1" : "greydark.2"}
        _hover={{
          bg: "primary.7",
          color: "greylight.1",
        }}
        {...props}
      >
        {icon && (
          <Icon
            mr={4}
            fontSize={20}
            _groupHover={{
              color: "greylight.1",
            }}
            as={icon}
          />
        )}
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
      </Flex>
    </Link>
  );
};

export default SidebarItem;
