import { useEffect } from "react";

import { Box, Button, Divider, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { useRecoilValue } from "recoil";

import { RegionSelectorAtom } from "@/atoms/RegionAtom";

import { WarningBox } from "@/common/components";
import NotificationDrawer from "@/common/components/NotificationDrawer";
import { getAlertList } from "@/services/alert";

const WarningCardInfo = () => {
  const activeRegion = useRecoilValue(RegionSelectorAtom);

  const {
    data: alertList,
    isFetching,
    refetch: refetchAlertListData,
  } = useQuery({
    queryKey: ["get_alert_list"],
    queryFn: () => {
      if (activeRegion === "all") {
        return getAlertList({ page_number: 1, page_size: 3 });
      } else {
        return getAlertList({ area_id: activeRegion, page_number: 1, page_size: 3 });
      }
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetchAlertListData();
  }, [activeRegion]);

  return (
    <Flex pt="32px" pb={5} direction="column" borderRadius="20px" border="1px solid" borderColor="greylight.5">
      <HStack w="full" justifyContent={"space-between"} px={4}>
        <Heading fontWeight="medium" fontSize="heading.4">
          Peringatan
        </Heading>
        <NotificationDrawer
          button={
            <Button variant={"transparent"} textDecoration={"underline"} size={"sm"}>
              Lihat Semua
            </Button>
          }
        />
      </HStack>

      <Box className="warning-wrapper" px={4} mb={6}>
        {!isFetching &&
          alertList?.data?.map((alert, index) => (
            <Box key={index}>
              <WarningBox alertData={alert} refetchData={refetchAlertListData} />
              <Divider />
            </Box>
          ))}
      </Box>
      {!isFetching &&
        (alertList?.data.length === 0 ? (
          <Box textAlign="center">
            <Text>Tidak ada peringatan untuk kota yg dipilih</Text>
          </Box>
        ) : activeRegion !== "all" ? (
          <></>
        ) : (
          // <Button mx={3} size="sm">
          //   Lihat Semua Peringatan
          // </Button>
          <></>
        ))}
    </Flex>
  );
};

export default WarningCardInfo;
