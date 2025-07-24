import React from "react";

import type { FlexProps } from "@chakra-ui/react";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";

import type { IBadgeVillageProps } from "@/components/badge/Village";
import BadgeVillage from "@/components/badge/Village";
import type { IRegionDataItem } from "@/interfaces/region";

export interface IVillageBadgeListProps extends FlexProps, Pick<IBadgeVillageProps, "onClickDelete"> {
  villages: IRegionDataItem[];
  onAddNewVillage?: () => void;
  onDeleteSelectedVillage?: (selectedVillageId: number) => void;
}

const VillageBadgeList = ({ ...props }: IVillageBadgeListProps) => {
  return (
    <Flex className="village-list" direction="column" mt={5} {...props}>
      <Flex align="center" justify="space-between" mb={3}>
        <Heading size="md" mr={2}>
          Daftar Desa
        </Heading>
        {props.onAddNewVillage && (
          <Button minH={0} minW={0} py={1} size="sm" onClick={props.onAddNewVillage}>
            + Tambah Desa Baru
          </Button>
        )}
      </Flex>
      <Flex flexWrap="wrap" gap={2}>
        {props.villages?.map(village => (
          <BadgeVillage
            key={village.id}
            id={village.id}
            label={village.name}
            onClickDelete={props.onDeleteSelectedVillage}
          />
        ))}
      </Flex>
      {!props.villages && <Text color="gray.400">- Tidak ada data data desa -</Text>}
    </Flex>
  );
};

export default VillageBadgeList;
