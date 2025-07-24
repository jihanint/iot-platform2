import Link from "next/link";
import { useRouter } from "next/router";

import { Flex, Text } from "@chakra-ui/react";

import { settingMenu } from "@/constants/menus";

const SettingMenu = () => {
  const { pathname } = useRouter();

  return (
    <Flex w="full" flexWrap="wrap" py={4} gap={12}>
      {settingMenu.map((menu, index) => (
        <Link key={index} href={menu?.path}>
          <Text fontWeight={pathname === menu.path ? "black" : "medium"}>{menu?.label}</Text>
        </Link>
      ))}
    </Flex>
  );
};

export default SettingMenu;
