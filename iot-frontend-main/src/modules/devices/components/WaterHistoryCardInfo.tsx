import React, { useEffect } from "react";

import { useRouter } from "next/router";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { ActivityHistoryBox } from "@/common/components";
import { dayjs } from "@/lib/dayjs";
import { getGroupedActivityHistList } from "@/services/activity";

const WaterHistoryCardInfo = () => {
  const { query } = useRouter();
  const village_id = query.villageId || null;

  const {
    data: deviceActHist,
    refetch: refetchDeviceActHist,
    isFetching,
  } = useQuery({
    queryKey: ["get_device_act_hist"],
    queryFn: () => getGroupedActivityHistList({ village_id: village_id as string }),
    refetchOnWindowFocus: false,
    enabled: Boolean(village_id),
  });

  useEffect(() => {
    if (query.villageId) {
      refetchDeviceActHist();
    }
  }, [query]);

  if (!deviceActHist) return <></>;

  return (
    <Box as="section">
      <Heading fontSize="md" mb={6}>
        Riwayat Aktivitas
      </Heading>
      <Box border="1.5px solid" borderColor="greylight.4" padding="35px 40px" borderRadius="20px">
        <Accordion
          border="1.5px solid"
          borderColor="greylight.4"
          borderRadius="18px"
          background="#F9FAFB"
          allowMultiple
          defaultIndex={[0]}
        >
          {deviceActHist?.data?.map((actHist, index) => (
            <AccordionItem borderTop="none" key={index}>
              <AccordionButton p="15px 20px">
                <Heading fontSize="md">
                  {dayjs(actHist.date).format("MMM")} {dayjs(actHist.date).format("YYYY")}
                </Heading>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel px={12}>
                {actHist?.activities?.map((hist, idx) => (
                  <ActivityHistoryBox
                    histData={hist}
                    key={idx}
                    type="alert"
                    isLast={actHist.activities.length - 1 === idx}
                  />
                ))}
                {/* <ActivityHistoryBox type="water" />
                  <ActivityHistoryBox type="water" />
                  <ActivityHistoryBox type="water" />
                  <ActivityHistoryBox type="water" isLast /> */}
              </AccordionPanel>
            </AccordionItem>
          ))}

          {/* <AccordionItem borderBottom="none">
            <AccordionButton p="15px 20px">
              <Heading fontSize="md">Juni 2023</Heading>
              <AccordionIcon />
            </AccordionButton>

            <AccordionPanel px={12}>
              <ActivityHistoryBox type="water" />
              <ActivityHistoryBox type="water" />
              <ActivityHistoryBox type="water" />
              <ActivityHistoryBox type="water" isLast />
            </AccordionPanel>
          </AccordionItem> */}
        </Accordion>
      </Box>
    </Box>
  );
};

export default WaterHistoryCardInfo;
