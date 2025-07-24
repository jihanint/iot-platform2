import type { FC, PropsWithChildren } from "react";

import type { FlexProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

import { ContentContainer } from "@/common/layouts";

import ProfileHeader from "./ProfileHeader";
import SettingMenu from "./SettingMenu";

const BaseLayout: FC<PropsWithChildren<FlexProps>> = ({ children, ...rest }) => {
  return (
    <Box className="settings-content" {...rest}>
      <ProfileHeader />
      <ContentContainer pt={4}>
        <SettingMenu />
        {children}
      </ContentContainer>
    </Box>
  );
};

export default BaseLayout;
