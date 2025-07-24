import React from "react";
import { useMemo } from "react";
import Image from "next/image";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { useRecoilState } from "recoil";

import { RegionSelectorAtom } from "@/atoms/RegionAtom";

import { useUserState } from "@/common/hooks";
import type { IRegionDataItem } from "@/interfaces/region";
import { getVillageList } from "@/services/region";

const RegionBox = (params: IRegionDataItem & { isSelected: boolean; onClick: () => void }) => (
  <Flex
    key={params.id}
    as="div"
    align="center"
    className="regency-box"
    px="16px"
    py="8px"
    bg="transparent"
    cursor="pointer"
    minW="fit-content"
    w={"fit-content"}
    onClick={params.onClick}
    border="1px solid"
    borderRadius="8px"
    borderColor={params.isSelected ? "#1039A3" : "greylight.5"}
    background={params.isSelected ? "#1039A320" : "greylight.2"}
  >
    <Box mr="8px" className="regency-icon" position="relative" borderRadius="full" minW="32px" minH="32px">
      <Image src="/images/smile.jpeg" alt="regency-img" fill style={{ borderRadius: "100%" }} />
    </Box>
    <Text minW={"fit-content"} fontWeight="semibold" color={params.isSelected ? "#1039A3" : "greydark.2"}>
      {params.name}
    </Text>
  </Flex>
);

const RegionListSelector = () => {
  // const roles = useSession().data?.user.roles;
  const { isAdmin, userSession } = useUserState();
  const [selectedRegion, setSelectedRegion] = useRecoilState(RegionSelectorAtom);

  const { data: villages } = useQuery({
    queryKey: ["get_village"],
    queryFn: () => getVillageList({ is_assigned_for: isAdmin ? false : true, is_device_installed: true }),
    refetchOnWindowFocus: false,
  });

  if (!userSession) return <></>;

  return (
    <Flex as="div" direction="column" className="regencylist-selector">
      <Heading fontSize="heading.5" fontWeight="semibold" mb="16px">
        Daftar Desa
      </Heading>
      <Flex maxW={"full"} w="fit-content" gap={4} overflowX="auto">
        {RegionBox({
          id: 0,
          name: "Semua",
          isSelected: selectedRegion === "all",
          onClick: () => setSelectedRegion("all"),
        })}
        {villages?.data.map(region =>
          RegionBox({
            ...region,
            isSelected: selectedRegion === region.id,
            onClick: () => setSelectedRegion(region.id),
          })
        )}
      </Flex>
    </Flex>
  );
};

export default RegionListSelector;
