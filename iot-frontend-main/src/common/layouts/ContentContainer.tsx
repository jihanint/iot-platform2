import type { FC, PropsWithChildren } from "react";

import type { FlexProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

const ContentContainer: FC<PropsWithChildren<FlexProps>> = ({ children, ...rest }) => {
  return (
    <Box className="content-container" px={{ base: 2, lg: 12 }} pb={16} pt={12} {...rest}>
      {children}
    </Box>
  );
};

export default ContentContainer;
